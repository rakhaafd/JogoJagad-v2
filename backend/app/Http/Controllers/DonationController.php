<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\DonationCampaign;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    // === PUBLIC/USER ENDPOINTS ===

    public function index(): Response
    {
        $campaigns = DonationCampaign::latest()->get();
        return response(['campaigns' => $campaigns]);
    }

    public function show(string $id): Response
    {
        $campaign = DonationCampaign::with(['donations' => function ($q) {
            $q->where('status', 'PAID')->latest()->take(10)->with('user:id,name');
        }])->findOrFail($id);

        return response(['campaign' => $campaign]);
    }

    public function donate(Request $request, string $id): Response
    {
        $campaign = DonationCampaign::findOrFail($id);

        $request->validate([
            'amount' => 'required|integer|min:10000',
        ]);

        $amount = $request->amount;
        $user = $request->user();
        $externalId = 'don-' . Str::uuid()->toString();

        $xenditApiKey = config('services.xendit.key');
        if (!$xenditApiKey) {
            return response(['message' => 'Payment gateway belum dikonfigurasi.'], 500);
        }

        $xenditBaseUrl = rtrim(config('services.xendit.base_url', 'https://api.xendit.co'), '/');

        try {
            // Call Xendit API natively
            $response = Http::timeout(15)
                ->withBasicAuth($xenditApiKey, '')
                ->post($xenditBaseUrl . '/v2/invoices', [
                    'external_id' => $externalId,
                    'amount' => $amount,
                    'description' => 'Donasi: ' . $campaign->title,
                    'customer' => [
                        'given_names' => $user->name ?? 'Anonim',
                        'email' => $user->email ?? '',
                    ],
                    'success_redirect_url' => url('/'),
                ]);
        } catch (ConnectionException $exception) {
            Log::error('Xendit connection failed: ' . $exception->getMessage());

            return response(['message' => 'Payment gateway tidak dapat dihubungi.'], 503);
        }

        if (!$response->ok()) {
            Log::error('Xendit Error: ' . $response->body());

            $errorPayload = $response->json();
            $errorMessage = is_array($errorPayload) && isset($errorPayload['message'])
                ? $errorPayload['message']
                : 'Gagal membuat tagihan pembayaran.';

            return response(['message' => $errorMessage], 502);
        }

        $xenditData = $response->json();

        // Create Transaction Record
        $donation = Donation::create([
            'user_id' => $user->id,
            'donation_campaign_id' => $campaign->id,
            'amount' => $amount,
            'status' => 'PENDING',
            'external_id' => $externalId,
            'checkout_url' => $xenditData['invoice_url'] ?? null,
            'metadata' => ['invoice_id' => $xenditData['id'] ?? null],
        ]);

        return response([
            'message' => 'Tagihan berhasil dibuat.',
            'checkout_url' => $donation->checkout_url,
            'donation' => $donation
        ]);
    }

    public function userHistory(Request $request): Response
    {
        $donations = Donation::with('campaign')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response(['donations' => $donations]);
    }

    // === XENDIT WEBHOOK ===
    public function webhook(Request $request): Response
    {
        // Xendit Webhook Verification if callback token is set (optional but recommended)
        $xenditCallbackToken = config('services.xendit.callback_token');
        if ($xenditCallbackToken && $request->header('x-callback-token') !== $xenditCallbackToken) {
            return response(['message' => 'Invalid Callback Token'], 403);
        }

        $externalId = $request->input('external_id');
        $status = $request->input('status');

        if (!$externalId || !$status) {
            return response(['message' => 'Invalid Payload'], 400);
        }

        $donation = Donation::where('external_id', $externalId)->first();
        if (!$donation) {
            return response(['message' => 'Donation not found'], 404);
        }

        if ($donation->status === 'PAID') {
            return response(['message' => 'Already paid']);
        }

        if ($status === 'PAID') {
            $donation->update([
                'status' => 'PAID',
                'paid_at' => now(),
            ]);

            // Increment amount in campaign
            $campaign = $donation->campaign;
            if ($campaign) {
                $campaign->increment('current_amount', $donation->amount);
            }
        } elseif ($status === 'EXPIRED') {
            $donation->update(['status' => 'EXPIRED']);
        }

        return response(['message' => 'Success']);
    }

    // === ADMIN ENDPOINTS ===

    public function adminIndex(Request $request): Response
    {
        $campaigns = DonationCampaign::withCount('donations')->latest()->get();
        return response(['campaigns' => $campaigns]);
    }

    public function adminShow(string $id): Response
    {
        $campaign = DonationCampaign::with(['donations.user'])->findOrFail($id);
        return response(['campaign' => $campaign]);
    }

    public function update(Request $request, string $id): Response
    {
        $campaign = DonationCampaign::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'target_amount' => 'sometimes|integer|min:0',
            'image' => 'sometimes|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($campaign->image_path) {
                Storage::disk('public')->delete($campaign->image_path);
            }
            $data['image_path'] = $request->file('image')->store('campaigns', 'public');
        }

        $campaign->update($data);

        return response(['campaign' => $campaign->fresh()]);
    }

    public function destroy(string $id): Response
    {
        $campaign = DonationCampaign::findOrFail($id);

        if ($campaign->image_path) {
            Storage::disk('public')->delete($campaign->image_path);
        }

        $campaign->delete();

        return response(['message' => 'Kampanye donasi berhasil dihapus.']);
    }

    public function destroyAll(): Response
    {
        Storage::disk('public')->deleteDirectory('campaigns');

        $deleted = DonationCampaign::query()->delete();

        return response([
            'message' => 'Seluruh kampanye donasi berhasil dihapus.',
            'deleted' => $deleted
        ]);
    }

    public function store(Request $request): Response
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'target_amount' => 'required|integer|min:0',
            'image' => 'required|image|max:5120',
        ]);

        $imagePath = $request->file('image')->store('campaigns', 'public');

        $campaign = DonationCampaign::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'target_amount' => $data['target_amount'],
            'image_path' => $imagePath,
        ]);

        return response(['campaign' => $campaign], 201);
    }
}
