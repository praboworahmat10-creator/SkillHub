<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * KtpOcrController
 *
 * Menerima foto KTP, mengirimnya ke Google Gemini Vision API,
 * mem-parse hasilnya, dan mengembalikan data terstruktur KTP Indonesia.
 *
 * Requires: GEMINI_API_KEY in .env
 */
class KtpOcrController extends Controller
{
    /**
     * Endpoint: POST /api/verification/ktp/ocr
     * Body: multipart/form-data → ktp_image (file)
     *
     * Returns JSON:
     * {
     *   "success": true,
     *   "data": {
     *     "nik": "3674011504040001",
     *     "nama": "GIOVEDI RAHMAT PRABOWO",
     *     "tempat_lahir": "TANGERANG",
     *     "tanggal_lahir": "2004-04-15",  // ISO 8601 yyyy-mm-dd
     *     "jenis_kelamin": "LAKI-LAKI",
     *     "alamat": "PANINGGILAN UTARA NO 33",
     *     "rt_rw": "001/005",
     *     "kelurahan": "PANINGGILAN UTARA",
     *     "kecamatan": "CILEDUG",
     *     "kab_kota": "KOTA TANGERANG",
     *     "provinsi": "BANTEN",
     *     "agama": "ISLAM",
     *     "status_perkawinan": "BELUM KAWIN",
     *     "pekerjaan": "PELAJAR/MAHASISWA",
     *     "kewarganegaraan": "WNI"
     *   },
     *   "confidence": "high"   // high | medium | low
     * }
     */
    public function extract(Request $request): JsonResponse
    {
        // ── 1. Validate Input ──────────────────────────────────────────────
        $validator = Validator::make($request->all(), [
            'ktp_image' => 'required|file|mimes:jpg,jpeg,png,webp|max:5120', // max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        // ── 2. Check API Key ───────────────────────────────────────────────
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'success'  => false,
                'message'  => 'Layanan OCR belum dikonfigurasi. Tambahkan GEMINI_API_KEY ke file .env backend.',
                'error_code' => 'OCR_UNAVAILABLE',
            ], 503);
        }

        // ── 3. Read & Encode Image ─────────────────────────────────────────
        $file      = $request->file('ktp_image');
        $mimeType  = $file->getMimeType();
        $imageData = base64_encode(file_get_contents($file->getRealPath()));

        // ── 4. Build Gemini Prompt ─────────────────────────────────────────
        $prompt = <<<PROMPT
Kamu adalah sistem OCR khusus untuk KTP Indonesia (Kartu Tanda Penduduk).
Analisis gambar KTP ini dengan teliti dan ekstrak SEMUA data yang terlihat.

Kembalikan HANYA JSON murni (tanpa markdown, tanpa komentar, tanpa teks lain) dengan format tepat ini:
{
  "nik": "16 digit NIK",
  "nama": "NAMA LENGKAP HURUF KAPITAL",
  "tempat_lahir": "KOTA TEMPAT LAHIR",
  "tanggal_lahir": "YYYY-MM-DD",
  "jenis_kelamin": "LAKI-LAKI atau PEREMPUAN",
  "alamat": "ALAMAT LENGKAP (nama jalan + nomor)",
  "rt_rw": "RT/RW misal 001/005",
  "kelurahan": "KELURAHAN atau DESA",
  "kecamatan": "KECAMATAN",
  "kab_kota": "KABUPATEN atau KOTA",
  "provinsi": "PROVINSI",
  "agama": "AGAMA",
  "status_perkawinan": "STATUS PERKAWINAN",
  "pekerjaan": "PEKERJAAN",
  "kewarganegaraan": "WNI atau WNA",
  "confidence": "high atau medium atau low berdasarkan kejelasan dan keterbacaan gambar"
}

ATURAN PENTING:
- NIK harus tepat 16 digit angka, tanpa spasi atau tanda baca.
- Tanggal lahir HARUS dalam format YYYY-MM-DD (bukan dd-mm-yyyy).
- Jika KTP adalah milik perempuan, tanggal lahir di KTP biasanya ditambah 40 pada hari — kembalikan tanggal aslinya (kurangi 40 dari hari jika > 40).
- Jika suatu field tidak dapat dibaca, isi dengan string kosong "".
- confidence "high" jika semua field terbaca jelas, "medium" jika beberapa field kurang jelas, "low" jika banyak field tidak terbaca.
- Jika gambar BUKAN KTP Indonesia, kembalikan: {"error": "Bukan KTP Indonesia"}
PROMPT;

