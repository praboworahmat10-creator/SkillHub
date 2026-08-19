<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_job_id')->constrained('client_jobs')->onDelete('cascade');
            $table->foreignId('freelancer_id')->constrained('users')->onDelete('cascade');
            $table->text('cover_letter');
            $table->decimal('proposed_price', 12, 2);
            $table->integer('estimated_days');
            $table->json('relevant_skills')->nullable();
            $table->json('portfolio_ids')->nullable();
            $table->text('additional_notes')->nullable();
            $table->enum('status', [
                'draft',
                'sent',
                'viewed',
                'shortlisted',
                'accepted',
                'rejected',
                'withdrawn'
            ])->default('sent');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
