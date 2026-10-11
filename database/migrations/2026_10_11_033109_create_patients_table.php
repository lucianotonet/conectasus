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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('cpf', 11)->unique();
            $table->date('birth_date');
            $table->string('phone', 20)->unique();
            $table->foreignId('health_unit_id')
                ->constrained('health_units')
                ->restrictOnDelete(); // Proteção para unidade de saúde não ser excluída se tiver pacientes

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
