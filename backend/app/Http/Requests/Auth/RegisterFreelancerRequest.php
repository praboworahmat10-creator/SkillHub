<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterFreelancerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|min:3|max:255',
            'email'       => 'required|email|unique:users,email',
            'phone'       => 'nullable|string|max:20',
            'password'    => 'required|string|min:10',
            'terms'       => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'        => 'Nama lengkap wajib diisi.',
            'name.min'             => 'Nama minimal 3 karakter.',
            'email.required'       => 'Email wajib diisi.',
            'email.email'          => 'Format email tidak valid.',
            'email.unique'         => 'Email sudah terdaftar.',
            'phone.required'       => 'Nomor telepon wajib diisi.',
            'phone.regex'          => 'Format nomor HP Indonesia tidak valid (misal: 081234567890).',
            'phone.unique'         => 'Nomor HP sudah terdaftar.',
            'password.required'    => 'Password wajib diisi.',
            'password.min'         => 'Password minimal 10 karakter.',
            'password.regex'       => 'Password harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus.',
            'password_confirmation.required' => 'Konfirmasi password wajib diisi.',
            'password_confirmation.same'     => 'Konfirmasi password tidak cocok dengan password.',
            'terms.required'       => 'Anda harus menyetujui Syarat & Ketentuan.',
            'terms.accepted'       => 'Anda harus menyetujui Syarat & Ketentuan.',
        ];
    }
}
