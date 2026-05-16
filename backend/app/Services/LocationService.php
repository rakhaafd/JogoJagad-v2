<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class LocationService
{
    private const WILAYAH_API_BASE = 'https://wilayah.id/api';
    private const CACHE_DURATION = 86400; // 24 hours

    public function getProvinces()
    {
        return Cache::remember('location_provinces', self::CACHE_DURATION, function () {
            try {
                $response = Http::get(self::WILAYAH_API_BASE . '/provinces.json');

                if (!$response->successful()) {
                    return [];
                }

                $data = $response->json();
                $dataArray = $data['data'] ?? $data;

                if (!is_array($dataArray)) {
                    return [];
                }

                return array_map(function ($item) {
                    return [
                        'code' => $item['code'] ?? $item['id'] ?? null,
                        'name' => $item['name'] ?? null,
                    ];
                }, $dataArray);
            } catch (\Exception $e) {
                logger()->error('Error fetching provinces: ' . $e->getMessage());
                return [];
            }
        });
    }

    // Get Kabupaten/Kota (regencies) by province code
    public function getRegencies($provinceCode)
    {
        $cacheKey = 'location_regencies_' . $provinceCode;

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($provinceCode) {
            try {
                $response = Http::get(self::WILAYAH_API_BASE . '/regencies/' . $provinceCode . '.json');

                if (!$response->successful()) {
                    return [];
                }

                $data = $response->json();
                $dataArray = $data['data'] ?? $data;

                if (!is_array($dataArray)) {
                    return [];
                }

                return array_map(function ($item) {
                    return [
                        'code' => $item['code'] ?? $item['id'] ?? null,
                        'name' => $item['name'] ?? null,
                    ];
                }, $dataArray);
            } catch (\Exception $e) {
                logger()->error('Error fetching regencies: ' . $e->getMessage());
                return [];
            }
        });
    }

    // Get Kecamatan (districts) by regency code
    public function getDistricts($regencyCode)
    {
        $cacheKey = 'location_districts_' . $regencyCode;

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($regencyCode) {
            try {
                $response = Http::get(self::WILAYAH_API_BASE . '/districts/' . $regencyCode . '.json');

                if (!$response->successful()) {
                    return [];
                }

                $data = $response->json();
                $dataArray = $data['data'] ?? $data;

                if (!is_array($dataArray)) {
                    return [];
                }

                return array_map(function ($item) {
                    return [
                        'code' => $item['code'] ?? $item['id'] ?? null,
                        'name' => $item['name'] ?? null,
                    ];
                }, $dataArray);
            } catch (\Exception $e) {
                logger()->error('Error fetching districts: ' . $e->getMessage());
                return [];
            }
        });
    }

    public function getVillages($districtCode)
    {
        $cacheKey = 'location_villages_' . $districtCode;

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($districtCode) {
            try {
                $response = Http::get(self::WILAYAH_API_BASE . '/villages/' . $districtCode . '.json');

                if (!$response->successful()) {
                    return [];
                }

                $data = $response->json();
                $dataArray = $data['data'] ?? $data;

                if (!is_array($dataArray)) {
                    return [];
                }

                return array_map(function ($item) {
                    return [
                        'code' => $item['code'] ?? $item['id'] ?? null,
                        'name' => $item['name'] ?? null,
                    ];
                }, $dataArray);
            } catch (\Exception $e) {
                logger()->error('Error fetching villages: ' . $e->getMessage());
                return [];
            }
        });
    }
}
