<?php

namespace Database\Factories;

use App\Models\Region;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Region> */
class RegionFactory extends Factory
{
    protected $model = Region::class;

    public function definition(): array
    {
        return [
            'name' => fake()->city(),
            'provinsi' => fake()->state(),
            'kota' => fake()->city(),
            'kecamatan' => fake()->word(),
            'kelurahan' => fake()->word(),
            'status' => fake()->randomElement(['aman', 'waspada', 'bahaya']),
            'disaster_type' => fake()->randomElement(['banjir', 'gempa', 'longsor', 'kebakaran']),
            'polygon' => [
                [fake()->latitude(-8, 6), fake()->longitude(95, 141)],
                [fake()->latitude(-8, 6), fake()->longitude(95, 141)],
                [fake()->latitude(-8, 6), fake()->longitude(95, 141)],
            ],
            'description' => fake()->sentence(),
            'advice' => fake()->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
