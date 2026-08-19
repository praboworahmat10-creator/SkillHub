<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_job_id',
        'proposal_id',
        'client_id',
        'freelancer_id',
        'amount',
        'start_date',
        'end_date',
        'status',
        'terms',
    ];

    protected $casts = [
        'amount' => 'float',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function clientJob()
    {
        return $this->belongsTo(ClientJob::class, 'client_job_id');
    }

    public function proposal()
    {
        return $this->belongsTo(Proposal::class, 'proposal_id');
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }
}
