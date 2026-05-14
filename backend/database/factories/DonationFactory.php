<?php

namespace Database\Factories;

use App\Models\Donation;
use App\Models\DonationCampaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Donation> */
class DonationFactory extends Factory
{
    protected $model = Donation::class;

    public function definition(): array
    {
        $statuses = ['pending', 'paid', 'failed'];
        $providers = ['midtrans', 'manual'];

        return [
            'user_id' => User::factory(),
            'donation_campaign_id' => DonationCampaign::factory(),
            'amount' => fake()->numberBetween(10000, 500000),
            'currency' => 'IDR',
            'status' => fake()->randomElement($statuses),
            'provider' => fake()->randomElement($providers),
            'external_id' => fake()->uuid(),
            'checkout_url' => fake()->optional()->url(),
            'paid_at' => null,
            'metadata' => [],
        ];
    }
}
