<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'verification_id',
        'document_type',
        'file_path',
    ];

    public function identityVerification()
    {
        return $this->belongsTo(IdentityVerification::class, 'verification_id');
    }
}
