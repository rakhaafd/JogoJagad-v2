<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('regions', function (Blueprint $table) {
            $table->string('provinsi')->after('name');
            $table->string('kota')->after('provinsi');
            $table->string('kecamatan')->after('kota');

            $table->index(['provinsi', 'kota', 'kecamatan']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('regions', function (Blueprint $table) {
            $table->dropIndex(['provinsi', 'kota', 'kecamatan']);
            $table->dropIndex(['status']);
            $table->dropColumn(['provinsi', 'kota', 'kecamatan']);
        });
    }
};
