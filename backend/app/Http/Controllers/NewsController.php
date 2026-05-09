<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    // Untuk Semua User: Melihat daftar berita terbaru
    public function index(): Response
    {
        $news = News::with('author:id,name,role')->latest()->get();

        return response(['news' => $news]);
    }

    // Untuk Semua User: Melihat detail satu berita
    public function show(string $id): Response
    {
        $news = News::with('author:id,name,role')->findOrFail($id);

        return response(['news' => $news]);
    }

    // Untuk Admin: Membuat Berita
    public function store(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'thumbnail' => ['required', 'image', 'max:5120'], // Max 5MB
        ]);

        $thumbnailPath = $request->file('thumbnail')->store('news', 'public');

        $news = News::create([
            'author_id' => $request->user()->id,
            'title' => $data['title'],
            'category' => $data['category'],
            'content' => $data['content'],
            'thumbnail_path' => $thumbnailPath,
        ]);

        return response(['news' => $news], 201);
    }

    // Untuk Admin: Mengupdate Berita
    public function update(Request $request, string $id): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $news = News::findOrFail($id);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'thumbnail' => ['sometimes', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('thumbnail')) {
            // Hapus file lama jika ada
            if ($news->thumbnail_path) {
                Storage::disk('public')->delete($news->thumbnail_path);
            }
            $data['thumbnail_path'] = $request->file('thumbnail')->store('news', 'public');
        }

        $news->update($data);

        return response(['news' => $news->fresh()]);
    }

    // Untuk Admin: Menghapus 1 Berita
    public function destroy(Request $request, string $id): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        $news = News::findOrFail($id);

        if ($news->thumbnail_path) {
            Storage::disk('public')->delete($news->thumbnail_path);
        }

        $news->delete();

        return response(['message' => 'Berita berhasil dihapus.']);
    }

    // Untuk Admin: Menghapus Semua Berita
    public function destroyAll(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            return response(['message' => 'Forbidden.'], 403);
        }

        // Hapus folder news beserta fotonya
        Storage::disk('public')->deleteDirectory('news');

        $deleted = News::query()->delete();

        return response([
            'message' => 'Seluruh berita berhasil dihapus.',
            'deleted' => $deleted
        ]);
    }
}
