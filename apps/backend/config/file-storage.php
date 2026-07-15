<?php

return [
    'public_disk' => env('FILE_STORAGE_PUBLIC_DISK', 'public'),
    'private_disk' => env('FILE_STORAGE_PRIVATE_DISK', 'local'),
    'default_visibility' => env('FILE_STORAGE_DEFAULT_VISIBILITY', 'public'),
];
