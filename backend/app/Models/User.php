<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'kelurahan', 'kecamatan', 'kota', 'provinsi'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $appends = ['total_points'];

    public function getTotalPointsAttribute(): int
    {
        return (int) $this->points()->sum('points');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function regions(): HasMany
    {
        return $this->hasMany(Region::class, 'created_by');
    }


    public function actions(): HasMany
    {
        return $this->hasMany(Action::class);
    }

    public function actionVerifications(): HasMany
    {
        return $this->hasMany(ActionVerification::class, 'admin_id');
    }

    public function points(): HasMany
    {
        return $this->hasMany(Point::class);
    }

    public function news(): HasMany
    {
        return $this->hasMany(News::class, 'author_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
