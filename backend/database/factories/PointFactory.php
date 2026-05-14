<?php

namespace Database\Factories;

use App\Models\Point;
use App\Models\User;
use App\Models\Action;
use App\Models\Donation;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Point> */
class PointFactory extends Factory
{
    protected $model = Point::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'points' => fake()->numberBetween(1, 100),
            'source_type' => fake()->randomElement([
                Action::class,
                Donation::class,
                'App\\Models\\AiQuiz',
            ]),
            'source_id' => null,
            'notes' => fake()->sentence(),
        ];
    }
}
