<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use App\Models\Point;

class AiController extends Controller
{
    private function getGeminiResponse(string $prompt): ?array
    {
        $apiKey = env('GEMINI_API_KEY');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        $response = Http::post($url, [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
            ]
        ]);

        if ($response->ok()) {
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0] ?? null;
        }

        // Simpan log error API jika perlu (bisa juga dilempar lewat Exception)
        \Illuminate\Support\Facades\Log::error('Gemini API Error: ' . $response->body());

        throw new \Exception('Gemini API Error: ' . $response->body());
    }

    public function ask(Request $request): Response
    {
        $request->validate(['question' => 'required|string']);

        $prompt = "Sebagai asisten cerdas sistem manajemen bencana JogoJagad, jawablah pertanyaan ini tentang mitigasi dan bencana alam dengan ringkas: " . $request->question;

        $aiResponse = $this->getGeminiResponse($prompt);

        if (!$aiResponse) {
            return response(['message' => 'Gagal mendapatkan jawaban dari AI'], 500);
        }

        return response(['answer' => $aiResponse['text']]);
    }

    public function generateQuiz(Request $request): Response
    {
        $request->validate([
            'topic' => 'required|string',
            'amount' => 'nullable|integer|min:1|max:20'
        ]);

        $amount = $request->input('amount', 1);

        $prompt = "Buatkan {$amount} soal kuis pilihan ganda (A, B, C, D) seputar bencana alam dengan topik '{$request->topic}'. Kembalikan format STRICT JSON berupa ARRAY OF OBJECT dengan struktur seperti ini: [{\"question\": \"...\", \"options\": [\"A. ...\", \"B. ...\", \"C. ...\", \"D. ...\"], \"correct_answer\": \"A. ...\"}]. Jangan berikan teks selain JSON array tersebut.";

        $aiResponse = $this->getGeminiResponse($prompt);

        if (!$aiResponse) {
            return response(['message' => 'Gagal membuat kuis'], 500);
        }

        $jsonStr = str_replace(['```json', '```'], '', $aiResponse['text']);
        $quizData = json_decode(trim($jsonStr), true);

        if (!$quizData) {
            return response(['message' => 'Gagal mem-parsing kuis dari AI'], 500);
        }

        // Return the quizzes
        return response([
            'quizzes' => $quizData
        ]);
    }

    public function submitQuiz(Request $request): Response
    {
        $request->validate([
            'is_correct' => 'required|boolean'
        ]);

        if (!$request->is_correct) {
            return response(['message' => 'Jawaban salah. Coba lagi lain waktu!']);
        }

        $pointsAwarded = 30;

        // Initialize User's Point record
        Point::create([
            'user_id' => $request->user()->id,
            'points' => $pointsAwarded,
            'source_type' => 'App\Models\AiQuiz',
            'source_id' => 0, // Placeholder as we don't save per-quiz right now
            'notes' => 'Reward menjawab kuis AI',
        ]);

        return response([
            'message' => 'Jawaban benar! Poin telah ditambahkan.',
            'points_awarded' => $pointsAwarded
        ]);
    }
}
