<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WilayahService
{
    private const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

    public function isValidDomisili(string $provinsi, string $kota, string $kecamatan, string $kelurahan): bool
    {
        $provinceCode = $this->findProvinceCodeByName($provinsi);
        if ($provinceCode === null) {
            return false;
        }

        $regencyCode = $this->findRegencyCodeByName($provinceCode, $kota);
        if ($regencyCode === null) {
            return false;
        }

        $districtCode = $this->findDistrictCodeByName($regencyCode, $kecamatan);
        if ($districtCode === null) {
            return false;
        }

        return $this->findVillageCodeByName($districtCode, $kelurahan) !== null;
    }

    private function findProvinceCodeByName(string $name): ?string
    {
        $items = $this->getJson(self::BASE_URL . '/provinces.json');
        if ($items === null) {
            return null;
        }

        foreach ($items ?? [] as $item) {
            if ($this->normalize($item['name'] ?? '') === $this->normalize($name)) {
                return $item['id'] ?? null;
            }
        }

        return null;
    }

    private function findRegencyCodeByName(string $provinceCode, string $name): ?string
    {
        $items = $this->getJson(self::BASE_URL . '/regencies/' . $provinceCode . '.json');
        if ($items === null) {
            return null;
        }

        foreach ($items ?? [] as $item) {
            if ($this->normalize($item['name'] ?? '') === $this->normalize($name)) {
                return $item['id'] ?? null;
            }
        }

        return null;
    }

    private function findDistrictCodeByName(string $regencyCode, string $name): ?string
    {
        $items = $this->getJson(self::BASE_URL . '/districts/' . $regencyCode . '.json');
        if ($items === null) {
            return null;
        }

        foreach ($items ?? [] as $item) {
            if ($this->normalize($item['name'] ?? '') === $this->normalize($name)) {
                return $item['id'] ?? null;
            }
        }

        return null;
    }

    private function findVillageCodeByName(string $districtCode, string $name): ?string
    {
        $items = $this->getJson(self::BASE_URL . '/villages/' . $districtCode . '.json');
        if ($items === null) {
            return null;
        }

        foreach ($items ?? [] as $item) {
            if ($this->normalize($item['name'] ?? '') === $this->normalize($name)) {
                return $item['id'] ?? null;
            }
        }

        return null;
    }

    private function getJson(string $url): ?array
    {
        $response = Http::timeout(10)->get($url);

        if (! $response->ok()) {
            return null;
        }

        return $response->json();
    }

    private function normalize(string $value): string
    {
        return mb_strtolower(trim($value));
    }
}
