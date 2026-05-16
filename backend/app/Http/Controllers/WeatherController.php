<?php

namespace App\Http\Controllers;

use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WeatherController extends Controller
{
    public function __construct(private readonly WeatherService $weatherService) {}

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
            $status = $result['status'] ?? 502;
            $errorMessage = $result['error']['message'] ?? 'Gagal mengambil data cuaca.';

            return response([
                'message' => $errorMessage,
                'error' => $result['error'],
            ], $status >= 400 ? $status : 502);
        }

        return response([
            'city' => $city,
            'weather' => $result['data'],
        ]);
    }
}
