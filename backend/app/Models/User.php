<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'role_id',
        'name',
        'email',
        'phone',
        'password',
        'avatar',
        'is_verified',
        'email_verified_at',
        'phone_verified_at',
        'profile_completed_at',
        'otp_hash',
        'otp_expires_at',
        'otp_attempts',
        'last_otp_sent_at',
        'provider',
        'provider_id',
        'availability_status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_hash',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'profile_completed_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'last_otp_sent_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function identityVerification()
    {
        return $this->hasOne(IdentityVerification::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'freelancer_id');
    }

    public function portfolios()
    {
        return $this->hasMany(Portfolio::class, 'freelancer_id');
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class, 'freelancer_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'freelancer_id');
    }

    public function clientJobs()
    {
        return $this->hasMany(ClientJob::class, 'client_id');
    }
}
