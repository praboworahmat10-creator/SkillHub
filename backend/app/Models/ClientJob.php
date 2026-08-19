<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientJob extends Model
{
    use HasFactory;

    protected $table = 'client_jobs';

    protected $fillable = [
        'client_id',
        'category_id',
        'title',
        'description',
        'scope_of_work',
        'requirements',
        'deliverables',
        'budget_min',
        'budget_max',
        'job_type',
        'experience_level',
        'is_remote',
        'location',
        'deadline_days',
        'required_skills',
        'attachments',
        'status',
    ];

    protected $casts = [
        'budget_min' => 'float',
        'budget_max' => 'float',
        'is_remote' => 'boolean',
        'required_skills' => 'array',
        'attachments' => 'array',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class, 'client_job_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'client_job_id');
    }
}
