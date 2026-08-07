<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'           => 'sometimes|string|max:255',
            'description'     => 'sometimes|string',
            'category_id'     => 'sometimes|exists:categories,id',
            'price'           => 'sometimes|numeric|min:10000',
            'delivery_time'   => 'sometimes|integer|min:1',
            'revision_count'  => 'sometimes|integer|min:0',
            'is_active'       => 'sometimes|boolean',
        ];
    }
}
