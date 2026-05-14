<?php

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\DonationCampaign;
use App\Models\User;
use Illuminate\Database\Seeder;

class DonationSeeder extends Seeder
{
    public function run(): void
    {
        // create some campaigns
        $campaigns = DonationCampaign::factory()->count(4)->create();

        // create users
        $users = User::factory()->count(6)->create();

        // create donations
        foreach ($users as $u) {
            foreach ($campaigns->random(2) as $c) {
                Donation::factory()->create([
                    'user_id' => $u->id,
                    'donation_campaign_id' => $c->id,
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
            }
        }

        // update campaign current_amount
        foreach ($campaigns as $c) {
            $c->current_amount = $c->donations()->sum('amount');
            $c->save();
        }
    }
}
