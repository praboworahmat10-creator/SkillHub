<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdentityVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        // Core identity
        'full_name',
        'tempat_lahir',
        'nik_encrypted',
        'birth_date',
        'gender',
        'address_encrypted',
        // Extended address
        'kelurahan',
        'kecamatan',
        'kab_kota',
        'provinsi',
        // Additional KTP fields
        'agama',
        'status_perkawinan',
        'pekerjaan',
        'kewarganegaraan',
        // OCR metadata
        'ocr_raw_result_encrypted',
        'ocr_confidence',
        // Consent
        'consent_given',
        'consent_at',
        // Review timestamps
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        // Rejection details
        'rejection_reason',
        'rejection_notes',
    ];

    protected $casts = [
        'nik_encrypted'             => 'encrypted',
        'address_encrypted'         => 'encrypted',
        'ocr_raw_result_encrypted'  => 'encrypted',
        'consent_given'             => 'boolean',
        'consent_at'                => 'datetime',
        'submitted_at'              => 'datetime',
        'reviewed_at'               => 'datetime',
        'birth_date'                => 'date',
    ];

    /**
     * Valid verification statuses.
     */
    const STATUSES = [
        'NOT_SUBMITTED',
        'PENDING',
        'VERIFIED',
        'REJECTED',
        'SUSPENDED',
        'REVISION_REQUIRED',
    ];

    protected $appends = ['masked_nik'];

    // ── Relationships ──────────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function documents()
    {
        return $this->hasMany(VerificationDocument::class, 'verification_id');
    }

    public function auditLogs()
    {
        return $this->hasMany(VerificationAuditLog::class, 'verification_id');
    }

    // ── Accessors ──────────────────────────────────────────────────────────

    /**
     * Returns a masked NIK: first 4 digits + stars + last 4 digits.
     * e.g. 3674011504040001 → 3674★★★★★★★★0001
     */
    public function getMaskedNikAttribute(): string
    {
        try {
            $raw = $this->nik_encrypted;
            if (!$raw || strlen($raw) < 8) {
                return '★★★★★★★★★★★★★★★★';
            }
            return substr($raw, 0, 4) . str_repeat('★', max(0, strlen($raw) - 8)) . substr($raw, -4);
        } catch (\Exception $e) {
            return '★★★★★★★★★★★★★★★★';
        }
    }
}
