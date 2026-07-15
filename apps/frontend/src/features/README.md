# Frontend Features

Setiap Sub-App memiliki boundary sendiri di folder ini. Feature boleh menggunakan public contract dari `core` dan primitive dari `shared`, tetapi tidak boleh mengimpor internal feature lain.

Struktur internal standar dibuat saat file pertama dimigrasikan: `api`, `components`, `hooks`, `types`, `validation`, `utils`, dan `constants`.
