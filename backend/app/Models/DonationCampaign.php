<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'title',
    'description',
    'image_path',
    'target_amount',
    'current_amount',
])]
class DonationCampaign extends Model
{
    use HasFactory;

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
