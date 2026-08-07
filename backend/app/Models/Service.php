<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'freelancer_id',
        'category_id',
        'title',
        'slug',
        'description',
        'price',
        'delivery_time_days',
        'revision_count',
        'status',
        'rating_avg',
        'reviews_count',
        'sales_count',
    ];

    protected $casts = [
        'price'      => 'float',
        'rating_avg' => 'float',
    ];

    // Scope: only active services
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ServiceImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ServiceImage::class)->where('is_primary', true);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
