<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\WilayahService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private readonly WilayahService $wilayahService)
    {
    }
    public function registerUser(Request $request): Response
    {
        return $this->registerWithRole($request, 'user');
    }

    public function registerAdmin(Request $request): Response
    {
        return $this->registerWithRole($request, 'admin');
    }

    public function loginUser(Request $request): Response
    {
        return $this->loginWithRole($request, 'user');
    }

    public function loginAdmin(Request $request): Response
    {
        return $this->loginWithRole($request, 'admin');
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response([
            'message' => 'Logged out.',
        ]);
    }

    public function me(Request $request): Response
    {
        return response([
            'user' => $request->user(),
        ]);
    }

    private function registerWithRole(Request $request, string $role): Response
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ];

        if ($role === 'user') {
            $rules['kecamatan'] = ['required', 'string', 'max:255'];
            $rules['kota'] = ['required', 'string', 'max:255'];
            $rules['provinsi'] = ['required', 'string', 'max:255'];
        } else {
            $rules['kecamatan'] = ['nullable', 'string', 'max:255'];
            $rules['kota'] = ['nullable', 'string', 'max:255'];
            $rules['provinsi'] = ['nullable', 'string', 'max:255'];
        }

        $data = $request->validate($rules);

        if ($role === 'user') {
            $this->assertDomisiliValid(
                $data['provinsi'],
                $data['kota'],
                $data['kecamatan']
            );
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $role,
            'kecamatan' => $data['kecamatan'] ?? null,
            'kota' => $data['kota'] ?? null,
            'provinsi' => $data['provinsi'] ?? null,
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    private function loginWithRole(Request $request, string $role): Response
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])
            ->where('role', $role)
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $user->tokens()->delete();
        $token = $user->createToken('api')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
        ]);
    }

    private function assertDomisiliValid(string $provinsi, string $kota, string $kecamatan): void
    {
        if (! $this->wilayahService->isValidDomisili($provinsi, $kota, $kecamatan)) {
            abort(422, 'Domisili tidak ditemukan di data wilayah.');
        }
    }
}
