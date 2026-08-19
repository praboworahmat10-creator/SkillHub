<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationAuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'verification_id',
        'action',
        'reason',
        'notes',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function verification()
    {
        return $this->belongsTo(IdentityVerification::class, 'verification_id');
    }
}
