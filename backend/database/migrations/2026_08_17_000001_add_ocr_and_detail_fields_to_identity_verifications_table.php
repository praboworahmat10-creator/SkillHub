<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('identity_verifications', function (Blueprint $table) {
            // Additional identity fields from KTP
            $table->string('tempat_lahir')->nullable()->after('full_name');
            $table->string('kelurahan')->nullable()->after('address_encrypted');
            $table->string('kecamatan')->nullable()->after('kelurahan');
            $table->string('kab_kota')->nullable()->after('kecamatan');
            $table->string('provinsi')->nullable()->after('kab_kota');
            $table->string('agama')->nullable()->after('provinsi');
            $table->string('status_perkawinan')->nullable()->after('agama');
            $table->string('pekerjaan')->nullable()->after('status_perkawinan');
            $table->string('kewarganegaraan')->nullable()->after('pekerjaan');

            // OCR metadata
            $table->text('ocr_raw_result_encrypted')->nullable()->after('kewarganegaraan');
            $table->string('ocr_confidence', 10)->nullable()->after('ocr_raw_result_encrypted'); // high|medium|low
        });

        // Update status enum to include REVISION_REQUIRED
        // SQLite doesn't support ALTER COLUMN for enums, so we handle this gracefully
        // For MySQL, use the raw statement below. For SQLite (dev), skip.
        if (config('database.default') !== 'sqlite') {
            DB::statement("ALTER TABLE identity_verifications MODIFY COLUMN status ENUM('NOT_SUBMITTED','PENDING','VERIFIED','REJECTED','SUSPENDED','REVISION_REQUIRED') DEFAULT 'NOT_SUBMITTED'");
        }
    }

    public function down(): void
    {
        Schema::table('identity_verifications', function (Blueprint $table) {
            $table->dropColumn([
                'tempat_lahir',
                'kelurahan',
                'kecamatan',
                'kab_kota',
                'provinsi',
                'agama',
                'status_perkawinan',
                'pekerjaan',
                'kewarganegaraan',
                'ocr_raw_result_encrypted',
                'ocr_confidence',
            ]);
        });
    }
};
