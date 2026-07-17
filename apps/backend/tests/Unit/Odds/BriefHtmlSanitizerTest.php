<?php

namespace Tests\Unit\Odds;

use App\SubApps\Odds\Support\BriefHtmlSanitizer;
use PHPUnit\Framework\TestCase;

class BriefHtmlSanitizerTest extends TestCase
{
    public function test_it_preserves_structured_references_and_removes_unsafe_markup(): void
    {
        $html = <<<'HTML'
<p onclick="alert(1)"><strong>Campaign</strong><script>alert(1)</script></p>
<a href="javascript:alert(1)" style="color:red">Unsafe</a>
<a href="https://example.com/board">Moodboard</a>
<figure data-attachment-id="42"><img src="/api/v1/odds/uploads/42/content" onerror="alert(1)" alt="Board"><figcaption>Board</figcaption></figure>
HTML;

        $sanitized = (new BriefHtmlSanitizer)->sanitize($html);

        self::assertStringContainsString('<strong>Campaign</strong>', $sanitized);
        self::assertStringContainsString('href="https://example.com/board"', $sanitized);
        self::assertStringContainsString('data-reference-type="link"', $sanitized);
        self::assertStringContainsString('data-reference-type="image"', $sanitized);
        self::assertStringContainsString('data-attachment-id="42"', $sanitized);
        self::assertStringContainsString('src="/api/v1/odds/uploads/42/content"', $sanitized);
        self::assertStringNotContainsString('javascript:', $sanitized);
        self::assertStringNotContainsString('<script', $sanitized);
        self::assertStringNotContainsString('onclick', $sanitized);
        self::assertStringNotContainsString('onerror', $sanitized);
        self::assertStringNotContainsString('style=', $sanitized);
    }
}
