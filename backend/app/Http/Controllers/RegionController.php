<?php

namespace App\Http\Controllers;

use App\Mail\RegionAlertMail;
use App\Models\Region;
use App\Models\User;
use App\Services\WilayahService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;

class RegionController extends Controller
{
    public function __construct(private readonly WilayahService $wilayahService)
    {
    }

    public function index(): Response
    {
        return response([
            'regions' => Region::query()->latest()->get(),
        ]);
    }

    public function show(Region $region): Response
    {
        return response([
            'region' => $region,
        ]);
    }

    public function store(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'provinsi' => ['required', 'string', 'max:255'],
            'kota' => ['required', 'string', 'max:255'],
            'kecamatan' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:aman,waspada,bahaya'],
            'description' => ['nullable', 'string'],
            'disaster_type' => ['nullable', 'string', 'max:255'],
            'polygon' => ['nullable', 'array'],
        ]);

        $this->assertDomisiliValid(
            $data['provinsi'],
            $data['kota'],
            $data['kecamatan']
        );

        $region = Region::create([
            'name' => $data['provinsi'] . ' - ' . $data['kota'] . ' - ' . $data['kecamatan'],
            'provinsi' => $data['provinsi'],
            'kota' => $data['kota'],
            'kecamatan' => $data['kecamatan'],
            'status' => $data['status'],
            'disaster_type' => $data['disaster_type'] ?? 'general',
            'polygon' => $data['polygon'] ?? [],
            'description' => $data['description'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        $this->sendAlertEmails($region);

        return response([
            'region' => $region,
        ], 201);
    }

    public function update(Request $request, Region $region): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'provinsi' => ['sometimes', 'string', 'max:255', 'required_with:kota,kecamatan'],
            'kota' => ['sometimes', 'string', 'max:255', 'required_with:provinsi,kecamatan'],
            'kecamatan' => ['sometimes', 'string', 'max:255', 'required_with:provinsi,kota'],
            'status' => ['sometimes', 'in:aman,waspada,bahaya'],
            'description' => ['nullable', 'string'],
            'disaster_type' => ['nullable', 'string', 'max:255'],
            'polygon' => ['nullable', 'array'],
        ]);

        if (isset($data['provinsi'], $data['kota'], $data['kecamatan'])) {
            $this->assertDomisiliValid(
                $data['provinsi'],
                $data['kota'],
                $data['kecamatan']
            );
        }

        $region->fill($data);

        if (isset($data['provinsi'], $data['kota'], $data['kecamatan'])) {
            $region->name = $data['provinsi'] . ' - ' . $data['kota'] . ' - ' . $data['kecamatan'];
        }

        $shouldNotify = $region->isDirty(['status', 'description', 'provinsi', 'kota', 'kecamatan']);
        $region->save();

        if ($shouldNotify) {
            $this->sendAlertEmails($region);
        }

        return response([
            'region' => $region->fresh(),
        ]);
    }

    private function assertDomisiliValid(string $provinsi, string $kota, string $kecamatan): void
    {
        if (! $this->wilayahService->isValidDomisili($provinsi, $kota, $kecamatan)) {
            abort(422, 'Domisili tidak ditemukan di data wilayah.');
        }
    }

    private function sendAlertEmails(Region $region): void
    {
        User::query()
            ->where('role', 'user')
            ->where('provinsi', $region->provinsi)
            ->where('kota', $region->kota)
            ->where('kecamatan', $region->kecamatan)
            ->select(['id', 'name', 'email'])
            ->chunkById(100, function ($users) use ($region) {
                foreach ($users as $user) {
                    Mail::to($user->email)->send(new RegionAlertMail($user, $region));
                }
            });
    }
}
