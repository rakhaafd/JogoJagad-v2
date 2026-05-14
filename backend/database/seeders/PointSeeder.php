<?php

namespace Database\Seeders;

use App\Models\Point;
use App\Models\User;
use Illuminate\Database\Seeder;

class PointSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory()->count(6)->create();

        foreach ($users as $u) {
            Point::factory()->count(5)->create(['user_id' => $u->id]);
        }
    }
}
