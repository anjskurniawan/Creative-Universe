<?php

return [
    'path' => env('HOSTING_RESTORE_FILE') ?: storage_path('app/private/hosting-restore.json'),
];
