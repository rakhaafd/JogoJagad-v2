<?php

namespace Database\Factories;

use App\Models\Action;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Action> */
class ActionFactory extends Factory
{
    protected $model = Action::class;

    public function definition(): array
    {
        $statuses = ['pending', 'verified', 'rejected'];
        $types = ['laporan', 'kontribusi', 'pelaporan lingkungan'];

        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'action_type' => fake()->randomElement($types),
            'description' => fake()->paragraphs(3, true),
            'photo_path' => null,
            'status' => fake()->randomElement($statuses),
        ];
    }
}
