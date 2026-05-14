<?php

namespace Database\Seeders;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure there's an admin
        $admin = User::firstWhere('role', 'admin') ?: User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Create some regular users
        User::factory()->count(5)->create();

        // Create news authored by admin
        News::factory()->count(8)->create(['author_id' => $admin->id]);

        // Create a few news by random users
        $users = User::where('role', '!=', 'admin')->limit(3)->get();
        foreach ($users as $u) {
            News::factory()->count(2)->create(['author_id' => $u->id]);
        }
    }
}
