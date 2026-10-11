<?php

namespace Database\Seeders;

use App\Models\HealthUnit;
use App\Models\Patient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Patient::factory()->count(50)->create();

        // Paciente com nome definido apenas para garantir na consulta 3 de sql/consultas.sql
        Patient::factory()->create([
            'name'           => 'Luciano Tonet',
            'health_unit_id' => HealthUnit::where('name', 'UBS Centro')->first()->id,
        ]);
    }
}
