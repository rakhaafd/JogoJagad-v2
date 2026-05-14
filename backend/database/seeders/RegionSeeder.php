<?php

namespace Database\Seeders;

use App\Models\Region;
use App\Models\User;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        // create some creators
        $users = User::factory()->count(3)->create();

        foreach ($users as $u) {
            Region::factory()->count(4)->create(['created_by' => $u->id]);
        }
    }
}
