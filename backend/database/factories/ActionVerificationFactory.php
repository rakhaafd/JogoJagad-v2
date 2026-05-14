<?php

namespace Database\Factories;

use App\Models\ActionVerification;
use App\Models\Action;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ActionVerification> */
class ActionVerificationFactory extends Factory
{
    protected $model = ActionVerification::class;

    public function definition(): array
    {
        $categories = ['valid', 'invalid', 'needs_review'];

        return [
            'action_id' => Action::factory(),
            'admin_id' => User::factory()->state(['role' => 'admin']),
            'category' => fake()->randomElement($categories),
            'points_awarded' => fake()->numberBetween(0, 100),
            'notes' => fake()->sentence(),
            'verified_at' => now(),
        ];
    }
}