        // ── 5. Call Gemini Vision API ──────────────────────────────────────
        try {
            $response = Http::timeout(30)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}",
                [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data'      => $imageData,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'temperature'     => 0.05,
                        'maxOutputTokens' => 1024,
                    ],
                ]
            );

            if (!$response->successful()) {
                Log::error('Gemini KTP OCR API error', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return response()->json([
                    'success'    => false,
                    'message'    => 'Gagal menghubungi layanan OCR. Silakan isi data secara manual.',
                    'error_code' => 'OCR_API_ERROR',
                ], 502);
            }

            // ── 6. Parse Gemini Response ───────────────────────────────────
            $rawText = $response->json('candidates.0.content.parts.0.text', '');

            // Strip possible markdown code fences: ```json ... ```
            $cleanJson = trim(preg_replace('/^```(?:json)?\s*/i', '', $rawText));
            $cleanJson = preg_replace('/\s*```$/', '', $cleanJson);

            $parsed = json_decode($cleanJson, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($parsed)) {
                Log::warning('Gemini KTP OCR – JSON parse failed', ['raw' => $rawText]);
                return response()->json([
                    'success'    => false,
                    'message'    => 'Gagal membaca data dari gambar KTP. Pastikan foto KTP jelas, tidak buram, dan pencahayaan cukup.',
                    'error_code' => 'OCR_PARSE_FAILED',
                ], 422);
            }

            if (isset($parsed['error'])) {
                return response()->json([
                    'success'    => false,
                    'message'    => $parsed['error'],
                    'error_code' => 'NOT_KTP',
                ], 422);
            }

            // ── 7. Normalize & Return ──────────────────────────────────────
            $confidence = $parsed['confidence'] ?? 'medium';
            unset($parsed['confidence']);

            // Normalize tanggal_lahir → YYYY-MM-DD
            if (!empty($parsed['tanggal_lahir'])) {
                $parsed['tanggal_lahir'] = self::normalizeBirthDate($parsed['tanggal_lahir']);
            }

            // Normalize NIK: keep only digits
            if (!empty($parsed['nik'])) {
                $parsed['nik'] = preg_replace('/\D/', '', $parsed['nik']);
                // Validate 16 digits
                if (strlen($parsed['nik']) !== 16) {
                    Log::warning('OCR returned invalid NIK length', ['nik' => $parsed['nik']]);
                    $parsed['nik'] = ''; // Let user fill manually
                    $confidence = 'low';
                }
            }

            return response()->json([
                'success'    => true,
                'data'       => $parsed,
                'confidence' => $confidence,
            ]);

        } catch (\Exception $e) {
            Log::error('KTP OCR exception', ['error' => $e->getMessage()]);
            return response()->json([
                'success'    => false,
                'message'    => 'Terjadi kesalahan sistem OCR. Silakan isi data secara manual.',
                'error_code' => 'OCR_EXCEPTION',
            ], 500);
        }
    }

    /**
     * Normalize various date formats found on Indonesian KTPs to YYYY-MM-DD.
     * Handles female KTP dates (day + 40).
     *
     * Examples:
     *   "14-07-1995" → "1995-07-14"
     *   "14/07/1995" → "1995-07-14"
     *   "14 Juli 1995" → "1995-07-14"
     *   "55-04-2004" → "2004-04-15"  (female: 55 - 40 = 15)
     */
    private static function normalizeBirthDate(string $raw): string
    {
        $raw = trim($raw);

        // Already ISO format
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $raw)) {
            return $raw;
        }

        // DD-MM-YYYY or DD/MM/YYYY
        if (preg_match('/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/', $raw, $m)) {
            $day = (int)$m[1];
            // Female KTP: day > 40, subtract 40
            if ($day > 40) $day -= 40;
            return sprintf('%04d-%02d-%02d', $m[3], $m[2], $day);
        }

        // DD MMMM YYYY (Indonesian month names)
        $months = [
            'JANUARI' => 1, 'FEBRUARI' => 2, 'MARET' => 3,
            'APRIL' => 4, 'MEI' => 5, 'JUNI' => 6,
            'JULI' => 7, 'AGUSTUS' => 8, 'SEPTEMBER' => 9,
            'OKTOBER' => 10, 'NOVEMBER' => 11, 'DESEMBER' => 12,
            'JAN' => 1, 'FEB' => 2, 'MAR' => 3, 'APR' => 4,
            'MAY' => 5, 'JUN' => 6, 'JUL' => 7, 'AUG' => 8,
            'SEP' => 9, 'OCT' => 10, 'NOV' => 11, 'DEC' => 12,
        ];

        if (preg_match('/^(\d{1,2})\s+([A-Z]+)\s+(\d{4})$/i', strtoupper($raw), $m)) {
            $monthNum = $months[$m[2]] ?? null;
            if ($monthNum) {
                $day = (int)$m[1];
                if ($day > 40) $day -= 40;
                return sprintf('%04d-%02d-%02d', $m[3], $monthNum, $day);
            }
        }

        // Try strtotime as last resort
        $ts = strtotime($raw);
        if ($ts !== false) {
            return date('Y-m-d', $ts);
        }

        return $raw;
    }
}
