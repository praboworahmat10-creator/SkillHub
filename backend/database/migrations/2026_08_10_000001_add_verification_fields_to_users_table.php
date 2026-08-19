<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('phone_verified_at')->nullable()->after('email_verified_at');
            $table->timestamp('profile_completed_at')->nullable()->after('phone_verified_at');
            $table->string('otp_hash')->nullable()->after('profile_completed_at');
            $table->timestamp('otp_expires_at')->nullable()->after('otp_hash');
            $table->integer('otp_attempts')->default(0)->after('otp_expires_at');
            $table->timestamp('last_otp_sent_at')->nullable()->after('otp_attempts');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone_verified_at',
                'profile_completed_at',
                'otp_hash',
                'otp_expires_at',
                'otp_attempts',
                'last_otp_sent_at'
            ]);
        });
    }
};
