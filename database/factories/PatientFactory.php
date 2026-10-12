<?php

namespace Database\Factories;

use App\Models\HealthUnit;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'cpf' => fake()->unique()->numerify('###########'), // Gera CPFs apenas numéricos, sem dígitos verificadores
            'birth_date' => fake()->dateTimeBetween('-90 years', '-1 year')->format('Y-m-d'),
            'phone' => fake()->phoneNumber(),
            'health_unit_id' => HealthUnit::where('name', '!=', 'UBS Boqueirão')->inRandomOrder()->value('id'), // Deixa uma UBS de fora intencionalmente
        ];
    }
}
