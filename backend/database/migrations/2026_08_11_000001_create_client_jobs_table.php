<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->text('scope_of_work')->nullable();
            $table->text('requirements')->nullable();
            $table->text('deliverables')->nullable();
            $table->decimal('budget_min', 12, 2);
            $table->decimal('budget_max', 12, 2);
            $table->enum('job_type', ['fixed_price', 'hourly'])->default('fixed_price');
            $table->enum('experience_level', ['entry', 'intermediate', 'expert'])->default('intermediate');
            $table->boolean('is_remote')->default(true);
            $table->string('location')->default('Indonesia');
            $table->integer('deadline_days')->default(14);
            $table->json('required_skills')->nullable();
            $table->json('attachments')->nullable();
            $table->enum('status', ['open', 'in_progress', 'completed', 'closed'])->default('open');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_jobs');
    }
};
