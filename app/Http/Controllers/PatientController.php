<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientFormRequest;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $isSearch = $request->filled('search');

        $patients = Patient::with('healthUnit:id,name')
            ->when($isSearch, function ($query) use ($request) {                
                $query->where('name', 'like', "%{$request->search}%");
            })
            ->orderBy('name')
            ->get();

        return response()->json($patients);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PatientFormRequest $request)
    {
        $patient = Patient::create($request->validated());

        return response()->json($patient->load('healthUnit:id,name'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        return response()->json($patient->load('healthUnit:id,name'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PatientFormRequest $request, Patient $patient)
    {
        $patient->update($request->validated());

        return response()->json($patient->load('healthUnit:id,name'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return response()->json(['message' => "Paciente excluído com sucesso."]);
    }
}
