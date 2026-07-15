# Core Frontend

Folder ini memiliki layanan frontend lintas aplikasi: API transport, authentication, application registry, permission, realtime, storage/file access, dan tipe kontrak Core.

Core boleh mengimpor dari `shared`, tetapi tidak boleh mengimpor implementasi internal `features` atau route dalam `app`.

Target internal saat fungsi dipindahkan: `api`, `auth`, `applications`, `permissions`, `realtime`, `storage`, dan `types`.
