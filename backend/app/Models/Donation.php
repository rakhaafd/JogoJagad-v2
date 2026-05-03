<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'amount',
    'currency',
    'status',
    'provider',
    'external_id',
    'checkout_url',
    'paid_at',
    'metadata',
])]
class Donation extends Model
{
    use HasFactory;

    protected $casts = [
        'paid_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
