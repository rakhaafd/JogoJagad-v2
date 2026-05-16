<?php

use App\Http\Controllers\ActionController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WeatherController;
use Illuminate\Support\Facades\Route;

// Public routes for location data (used in registration form)
Route::prefix('locations')->group(function () {
    Route::get('/provinces', [LocationController::class, 'getProvinces']);
    Route::get('/regencies', [LocationController::class, 'getRegencies']);
    Route::get('/districts', [LocationController::class, 'getDistricts']);
    Route::get('/villages', [LocationController::class, 'getVillages']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'registerUser']);
    Route::post('/login', [AuthController::class, 'loginUser']);
    Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
    Route::post('/admin/login', [AuthController::class, 'loginAdmin']);
});

Route::post('/donations/webhook', [DonationController::class, 'webhook']);

// Public content routes for landing and unauthenticated pages
Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/{region}', [RegionController::class, 'show']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);
Route::get('/donations', [DonationController::class, 'index']);
Route::get('/donations/{id}', [DonationController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [UserController::class, 'updateProfile']);

    Route::get('/actions', [ActionController::class, 'index']);
    Route::post('/actions', [ActionController::class, 'store']);
    Route::get('/actions/{id}', [ActionController::class, 'show']);
    Route::put('/actions/{id}', [ActionController::class, 'update']);
    Route::delete('/actions/{id}', [ActionController::class, 'destroy']);

    Route::post('/ai/ask', [AiController::class, 'ask']);
    Route::post('/ai/quiz/generate', [AiController::class, 'generateQuiz']);
    Route::post('/ai/quiz/submit', [AiController::class, 'submitQuiz']);

    Route::get('/donations/history', [DonationController::class, 'userHistory']);
    Route::post('/donations/{id}/donate', [DonationController::class, 'donate']);

    Route::middleware(\App\Http\Middleware\CheckAdmin::class)->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::delete('/users', [UserController::class, 'destroyAll']);

        Route::post('/regions', [RegionController::class, 'store']);
        Route::put('/regions/{region}', [RegionController::class, 'update']);
        Route::delete('/regions/{region}', [RegionController::class, 'destroy']);
        Route::delete('/regions', [RegionController::class, 'destroyAll']);

        Route::get('/actions', [ActionController::class, 'adminIndex']);
        Route::get('/actions/{id}', [ActionController::class, 'adminShow']);
        Route::delete('/actions/{id}', [ActionController::class, 'adminDestroy']);
        Route::post('/actions/{id}/verify', [ActionController::class, 'verify']);

        Route::post('/news', [NewsController::class, 'store']);
        Route::post('/news/{id}', [NewsController::class, 'update']);
        Route::delete('/news/{id}', [NewsController::class, 'destroy']);
        Route::delete('/news', [NewsController::class, 'destroyAll']);

        Route::get('/donations', [DonationController::class, 'adminIndex']);
        Route::get('/donations/{id}', [DonationController::class, 'adminShow']);
        Route::post('/donations', [DonationController::class, 'store']);
        Route::post('/donations/{id}', [DonationController::class, 'update']);
        Route::delete('/donations/{id}', [DonationController::class, 'destroy']);
        Route::delete('/donations', [DonationController::class, 'destroyAll']);
    });

    Route::get('/weather/current', [WeatherController::class, 'current']);
});
