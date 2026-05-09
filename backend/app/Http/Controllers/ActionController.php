<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\ActionVerification;
use App\Models\Point;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ActionController extends Controller
{
    // Untuk User: Melihat daftar aksi mereka sendiri
    public function index(Request $request): Response
    {
        $actions = Action::with('verification')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response(['actions' => $actions]);
    }

    // Untuk User: Mengupload laporan aksi
    public function store(Request $request): Response
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'action_type' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'photo' => ['required', 'image', 'max:5120'], // Max 5MB
        ]);

        $photoPath = $request->file('photo')->store('actions', 'public');

        $action = Action::create([
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'action_type' => $data['action_type'],
            'description' => $data['description'],
            'photo_path' => $photoPath,
            'status' => 'pending',
        ]);

        return response(['action' => $action], 201);
    }

    // Untuk User: Melihat detail aksinya
    public function show(Request $request, string $id): Response
    {
        $action = Action::with('verification')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response(['action' => $action]);
    }

    // Untuk User: Mengubah laporan aksi sebelum diverifikasi
    public function update(Request $request, string $id): Response
    {
        $action = Action::where('user_id', $request->user()->id)->findOrFail($id);

        if ($action->status !== 'pending') {
            return response(['message' => 'Status laporan aksi sudah diproses dan tidak dapat diubah.'], 400);
        }

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'action_type' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'photo' => ['sometimes', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('actions', 'public');
        }

        $action->update($data);

        return response(['action' => $action->fresh()]);
    }

    // Untuk User: Menghapus laporan aksi sebelum diverifikasi
    public function destroy(Request $request, string $id): Response
    {
        $action = Action::where('user_id', $request->user()->id)->findOrFail($id);

        if ($action->status !== 'pending') {
            return response(['message' => 'Status laporan aksi sudah diproses dan tidak dapat dihapus.'], 400);
        }

        $action->delete();

        return response(['message' => 'Laporan aksi dihapus.']);
    }

    // Untuk Admin: Melihat semua aksi (bisa difilter yang status 'pending')
    public function adminIndex(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $query = Action::with(['user', 'verification'])->latest();

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        return response(['actions' => $query->get()]);
    }

    // Untuk Admin: Melihat detail aksi berdasarkan id
    public function adminShow(Request $request, string $id): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $action = Action::with(['user', 'verification'])->findOrFail($id);

        return response(['action' => $action]);
    }

    // Untuk Admin: Menolak / Menghapus aksi yang tidak valid
    public function adminDestroy(Request $request, string $id): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $action = Action::findOrFail($id);
        $action->delete();

        return response(['message' => 'Laporan aksi telah ditolak dan dihapus oleh admin.']);
    }

    // Untuk Admin: Memverifikasi aksi dan memberi label (poin otomatis)
    public function verify(Request $request, string $id): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $action = Action::findOrFail($id);

        if ($action->status !== 'pending') {
            return response(['message' => 'Aksi ini sudah diverifikasi sebelumnya.'], 400);
        }

        $data = $request->validate([
            'category' => ['required', 'in:Minor,Moderate,Major'],
            'notes' => ['nullable', 'string'],
        ]);

        // Asign Poin berdasarkan category
        $pointsAwarded = match ($data['category']) {
            'Minor' => 30,
            'Moderate' => 60,
            'Major' => 90,
        };

        // Update status Action
        $action->update(['status' => 'verified']);

        // Buat record verifikasi
        $verification = ActionVerification::create([
            'action_id' => $action->id,
            'admin_id' => $request->user()->id,
            'category' => $data['category'],
            'points_awarded' => $pointsAwarded,
            'notes' => $data['notes'] ?? null,
            'verified_at' => now(),
        ]);

        // Berikan poin kepada user
        Point::create([
            'user_id' => $action->user_id,
            'points' => $pointsAwarded,
            'source_type' => Action::class,
            'source_id' => $action->id,
            'notes' => 'Reward aksi preventif: ' . $action->title . ' (' . $data['category'] . ')',
        ]);

        return response([
            'message' => 'Aksi berhasil diverifikasi dan poin telah ditambahkan.',
            'action' => $action->fresh('verification'),
        ]);
    }
}
