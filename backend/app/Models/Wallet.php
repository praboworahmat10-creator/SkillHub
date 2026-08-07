<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'balance', 'pending_balance'];

    protected $casts = [
        'balance' => 'float',
        'pending_balance' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
