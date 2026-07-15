<?php

declare(strict_types=1);

namespace App\SubApps\Generator\Pricetag\Services;

use App\Exceptions\InvalidPricetagImportException;
use App\Models\Core\User;
use App\SubApps\Generator\Pricetag\Models\PricetagCategory;
use App\SubApps\Generator\Pricetag\Models\PricetagProduct;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class PricetagCatalogImportService
{
    private const HEADER_ALIASES = [
        'category' => ['category', 'category_name', 'kategori'],
        'product' => ['product', 'product_name', 'produk'],
        'variant' => ['variant_name', 'variant', 'varian', 'nama_varian'],
        'normal_price' => ['normal_price', 'harga_normal', 'harga normal'],
        'discount_price' => ['discount_price', 'harga_diskon', 'harga diskon'],
    ];

    /** @return array{total: int, created: int, updated: int, restored: int, categories_created: int, categories_restored: int} */
    public function import(UploadedFile $file, User $actor): array
    {
        $rows = $this->parse($file);

        return DB::transaction(function () use ($rows, $actor): array {
            $summary = [
                'total' => count($rows),
                'created' => 0,
                'updated' => 0,
                'restored' => 0,
                'categories_created' => 0,
                'categories_restored' => 0,
            ];
            $categories = [];

            foreach ($rows as $row) {
                $categoryKey = mb_strtolower($row['category']);
                if (! isset($categories[$categoryKey])) {
                    $category = PricetagCategory::withTrashed()
                        ->whereRaw('LOWER(name) = ?', [$categoryKey])
                        ->first();

                    if ($category === null) {
                        $category = PricetagCategory::create(['name' => $row['category']]);
                        $summary['categories_created']++;
                    } elseif ($category->trashed()) {
                        $category->restore();
                        $category->update(['deleted_by' => null]);
                        $summary['categories_restored']++;
                    }

                    $categories[$categoryKey] = $category;
                }

                /** @var PricetagCategory $category */
                $category = $categories[$categoryKey];
                $product = PricetagProduct::withTrashed()
                    ->whereRaw('LOWER(name) = ?', [mb_strtolower($row['product'])])
                    ->whereRaw('LOWER(variant_name) = ?', [mb_strtolower($row['variant'])])
                    ->first();
                $wasTrashed = $product?->trashed() ?? false;

                if ($product === null) {
                    PricetagProduct::create([
                        'category_id' => $category->id,
                        'name' => $row['product'],
                        'variant_name' => $row['variant'],
                        'normal_price' => $row['normal_price'],
                        'discount_price' => $row['discount_price'],
                    ]);
                    $summary['created']++;

                    continue;
                }

                if ($wasTrashed) {
                    $product->restore();
                    $summary['restored']++;
                } else {
                    $summary['updated']++;
                }

                $product->update([
                    'category_id' => $category->id,
                    'name' => $row['product'],
                    'variant_name' => $row['variant'],
                    'normal_price' => $row['normal_price'],
                    'discount_price' => $row['discount_price'],
                    'deleted_by' => null,
                ]);
            }

            activity('pricetag')
                ->causedBy($actor)
                ->withProperties($summary)
                ->log('[PRICETAG] Catalog CSV imported');

            return $summary;
        });
    }

    /** @return array<int, array{category: string, product: string, variant: string, normal_price: int, discount_price: int}> */
    private function parse(UploadedFile $file): array
    {
        $handle = fopen($file->getRealPath(), 'rb');
        if ($handle === false) {
            throw new InvalidPricetagImportException([], 'File CSV tidak dapat dibuka.');
        }

        try {
            $firstLine = fgets($handle);
            if ($firstLine === false) {
                throw new InvalidPricetagImportException([], 'File CSV kosong.');
            }

            $delimiter = count(str_getcsv($firstLine, ';')) > count(str_getcsv($firstLine, ',')) ? ';' : ',';
            $header = str_getcsv($firstLine, $delimiter);
            $header = array_map(
                fn (string $value): string => mb_strtolower(trim(preg_replace('/^\xEF\xBB\xBF/', '', $value) ?? $value)),
                $header
            );
            $indexes = $this->headerIndexes($header);

            if ($indexes['category'] === null || $indexes['product'] === null || $indexes['normal_price'] === null) {
                throw new InvalidPricetagImportException([], 'Header CSV wajib memuat kategori, produk, dan harga normal.');
            }

            $rows = [];
            $errors = [];
            $seen = [];
            $lineNumber = 1;

            while (($values = fgetcsv($handle, 0, $delimiter)) !== false) {
                $lineNumber++;
                if ($this->isEmptyRow($values)) {
                    continue;
                }

                $category = trim((string) ($values[$indexes['category']] ?? ''));
                $product = trim((string) ($values[$indexes['product']] ?? ''));
                $variant = $indexes['variant'] === null
                    ? ' '
                    : (trim((string) ($values[$indexes['variant']] ?? '')) ?: ' ');
                $normalPrice = $this->parsePrice($values[$indexes['normal_price']] ?? null);
                $discountPrice = $indexes['discount_price'] === null
                    ? 0
                    : $this->parsePrice($values[$indexes['discount_price']] ?? '', true);
                $rowErrors = [];

                if ($category === '') {
                    $rowErrors[] = 'Kategori wajib diisi.';
                }
                if ($product === '') {
                    $rowErrors[] = 'Produk wajib diisi.';
                }
                if (mb_strlen($variant) > 100) {
                    $rowErrors[] = 'Nama varian maksimal 100 karakter.';
                }
                if ($normalPrice === null) {
                    $rowErrors[] = 'Harga normal harus berupa bilangan bulat non-negatif.';
                }
                if ($discountPrice === null) {
                    $rowErrors[] = 'Harga diskon harus berupa bilangan bulat non-negatif.';
                }

                $key = mb_strtolower($product).'|'.mb_strtolower($variant);
                if (isset($seen[$key])) {
                    $rowErrors[] = "Duplikat produk/varian dengan baris {$seen[$key]}.";
                } else {
                    $seen[$key] = $lineNumber;
                }

                if ($rowErrors !== []) {
                    $errors[] = ['row' => $lineNumber, 'errors' => $rowErrors];

                    continue;
                }

                $rows[] = [
                    'category' => $category,
                    'product' => $product,
                    'variant' => $variant,
                    'normal_price' => $normalPrice,
                    'discount_price' => $discountPrice,
                ];
            }

            if ($errors !== []) {
                throw new InvalidPricetagImportException($errors);
            }
            if ($rows === []) {
                throw new InvalidPricetagImportException([], 'File CSV tidak memiliki baris data.');
            }

            return $rows;
        } finally {
            fclose($handle);
        }
    }

    /** @param array<int, string> $header
     * @return array{category: int|null, product: int|null, variant: int|null, normal_price: int|null, discount_price: int|null}
     */
    private function headerIndexes(array $header): array
    {
        $indexes = [];
        foreach (self::HEADER_ALIASES as $field => $aliases) {
            $index = null;
            foreach ($aliases as $alias) {
                $found = array_search($alias, $header, true);
                if ($found !== false) {
                    $index = $found;
                    break;
                }
            }
            $indexes[$field] = $index;
        }

        return $indexes;
    }

    /** @param array<int, string|null> $row */
    private function isEmptyRow(array $row): bool
    {
        return count(array_filter($row, fn ($value): bool => trim((string) $value) !== '')) === 0;
    }

    private function parsePrice(mixed $value, bool $blankAsZero = false): ?int
    {
        $normalized = preg_replace('/\s+|rp/i', '', trim((string) $value)) ?? '';
        if ($normalized === '') {
            return $blankAsZero ? 0 : null;
        }
        if (ctype_digit($normalized)) {
            return (int) $normalized;
        }
        if (preg_match('/^\d{1,3}([.,]\d{3})+$/', $normalized) === 1) {
            return (int) str_replace(['.', ','], '', $normalized);
        }

        return null;
    }
}
