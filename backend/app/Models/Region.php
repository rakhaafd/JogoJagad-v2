<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'provinsi',
    'kota',
    'kecamatan',
    'kelurahan',
    'status',
    'disaster_type',
    'polygon',
    'description',
    'advice',
    'created_by',
])]
class Region extends Model
{
    use HasFactory;

    protected $casts = [
        'polygon' => 'array',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
