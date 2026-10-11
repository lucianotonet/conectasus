<?php

namespace Database\Seeders;

use App\Models\HealthUnit;
use Illuminate\Database\Seeder;

class HealthUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            ['name' => 'UBS Centro', 'city' => 'Passo Fundo'],
            ['name' => 'UBS Centro', 'city' => 'Carazinho'],
            ['name' => 'UBS Vila Rodrigues', 'city' => 'Passo Fundo'],
            ['name' => 'UBS Annes', 'city' => 'Passo Fundo'],
            ['name' => 'UBS Boqueirão', 'city' => 'Passo Fundo'],
        ];

        foreach ($units as $unit) {
            HealthUnit::create($unit);
        }
    }
}
