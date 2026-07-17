<?php

namespace App\SubApps\Odds\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

class BriefHtmlSanitizer
{
    private const ALLOWED_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'figure', 'img', 'figcaption'];

    public function sanitize(string $html): string
    {
        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8"><div id="brief-root">'.$html.'</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $document->getElementById('brief-root');
        if (! $root) {
            return '';
        }

        $this->cleanChildren($root);

        return collect(iterator_to_array($root->childNodes))
            ->map(fn (DOMNode $node) => $document->saveHTML($node))
            ->implode('');
    }

    private function cleanChildren(DOMNode $parent): void
    {
        foreach (iterator_to_array($parent->childNodes) as $node) {
            if (! $node instanceof DOMElement) {
                continue;
            }

            $tag = strtolower($node->tagName);
            if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                if (in_array($tag, ['script', 'style', 'iframe', 'object'], true)) {
                    $parent->removeChild($node);
                    continue;
                }
                while ($node->firstChild) {
                    $parent->insertBefore($node->firstChild, $node);
                }
                $parent->removeChild($node);
                continue;
            }

            $this->cleanAttributes($node, $tag);
            $this->cleanChildren($node);
        }
    }

    private function cleanAttributes(DOMElement $element, string $tag): void
    {
        $allowed = match ($tag) {
            'a' => ['href', 'target', 'rel', 'data-reference-type'],
            'figure' => ['data-reference-type', 'data-attachment-id'],
            'img' => ['src', 'alt'],
            default => [],
        };

        foreach (iterator_to_array($element->attributes) as $attribute) {
            if (! in_array(strtolower($attribute->name), $allowed, true)) {
                $element->removeAttribute($attribute->name);
            }
        }

        if ($tag === 'a') {
            $href = $element->getAttribute('href');
            if (! preg_match('/^https?:\/\/[^\s]+$/i', $href)) {
                $element->removeAttribute('href');
            }
            $element->setAttribute('target', '_blank');
            $element->setAttribute('rel', 'noopener noreferrer');
            $element->setAttribute('data-reference-type', 'link');
        }

        if ($tag === 'img' && ! preg_match('#^/api/v1/odds/uploads/\d+/content$#', $element->getAttribute('src'))) {
            $element->removeAttribute('src');
        }

        if ($tag === 'figure') {
            $attachmentId = $element->getAttribute('data-attachment-id');
            if (! ctype_digit($attachmentId)) {
                $element->removeAttribute('data-attachment-id');
            }
            $element->setAttribute('data-reference-type', 'image');
        }
    }
}
