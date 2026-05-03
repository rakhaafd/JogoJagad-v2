<?php

namespace App\Http\Controllers;

use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WeatherController extends Controller
{
    public function __construct(private readonly WeatherService $weatherService)
    {
    }

    public function current(Request $request): Response
    {
        $city = $request->user()->kota;

        if (! $city) {
            return response([
                'message' => 'Kota belum diisi di profil.',
            ], 422);
        }

        $result = $this->weatherService->getCurrentByCity($city);

        if (! $result['ok']) {
            return response([
                'message' => 'Gagal mengambil data cuaca.',
                'error' => $result['error'],
            ], 502);
        }

        return response([
            'city' => $city,
            'weather' => $result['data'],
        ]);
    }
}
