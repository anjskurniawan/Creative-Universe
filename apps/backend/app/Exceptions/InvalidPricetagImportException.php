<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

class InvalidPricetagImportException extends RuntimeException
{
    /** @param array<int, array{row: int, errors: array<int, string>}> $rowErrors */
    public function __construct(public readonly array $rowErrors, string $message = 'File CSV mengandung data yang tidak valid.')
    {
        parent::__construct($message);
    }
}
