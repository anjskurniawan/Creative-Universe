<?php

declare(strict_types=1);

$projectRoot = dirname(__DIR__);
$backendRoot = $projectRoot.DIRECTORY_SEPARATOR.'apps'.DIRECTORY_SEPARATOR.'backend';
$checkOnly = in_array('--check', $argv, true);

$directories = [
    $backendRoot.'/storage/app/private',
    $backendRoot.'/storage/app/public',
    $backendRoot.'/storage/framework/cache/data',
    $backendRoot.'/storage/framework/sessions',
    $backendRoot.'/storage/framework/testing',
    $backendRoot.'/storage/framework/views',
    $backendRoot.'/storage/logs',
    $backendRoot.'/bootstrap/cache',
];

foreach ($directories as $directory) {
    $directory = str_replace('/', DIRECTORY_SEPARATOR, $directory);

    if (! is_dir($directory)) {
        if ($checkOnly) {
            throw new RuntimeException("Required storage directory is missing: {$directory}");
        }

        if (! mkdir($directory, 0775, true) && ! is_dir($directory)) {
            throw new RuntimeException("Unable to create storage directory: {$directory}");
        }
    }

    if (PHP_OS_FAMILY !== 'Windows' && ! $checkOnly && ! chmod($directory, 0775)) {
        throw new RuntimeException("Unable to set storage permissions: {$directory}");
    }

    if (! is_writable($directory)) {
        throw new RuntimeException("Storage directory is not writable: {$directory}");
    }
}

$publicStorage = $backendRoot.DIRECTORY_SEPARATOR.'public'.DIRECTORY_SEPARATOR.'storage';
$storageTarget = $backendRoot.DIRECTORY_SEPARATOR.'storage'.DIRECTORY_SEPARATOR.'app'.DIRECTORY_SEPARATOR.'public';

$resolvedLink = realpath($publicStorage);
$resolvedTarget = realpath($storageTarget);

if ($resolvedLink !== false) {
    if ($resolvedTarget === false || $resolvedLink !== $resolvedTarget) {
        throw new RuntimeException("public/storage exists but does not point to {$storageTarget}. Refusing to overwrite it.");
    }
} elseif (file_exists($publicStorage)) {
    throw new RuntimeException('public/storage exists as a regular file. Refusing to overwrite it.');
} elseif ($checkOnly) {
    throw new RuntimeException('public/storage link is missing. Run the storage preparation command without --check.');
} elseif (! @symlink($storageTarget, $publicStorage)) {
    if (PHP_OS_FAMILY !== 'Windows') {
        throw new RuntimeException('Unable to create public/storage symlink. Confirm that symlink support is enabled by the hosting provider.');
    }

    $command = sprintf(
        'cmd.exe /d /s /c "mklink /J %s %s"',
        escapeshellarg($publicStorage),
        escapeshellarg($storageTarget),
    );
    exec($command, $output, $exitCode);

    if ($exitCode !== 0 || ! is_dir($publicStorage)) {
        throw new RuntimeException('Unable to create the Windows public/storage junction.');
    }
}

echo $checkOnly
    ? "Storage configuration is valid.\n"
    : "Storage directories and public link are ready.\n";
