<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_job_id',
        'freelancer_id',
        'cover_letter',
        'proposed_price',
        'estimated_days',
        'relevant_skills',
        'portfolio_ids',
        'additional_notes',
        'status',
    ];

    protected $casts = [
        'proposed_price' => 'float',
        'relevant_skills' => 'array',
        'portfolio_ids' => 'array',
    ];

    public function clientJob()
    {
        return $this->belongsTo(ClientJob::class, 'client_job_id');
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }

    public function contract()
    {
        return $this->hasOne(Contract::class, 'proposal_id');
    }
}
