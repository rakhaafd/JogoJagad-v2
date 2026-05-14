<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin and some users, then seed news for testing
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Ensure admin exists and seed various features for testing
        $this->call(NewsSeeder::class);
        $this->call(RegionSeeder::class);
        $this->call(ActionSeeder::class);
        $this->call(DonationSeeder::class);
        $this->call(PointSeeder::class);
    }
}
