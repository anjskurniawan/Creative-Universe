[CmdletBinding()]
param(
    [string] $LogPath
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($LogPath)) {
    $projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
    $LogPath = Join-Path $projectRoot 'logs\logs.md'
}
$logFullPath = [System.IO.Path]::GetFullPath($LogPath)
if (-not (Test-Path -LiteralPath $logFullPath -PathType Leaf)) {
    throw "Log file does not exist: $logFullPath"
}

$content = Get-Content -Raw -LiteralPath $logFullPath
if ([string]::IsNullOrWhiteSpace($content)) {
    throw 'Log file is empty.'
}

$blocks = [regex]::Split($content.Trim(), '(?m)(?=^---\r?\n## )') | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
if ($blocks.Count -eq 0) {
    throw 'No log entries were found.'
}

$requiredFields = @(
    'Entry ID', 'Timestamp', 'Agent/Model', 'Task/Thread ID', 'Tags', 'Status',
    'User Instruction', 'Interpretation and Scope', 'Relevant Prior Context',
    'Assumptions', 'Decisions', 'Work Performed', 'Result',
    'Reference Files Inspected', 'Reference Files Changed',
    'Files Created, Moved, or Deleted', 'Commands and Tools Used',
    'Technical Validation', 'Visual or Live Validation', 'Errors and Blockers',
    'Risks and Open Questions', 'Supersedes Entry ID', 'Follow-up'
)

$seenIds = @{}
$previousTimestamp = $null
$legacyCount = 0

foreach ($block in $blocks) {
    $titleTimestampMatch = [regex]::Match($block, '(?m)^## (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}) - .+$')
    if ($block -notmatch '(?ms)^---\r?\n## \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2} - .+' -or -not $titleTimestampMatch.Success) {
        throw 'The log contains content that is not a valid entry block.'
    }

    $timestampMatch = [regex]::Match($block, '(?m)^- \*\*Timestamp:\*\* `(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2})`\s*$')
    if (-not $timestampMatch.Success) {
        throw 'A log entry has an invalid Timestamp field.'
    }
    $timestamp = [datetimeoffset]::ParseExact($timestampMatch.Groups[1].Value, 'yyyy-MM-ddTHH:mm:sszzz', [Globalization.CultureInfo]::InvariantCulture)
    $titleTimestamp = [datetimeoffset]::ParseExact($titleTimestampMatch.Groups[1].Value, 'yyyy-MM-dd HH:mm:ss zzz', [Globalization.CultureInfo]::InvariantCulture)
    if ($timestamp -ne $titleTimestamp) {
        throw 'A log entry title timestamp does not match its Timestamp field.'
    }
    if ($null -ne $previousTimestamp -and $timestamp -gt $previousTimestamp) {
        throw 'Entry order is not newest-first.'
    }
    $previousTimestamp = $timestamp

    $entryIdMatch = [regex]::Match($block, '(?m)^- \*\*Entry ID:\*\* `([0-9a-fA-F-]{36})`\s*$')
    if (-not $entryIdMatch.Success) {
        $legacyCount++
        continue
    }

    $entryId = $entryIdMatch.Groups[1].Value.ToLowerInvariant()
    [void][guid]::Parse($entryId)
    if ($seenIds.ContainsKey($entryId)) {
        throw "Duplicate Entry ID: $entryId"
    }
    $seenIds[$entryId] = $true

    foreach ($field in $requiredFields) {
        if ($block -notmatch "(?m)^- \*\*$([regex]::Escape($field)):\*\*\s+\S") {
            throw "Entry $entryId is missing required field: $field"
        }
    }

}

$secretPatterns = @(
    '(?im)authorization:\s*bearer\s+\S+',
    '(?im)(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*[^\s`]+',
    '(?im)-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'
)
foreach ($pattern in $secretPatterns) {
    if ($content -match $pattern) {
        throw 'A possible secret value was detected in the log.'
    }
}

Write-Output "Valid log entries: $($blocks.Count)"
Write-Output "Current-schema entries: $($seenIds.Count)"
Write-Output "Legacy immutable entries: $legacyCount"
