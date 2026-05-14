<?php

namespace Database\Factories;

use App\Models\DonationCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<DonationCampaign> */
class DonationCampaignFactory extends Factory
{
    protected $model = DonationCampaign::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraphs(2, true),
            'image_path' => fake()->imageUrl(800, 450),
            'target_amount' => fake()->numberBetween(100000, 10000000),
            'current_amount' => 0,
        ];
    }
}
