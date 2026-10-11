<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HealthUnit extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'city'];

    public function patients() : HasMany {
        return $this->hasMany(Patient::class);
    }
}
