<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    private const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

    public function getCurrentByCity(string $city): array
    {
        $response = Http::timeout(10)->get(self::BASE_URL, [
            'q' => $city,
            'appid' => env('API_WEATHER'),
        ]);

        if (! $response->ok()) {
            return [
                'ok' => false,
                'status' => $response->status(),
                'error' => $response->json(),
            ];
        }

        return [
            'ok' => true,
            'status' => $response->status(),
            'data' => $response->json(),
        ];
    }
}
