<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    private const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    private const WILAYAH_BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

    public function getCurrentByCity(string $city): array
    {
        $apiKey = env('API_WEATHER');
        if (! $apiKey) {
            return [
                'ok' => false,
                'status' => 500,
                'error' => ['message' => 'API_WEATHER belum diatur.'],
            ];
        }

        $attemptedQueries = [];
        $lastError = null;
        $lastStatus = 502;

        foreach ($this->buildCityQueryCandidates($city) as $query) {
            $attemptedQueries[] = $query;

            $response = Http::timeout(10)->get(self::BASE_URL, [
                'q' => $query,
                'appid' => $apiKey,
            ]);

            if ($response->ok()) {
                return [
                    'ok' => true,
                    'status' => $response->status(),
                    'data' => $response->json(),
                ];
            }

            $lastStatus = $response->status();
            $lastError = $response->json();
        }

        return [
            'ok' => false,
            'status' => $lastStatus,
            'error' => [
                'message' => 'Lokasi kota tidak dikenali oleh layanan cuaca.',
                'city' => $city,
                'attempted_queries' => $attemptedQueries,
                'upstream_error' => $lastError,
            ],
        ];
    }

    private function buildCityQueryCandidates(string $city): array
    {
        $raw = trim($city);
        $baseCandidates = [$raw];

        if ($this->looksLikeWilayahCode($raw)) {
            $resolved = $this->resolveRegencyNameByCode($raw);
            if ($resolved) {
                $baseCandidates[] = $resolved;
            }
        }

        $strippedPrefix = preg_replace('/^(kabupaten|kota)\s+/i', '', $raw) ?? $raw;
        if ($strippedPrefix !== $raw) {
            $baseCandidates[] = $strippedPrefix;
        }

        $queries = [];
        foreach ($baseCandidates as $candidate) {
            $clean = trim($candidate);
            if ($clean === '') {
                continue;
            }

            $queries[] = $clean;
            $queries[] = $clean . ',ID';
        }

        return array_values(array_unique($queries));
    }

    private function looksLikeWilayahCode(string $value): bool
    {
        return (bool) preg_match('/^\d+(\.\d+)*$/', trim($value));
    }

    private function resolveRegencyNameByCode(string $code): ?string
    {
        $normalizedCode = preg_replace('/\D+/', '', $code) ?? '';
        if (strlen($normalizedCode) < 4) {
            return null;
        }

        $provinceCode = substr($normalizedCode, 0, 2);
        $regencyCode = substr($normalizedCode, 0, 4);

        $response = Http::timeout(10)->get(self::WILAYAH_BASE_URL . '/regencies/' . $provinceCode . '.json');
        if (! $response->ok()) {
            return null;
        }

        foreach (($response->json() ?? []) as $item) {
            if (($item['id'] ?? null) === $regencyCode) {
                return $item['name'] ?? null;
            }
        }

        return null;
    }
}
