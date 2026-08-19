<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IdentityVerification;
use App\Models\VerificationAuditLog;
use App\Models\VerificationDocument;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class VerificationController extends Controller
{
    // ==========================================
    // FREELANCER VERIFICATION STATUS
    // ==========================================
    public function status(Request $request): JsonResponse
    {
        $user = $request->user()->load(['role', 'profile', 'identityVerification.documents']);
        
        $identity = $user->identityVerification;
        $identityStatus = $identity ? $identity->status : 'NOT_SUBMITTED';

        $isEmailVerified = !is_null($user->email_verified_at);
        $isPhoneVerified = !is_null($user->phone_verified_at);
        $isProfileCompleted = !is_null($user->profile_completed_at);

        // Overall progressive status calculation
        $overallStatus = 'UNVERIFIED';
        if (!$isEmailVerified) {
            $overallStatus = 'UNVERIFIED';
        } else if (!$isPhoneVerified) {
            $overallStatus = 'EMAIL_VERIFIED';
        } else if (!$isProfileCompleted) {
            $overallStatus = 'PHONE_VERIFIED';
        } else if ($identityStatus === 'NOT_SUBMITTED') {
            $overallStatus = 'PROFILE_INCOMPLETE';
        } else {
            $overallStatus = $identityStatus; // PENDING, VERIFIED, REJECTED, SUSPENDED
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'phone' => $user->phone,
                'email_verified' => $isEmailVerified,
                'phone_verified' => $isPhoneVerified,
                'profile_completed' => $isProfileCompleted,
                'identity_status' => $identityStatus,
                'overall_status' => $overallStatus,
                'is_fully_verified' => ($identityStatus === 'VERIFIED'),
                'rejection_reason' => $identity ? $identity->rejection_reason : null,
                'rejection_notes' => $identity ? $identity->rejection_notes : null,
                'submitted_at' => $identity ? $identity->submitted_at : null,
                'reviewed_at' => $identity ? $identity->reviewed_at : null,
                'documents_submitted' => $identity ? $identity->documents->pluck('document_type')->toArray() : [],
            ]
        ]);
    }

    // ==========================================
    // EMAIL VERIFICATION RESEND & VERIFY
    // ==========================================
    public function resendEmail(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->email_verified_at) {
            return response()->json([
                'success' => true,
                'message' => 'Email Anda sudah terverifikasi.'
            ]);
        }

        // Mock/Log mail verification link
        return response()->json([
            'success' => true,
            'message' => 'Link verifikasi email berhasil dikirimkan ke ' . $user->email,
        ]);
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->email_verified_at = now();
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Email berhasil verifikasi!',
            'data' => [
                'email_verified_at' => $user->email_verified_at
            ]
        ]);
    }

    // ==========================================
    // PHONE OTP SEND & VERIFY
    // ==========================================
    public function sendOtp(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Rate limit check: max 1 request every 60 seconds
        if ($user->last_otp_sent_at && now()->diffInSeconds($user->last_otp_sent_at) < 60) {
            $remaining = 60 - now()->diffInSeconds($user->last_otp_sent_at);
            return response()->json([
                'success' => false,
                'message' => "Tunggu {$remaining} detik sebelum meminta OTP kembali.",
            ], 429);
        }

        // Generate 6-digit random OTP
        $otp = sprintf('%06d', mt_rand(100000, 999999));
        
        $user->otp_hash = Hash::make($otp);
        $user->otp_expires_at = now()->addMinutes(5); // 5 mins validity
        $user->otp_attempts = 0;
        $user->last_otp_sent_at = now();
        $user->save();

        // Security rule: Never expose OTP plaintext in response for production
        // In local/log environment we log it for testing without SMS gateway
        \Log::info("OTP for User #{$user->id} ({$user->phone}): {$otp}");

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP 6 digit telah dikirimkan ke nomor WhatsApp Anda.',
            // For development ease, include dev_hint if app debug is enabled
            'dev_otp' => config('app.debug') ? $otp : null,
        ]);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'otp' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP harus 6 digit angka.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!$user->otp_hash || !$user->otp_expires_at) {
            return response()->json([
                'success' => false,
                'message' => 'Silakan minta kode OTP terlebih dahulu.'
            ], 400);
        }

        if (now()->greaterThan($user->otp_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.'
            ], 400);
        }

        if ($user->otp_attempts >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'Batas percobaan OTP terlampaui. Minta kode baru.'
            ], 429);
        }

        if (!Hash::check($request->otp, $user->otp_hash)) {
            $user->increment('otp_attempts');
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP salah. Sisa percobaan: ' . (5 - $user->otp_attempts)
            ], 400);
        }

        // Success: Clear OTP & set phone_verified_at
        $user->phone_verified_at = now();
        $user->otp_hash = null;
        $user->otp_expires_at = null;
        $user->otp_attempts = 0;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Nomor WhatsApp berhasil diverifikasi!',
            'data' => [
                'phone_verified_at' => $user->phone_verified_at
            ]
        ]);
    }

    // ==========================================
    // ONBOARDING SUBMIT
    // ==========================================
    public function submitOnboarding(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'displayName' => 'required|string|min:3',
            'profession' => 'required|string',
            'location' => 'required|string',
            'skills' => 'required|array|min:1',
            'bio' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data onboarding belum lengkap.',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::transaction(function () use ($user, $request) {
            $profile = $user->profile ?: $user->profile()->create([]);
            $profile->update([
                'title' => $request->profession,
                'location' => $request->location,
                'skills' => $request->skills,
                'bio' => $request->bio,
            ]);

            if ($request->filled('displayName')) {
                $user->name = $request->displayName;
            }
            $user->profile_completed_at = now();
            $user->save();
        });

        return response()->json([
            'success' => true,
            'message' => 'Onboarding profil berhasil diselesaikan!',
            'data' => [
                'profile_completed_at' => $user->profile_completed_at
            ]
        ]);
    }

    // ==========================================
    // IDENTITY VERIFICATION SUBMIT / RESUBMIT
    // ==========================================
    public function submitIdentity(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'full_name'         => 'required|string|min:3',
            'nik'               => 'required|string|digits:16',
            'birth_date'        => 'required|date',
            'gender'            => 'required|string|in:Laki-Laki,Perempuan,L,P',
            'address'           => 'required|string|min:5',
            'consent_given'     => 'required|accepted',
            'ktp_file'          => 'required|file|mimes:jpeg,jpg,png,webp|max:5120', // max 5MB
            'selfie_file'       => 'required|file|mimes:jpeg,jpg,png,webp|max:5120', // max 5MB
            // Optional extended fields
            'tempat_lahir'      => 'nullable|string|max:100',
            'kelurahan'         => 'nullable|string|max:100',
            'kecamatan'         => 'nullable|string|max:100',
            'kab_kota'          => 'nullable|string|max:100',
            'provinsi'          => 'nullable|string|max:100',
            'agama'             => 'nullable|string|max:50',
            'status_perkawinan' => 'nullable|string|max:50',
            'pekerjaan'         => 'nullable|string|max:100',
            'kewarganegaraan'   => 'nullable|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi pengajuan verifikasi identitas gagal.',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            DB::transaction(function () use ($user, $request) {
                // Create or update identity_verifications
                $verification = IdentityVerification::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'status'            => 'PENDING',
                        // Core identity
                        'full_name'         => $request->full_name,
                        'tempat_lahir'      => $request->tempat_lahir,
                        'nik_encrypted'     => $request->nik,  // Encrypted by Model cast
                        'birth_date'        => $request->birth_date,
                        'gender'            => $request->gender,
                        'address_encrypted' => $request->address, // Encrypted by Model cast
                        // Extended address
                        'kelurahan'         => $request->kelurahan,
                        'kecamatan'         => $request->kecamatan,
                        'kab_kota'          => $request->kab_kota,
                        'provinsi'          => $request->provinsi,
                        // Additional KTP fields
                        'agama'             => $request->agama,
                        'status_perkawinan' => $request->status_perkawinan,
                        'pekerjaan'         => $request->pekerjaan,
                        'kewarganegaraan'   => $request->kewarganegaraan ?? 'WNI',
                        // Consent
                        'consent_given'     => true,
                        'consent_at'        => now(),
                        'submitted_at'      => now(),
                        // Reset rejection info on resubmit
                        'rejection_reason'  => null,
                        'rejection_notes'   => null,
                    ]
                );

                // Private storage paths
                $ktpPath    = $request->file('ktp_file')->store('private/verifications/ktp');
                $selfiePath = $request->file('selfie_file')->store('private/verifications/selfie');

                // Clear old docs if resubmitting
                $verification->documents()->delete();

                // Save document records
                VerificationDocument::create([
                    'verification_id' => $verification->id,
                    'document_type'   => 'ktp',
                    'file_path'       => $ktpPath,
                ]);

                VerificationDocument::create([
                    'verification_id' => $verification->id,
                    'document_type'   => 'selfie',
                    'file_path'       => $selfiePath,
                ]);

                // Audit log
                VerificationAuditLog::create([
                    'admin_id'        => null,
                    'verification_id' => $verification->id,
                    'action'          => 'SUBMIT',
                    'notes'           => 'Freelancer mengajukan verifikasi identitas.',
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan verifikasi identitas berhasil dikirimkan. Tim SkillHub akan meninjau data Anda.',
                'data'    => ['status' => 'PENDING']
            ]);
        } catch (\Exception $e) {
            \Log::error('Submit identity verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan dokumen verifikasi. Coba beberapa saat lagi.',
            ], 500);
        }
    }

    // ==========================================
    // ADMIN: LIST ALL VERIFICATIONS
    // ==========================================
    public function adminIndex(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = IdentityVerification::with(['user.role', 'documents', 'reviewer'])
            ->orderBy('submitted_at', 'desc');

        if ($status && $status !== 'ALL') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $verifications = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $verifications
        ]);
    }

    // ==========================================
    // ADMIN: VIEW VERIFICATION DETAIL & AUDIT LOG
    // ==========================================
    public function adminShow(Request $request, int $id): JsonResponse
    {
        $admin = $request->user();
        $verification = IdentityVerification::with(['user.profile', 'documents', 'reviewer', 'auditLogs.admin'])
            ->findOrFail($id);

        // Audit Log for Viewing
        VerificationAuditLog::create([
            'admin_id' => $admin->id,
            'verification_id' => $verification->id,
            'action' => 'VIEW',
            'notes' => 'Admin melihat rincian verifikasi identitas.',
        ]);

        return response()->json([
            'success' => true,
            'data' => $verification
        ]);
    }

    // ==========================================
    // ADMIN: SERVE PRIVATE DOCUMENT SECURELY
    // ==========================================
    public function adminGetDocument(Request $request, int $docId)
    {
        $admin = $request->user();
        if (!$admin || $admin->role->name !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $document = VerificationDocument::findOrFail($docId);
        
        if (!Storage::exists($document->file_path)) {
            return response()->json(['message' => 'File tidak ditemukan'], 404);
        }

        return Storage::response($document->file_path);
    }

    // ==========================================
    // ADMIN: APPROVE VERIFICATION
    // ==========================================
    public function adminApprove(Request $request, int $id): JsonResponse
    {
        $admin = $request->user();
        $verification = IdentityVerification::findOrFail($id);

        DB::transaction(function () use ($verification, $admin) {
            $verification->update([
                'status' => 'VERIFIED',
                'reviewed_at' => now(),
                'reviewed_by' => $admin->id,
                'rejection_reason' => null,
                'rejection_notes' => null,
            ]);

            // Sync User verified state
            $user = $verification->user;
            $user->is_verified = true;
            $user->save();

            // Audit log
            VerificationAuditLog::create([
                'admin_id' => $admin->id,
                'verification_id' => $verification->id,
                'action' => 'APPROVE',
                'notes' => 'Verifikasi disetujui oleh Admin.',
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi identitas freelancer berhasil disetujui!'
        ]);
    }

    // ==========================================
    // ADMIN: REJECT VERIFICATION
    // ==========================================
    public function adminReject(Request $request, int $id): JsonResponse
    {
        $admin = $request->user();

        $validator = Validator::make($request->all(), [
            'reason' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Alasan penolakan wajib diisi.',
                'errors' => $validator->errors()
            ], 422);
        }

        $verification = IdentityVerification::findOrFail($id);

        DB::transaction(function () use ($verification, $admin, $request) {
            $verification->update([
                'status' => 'REJECTED',
                'reviewed_at' => now(),
                'reviewed_by' => $admin->id,
                'rejection_reason' => $request->reason,
                'rejection_notes' => $request->notes,
            ]);

            // Sync User verified state
            $user = $verification->user;
            $user->is_verified = false;
            $user->save();

            // Audit log
            VerificationAuditLog::create([
                'admin_id' => $admin->id,
                'verification_id' => $verification->id,
                'action' => 'REJECT',
                'reason' => $request->reason,
                'notes' => $request->notes,
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan verifikasi telah ditolak dengan catatan penolakan.'
        ]);
    }

    // ==========================================
    // ADMIN: REQUEST REVISION
    // ==========================================
    public function adminRequestRevision(Request $request, int $id): JsonResponse
    {
        $admin = $request->user();

        $validator = Validator::make($request->all(), [
            'reason' => 'required|string',
            'notes'  => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Alasan revisi wajib diisi.',
                'errors'  => $validator->errors()
            ], 422);
        }

        $verification = IdentityVerification::findOrFail($id);

        DB::transaction(function () use ($verification, $admin, $request) {
            $verification->update([
                'status'           => 'REVISION_REQUIRED',
                'reviewed_at'      => now(),
                'reviewed_by'      => $admin->id,
                'rejection_reason' => $request->reason,
                'rejection_notes'  => $request->notes,
            ]);

            // Audit log
            VerificationAuditLog::create([
                'admin_id'        => $admin->id,
                'verification_id' => $verification->id,
                'action'          => 'REQUEST_REVISION',
                'reason'          => $request->reason,
                'notes'           => $request->notes,
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Permintaan revisi telah dikirimkan ke freelancer.'
        ]);
    }
}
