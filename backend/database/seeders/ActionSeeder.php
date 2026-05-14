<?php

namespace Database\Seeders;

use App\Models\Action;
use App\Models\ActionVerification;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActionSeeder extends Seeder
{
    public function run(): void
    {
        // create some users
        $users = User::factory()->count(6)->create();

        // create actions for users
        foreach ($users as $u) {
            Action::factory()->count(3)->create(['user_id' => $u->id]);
        }

        // create admin and verify some actions
        $admin = User::firstWhere('role', 'admin') ?: User::factory()->create(['role' => 'admin', 'email' => 'admin2@example.com']);

        $actions = Action::inRandomOrder()->limit(8)->get();
        foreach ($actions as $a) {
            ActionVerification::factory()->create([
                'action_id' => $a->id,
                'admin_id' => $admin->id,
            ]);
        }
    }
}
