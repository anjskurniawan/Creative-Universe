[CmdletBinding()]
param(
    [string]$ProjectRoot,
    [ValidateRange(50, 2000)]
    [int]$MaxLines = 200
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\..'))
} else {
    $ProjectRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
}

$docsRoot = Join-Path $ProjectRoot 'docs'
$indexPath = Join-Path $docsRoot 'README.md'
$errors = [System.Collections.Generic.List[string]]::new()

if (-not (Test-Path -LiteralPath $indexPath -PathType Leaf)) {
    throw "Documentation index not found: $indexPath"
}

$legacyRoot = [System.IO.Path]::GetFullPath((Join-Path $docsRoot 'legacy')).TrimEnd('\') + '\'
$markdownFiles = @(Get-ChildItem -LiteralPath $docsRoot -Filter '*.md' -File -Recurse |
    Where-Object { -not $_.FullName.StartsWith($legacyRoot, [System.StringComparison]::OrdinalIgnoreCase) } |
    Sort-Object FullName)
if ($markdownFiles.Count -eq 0) {
    throw "No Markdown documentation found under: $docsRoot"
}

$indexContent = Get-Content -Raw -LiteralPath $indexPath
$linkPattern = [regex]'\[[^\]]+\]\((?<target>[^)]+)\)'

foreach ($file in $markdownFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    $lines = @(Get-Content -LiteralPath $file.FullName)
    $relativePath = $file.FullName.Substring($ProjectRoot.TrimEnd('\').Length).TrimStart('\').Replace('\', '/')

    if ($file.FullName -ne $indexPath -and $content -notmatch '(?m)^>\s*Last verified:\s*\d{4}-\d{2}-\d{2}\s*$') {
        $errors.Add("Missing or invalid Last verified date: $relativePath")
    }

    if ($lines.Count -gt $MaxLines -and $content -notmatch '<!--\s*documentation-size-exception\s*-->') {
        $errors.Add("Document exceeds $MaxLines lines without an exception: $relativePath ($($lines.Count) lines)")
    }

    if ($file.FullName -ne $indexPath) {
        $relativeFromDocs = $file.FullName.Substring($docsRoot.TrimEnd('\').Length).TrimStart('\').Replace('\', '/')
        if ($indexContent -notmatch [regex]::Escape("($relativeFromDocs)")) {
            $errors.Add("Document is not linked directly from docs/README.md: $relativeFromDocs")
        }
    }

    foreach ($match in $linkPattern.Matches($content)) {
        $target = $match.Groups['target'].Value.Trim().Trim('<', '>')
        if ($target -match '^(?:https?://|mailto:|#)' -or [string]::IsNullOrWhiteSpace($target)) {
            continue
        }

        $pathPart = ($target -split '#', 2)[0]
        if ([string]::IsNullOrWhiteSpace($pathPart)) {
            continue
        }

        $decodedPath = [System.Uri]::UnescapeDataString($pathPart)
        $resolvedPath = [System.IO.Path]::GetFullPath((Join-Path $file.DirectoryName $decodedPath))
        if (-not (Test-Path -LiteralPath $resolvedPath)) {
            $errors.Add("Broken relative link in ${relativePath}: $target")
        }
    }
}

if ($errors.Count -gt 0) {
    $errors | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Host "Documentation validation passed: $($markdownFiles.Count) files; links, index coverage, dates, and size limits are valid."
