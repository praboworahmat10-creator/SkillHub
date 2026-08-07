<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'           => 'required|string|max:255',
            'description'     => 'required|string',
            'category_id'     => 'required|exists:categories,id',
            'price'           => 'required|numeric|min:10000',
            'delivery_time'   => 'required|integer|min:1',
            'revision_count'  => 'nullable|integer|min:0',
            'images'          => 'nullable|array|max:5',
            'images.*'        => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'         => 'Judul layanan wajib diisi.',
            'description.required'   => 'Deskripsi wajib diisi.',
            'category_id.required'   => 'Kategori wajib dipilih.',
            'category_id.exists'     => 'Kategori tidak valid.',
            'price.required'         => 'Harga wajib diisi.',
            'price.min'              => 'Harga minimal Rp 10.000.',
            'delivery_time.required' => 'Estimasi pengerjaan wajib diisi.',
        ];
    }
}
