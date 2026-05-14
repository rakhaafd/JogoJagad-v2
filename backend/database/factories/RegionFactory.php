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
            'status' => 'active',
            'disaster_type' => null,
            'polygon' => null,
            'description' => fake()->sentence(),
            'advice' => fake()->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
