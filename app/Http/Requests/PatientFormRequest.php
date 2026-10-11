<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PatientFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $patientId = $this->route('patient')?->id;

        return [
            'name' => 'required|string|max:255',
            'cpf' => [
                'required',
                'string',
                'size:11',
                $patientId ? 
                    "unique:patients,cpf,{$patientId}" : 
                    'unique:patients,cpf'
            ],
            'birth_date' => 'required|date|before_or_equal:today',
            'phone' => 'sometimes|nullable|string|max:20',
            'health_unit_id' => 'required|integer|exists:health_units,id',
        ];
    }
}
