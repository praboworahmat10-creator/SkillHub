<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'title',
        'location',
        'website',
        'github',
        'linkedin',
        'skills',
        'hourly_rate',
        'rating_avg',
        'reviews_count',
    ];

    protected $casts = [
        'skills'      => 'array',
        'hourly_rate' => 'float',
        'rating_avg'  => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
