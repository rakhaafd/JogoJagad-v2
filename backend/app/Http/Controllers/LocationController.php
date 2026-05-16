<?php

namespace App\Http\Controllers;

use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    protected LocationService $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function getProvinces(): JsonResponse
    {
        $provinces = $this->locationService->getProvinces();
        return response()->json([
            'data' => $provinces,
        ]);
    }

    public function getRegencies(Request $request): JsonResponse
    {
        $provinceCode = $request->query('province_code');

        if (!$provinceCode) {
            return response()->json([
                'error' => 'Province code is required',
                'data' => [],
            ], 400);
        }

        $regencies = $this->locationService->getRegencies($provinceCode);
        return response()->json([
            'data' => $regencies,
        ]);
    }

    public function getDistricts(Request $request): JsonResponse
    {
        $regencyCode = $request->query('regency_code');

        if (!$regencyCode) {
            return response()->json([
                'error' => 'Regency code is required',
                'data' => [],
            ], 400);
        }

        $districts = $this->locationService->getDistricts($regencyCode);
        return response()->json([
            'data' => $districts,
        ]);
    }
    public function getVillages(Request $request): JsonResponse
    {
        $districtCode = $request->query('district_code');

        if (!$districtCode) {
            return response()->json([
                'error' => 'District code is required',
                'data' => [],
            ], 400);
        }

        $villages = $this->locationService->getVillages($districtCode);
        return response()->json([
            'data' => $villages,
        ]);
    }
}
