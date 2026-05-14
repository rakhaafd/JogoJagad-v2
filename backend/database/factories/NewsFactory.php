<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<News> */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $categories = ['Umum', 'Pengumuman', 'Kegiatan', 'Tips', 'Berita Lokal'];

        return [
            'author_id' => User::factory(),
            'title' => fake()->sentence(6),
            'category' => fake()->randomElement($categories),
            'content' => fake()->paragraphs(5, true),
            'thumbnail_path' => null,
        ];
    }
}
