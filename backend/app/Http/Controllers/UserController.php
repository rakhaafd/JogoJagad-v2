<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        return response([
            'users' => User::query()->latest()->get(),
        ]);
    }

    public function show(Request $request, User $user): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        return response([
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['sometimes', 'in:admin,user'],
            'kecamatan' => ['sometimes', 'string', 'max:255'],
            'kota' => ['sometimes', 'string', 'max:255'],
            'provinsi' => ['sometimes', 'string', 'max:255'],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response([
            'user' => $user->fresh(),
        ]);
    }

    public function destroy(Request $request, User $user): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $user->delete();

        return response([
            'message' => 'User deleted.',
        ]);
    }

    public function destroyAll(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $deleted = User::query()->delete();

        return response([
            'message' => 'All users deleted.',
            'deleted' => $deleted,
        ]);
    }

    public function updateProfile(Request $request): Response
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:6'],
            'kecamatan' => ['sometimes', 'string', 'max:255'],
            'kota' => ['sometimes', 'string', 'max:255'],
            'provinsi' => ['sometimes', 'string', 'max:255'],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response([
            'user' => $user->fresh(),
        ]);
    }
}
