<?php

namespace Database\Factories\Core;

use App\Models\Core\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * UserFactory — sesuai skema SRD v6.2 Seksi 6.1
 *
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'whatsapp_number' => '628'.fake()->numerify('##########'),
            'password' => static::$password ??= Hash::make('password'),
        ];
    }

    /**
     * User tanpa nomor WhatsApp.
     */
    public function withoutWhatsapp(): static
    {
        return $this->state(fn (array $attributes) => [
            'whatsapp_number' => null,
        ]);
    }
}
