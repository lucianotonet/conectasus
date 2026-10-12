<?php

namespace App\Http\Controllers;

use App\Models\HealthUnit;

class HealthUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $healthUnits = HealthUnit::orderBy('name')->get();
        
        return response()->json($healthUnits);
    }
}
