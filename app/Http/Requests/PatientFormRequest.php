<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

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

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Verifique os dados informados e tente novamente.',
            'errors' => $validator->errors(),
        ], 422));
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do paciente é obrigatório.',
            'name.string' => 'O nome do paciente deve ser um texto válido.',
            'name.max' => 'O nome do paciente deve ter no máximo :max caracteres.',

            'cpf.required' => 'O CPF é obrigatório.',
            'cpf.string' => 'O CPF deve ser um valor válido.',
            'cpf.size' => 'O CPF deve conter :size dígitos.',
            'cpf.unique' => 'Este CPF já existe no sistema.',

            'birth_date.required' => 'A data de nascimento é obrigatória.',
            'birth_date.date' => 'A data de nascimento deve ser uma data válida.',
            'birth_date.before_or_equal' => 'A data de nascimento não pode ser uma data futura.',

            'phone.string' => 'O telefone deve ser um número válido.',
            'phone.max' => 'O telefone deve ter no máximo :max caracteres.',

            'health_unit_id.required' => 'A unidade de saúde é obrigatória.',
            'health_unit_id.integer' => 'A unidade de saúde selecionada é inválida.',
            'health_unit_id.exists' => 'A unidade de saúde selecionada não está cadastrada no sistema.',
        ];
    }
}
