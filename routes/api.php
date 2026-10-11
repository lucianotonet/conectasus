<?php

use App\Http\Controllers\HealthUnitController;
use App\Http\Controllers\PatientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health-units', [HealthUnitController::class, 'index']);
Route::apiResource('patients', PatientController::class);