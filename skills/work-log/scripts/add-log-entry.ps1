[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $EntryFile,

    [string] $LogPath,

    [int] $LockTimeoutSeconds = 30
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($LogPath)) {
    $projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
    $LogPath = Join-Path $projectRoot 'logs\logs.md'
}
$entryPathResolved = (Resolve-Path -LiteralPath $EntryFile).Path
$logFullPath = [System.IO.Path]::GetFullPath($LogPath)
$logDirectory = Split-Path -Parent $logFullPath

if (-not (Test-Path -LiteralPath $logDirectory -PathType Container)) {
    throw "Log directory does not exist: $logDirectory"
}

$entry = (Get-Content -Raw -LiteralPath $entryPathResolved).Trim()
if ($entry -notmatch '(?ms)^---\r?\n## \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2} - .+') {
    throw 'Entry title does not match the required timestamped Markdown structure.'
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

foreach ($field in $requiredFields) {
    if ($entry -notmatch "(?m)^- \*\*$([regex]::Escape($field)):\*\*\s+\S") {
        throw "Required field is missing or empty: $field"
    }
}

$entryIdMatch = [regex]::Match($entry, '(?m)^- \*\*Entry ID:\*\* `([0-9a-fA-F-]{36})`\s*$')
if (-not $entryIdMatch.Success) {
    throw 'Entry ID must be a UUID enclosed in backticks.'
}
$entryId = $entryIdMatch.Groups[1].Value
[void][guid]::Parse($entryId)

$timestampMatch = [regex]::Match($entry, '(?m)^- \*\*Timestamp:\*\* `(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2})`\s*$')
if (-not $timestampMatch.Success) {
    throw 'Timestamp must be ISO 8601 with an explicit timezone and enclosed in backticks.'
}
$entryTimestamp = [datetimeoffset]::ParseExact($timestampMatch.Groups[1].Value, 'yyyy-MM-ddTHH:mm:sszzz', [Globalization.CultureInfo]::InvariantCulture)

$titleTimestampMatch = [regex]::Match($entry, '(?m)^## (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}) - .+$')
if (-not $titleTimestampMatch.Success) {
    throw 'Entry title timestamp is invalid.'
}
$titleTimestamp = [datetimeoffset]::ParseExact($titleTimestampMatch.Groups[1].Value, 'yyyy-MM-dd HH:mm:ss zzz', [Globalization.CultureInfo]::InvariantCulture)
if ($titleTimestamp -ne $entryTimestamp) {
    throw 'Entry title timestamp and Timestamp field do not match.'
}

$secretPatterns = @(
    '(?im)authorization:\s*bearer\s+\S+',
    '(?im)(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*[^\s`]+',
    '(?im)-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'
)
foreach ($pattern in $secretPatterns) {
    if ($entry -match $pattern) {
        throw 'A possible secret value was detected in the entry.'
    }
}

$sha = [Security.Cryptography.SHA256]::Create()
try {
    $mutexHash = [BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($logFullPath.ToLowerInvariant()))).Replace('-', '').Substring(0, 24)
} finally {
    $sha.Dispose()
}

$mutex = [Threading.Mutex]::new($false, "Global\CreativeAppWorkLog_$mutexHash")
$lockTaken = $false
try {
    $lockTaken = $mutex.WaitOne([TimeSpan]::FromSeconds($LockTimeoutSeconds))
    if (-not $lockTaken) {
        throw "Timed out waiting for the work-log lock after $LockTimeoutSeconds seconds."
    }

    $existing = if (Test-Path -LiteralPath $logFullPath -PathType Leaf) {
        Get-Content -Raw -LiteralPath $logFullPath
    } else {
        ''
    }

    $duplicatePattern = '(?m)^- \*\*Entry ID:\*\* `' + [regex]::Escape($entryId) + '`\s*$'
    if ($existing -match $duplicatePattern) {
        throw "Duplicate Entry ID: $entryId"
    }

    if ($existing.Trim().Length -gt 0 -and $existing.TrimStart() -notmatch '^---\r?\n## \d{4}-\d{2}-\d{2} ') {
        throw 'The log contains non-entry content at the beginning. Run the validator before writing.'
    }

    $existingTimestampMatch = [regex]::Match($existing, '(?m)^- \*\*Timestamp:\*\* `(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2})`\s*$')
    if ($existingTimestampMatch.Success) {
        $existingTimestamp = [datetimeoffset]::ParseExact($existingTimestampMatch.Groups[1].Value, 'yyyy-MM-ddTHH:mm:sszzz', [Globalization.CultureInfo]::InvariantCulture)
        if ($entryTimestamp -lt $existingTimestamp) {
            throw 'The new entry timestamp is older than the current newest entry.'
        }
    }

    $normalizedEntry = $entry -replace "`r?`n", "`r`n"
    $normalizedExisting = $existing.Trim()
    $newContent = if ($normalizedExisting.Length -eq 0) {
        "$normalizedEntry`r`n"
    } else {
        "$normalizedEntry`r`n`r`n$normalizedExisting`r`n"
    }

    $operationId = [guid]::NewGuid().ToString('N')
    $tempPath = Join-Path $logDirectory ('.logs.' + $operationId + '.tmp')
    $backupPath = Join-Path $logDirectory ('.logs.' + $operationId + '.bak')
    [IO.File]::WriteAllText($tempPath, $newContent, [Text.UTF8Encoding]::new($false))
    try {
        if (Test-Path -LiteralPath $logFullPath -PathType Leaf) {
            [IO.File]::Replace($tempPath, $logFullPath, $backupPath)
        } else {
            [IO.File]::Move($tempPath, $logFullPath)
        }

        $written = Get-Content -Raw -LiteralPath $logFullPath
        if (-not $written.StartsWith($normalizedEntry)) {
            throw 'Read-back failed: the new entry is not first.'
        }
        if ($normalizedExisting.Length -gt 0 -and -not $written.TrimEnd().EndsWith($normalizedExisting)) {
            throw 'Read-back failed: previous entries were not preserved exactly.'
        }

        Write-Output "Recorded Entry ID: $entryId"
    } catch {
        if (Test-Path -LiteralPath $backupPath -PathType Leaf) {
            [IO.File]::Copy($backupPath, $logFullPath, $true)
        }
        throw
    } finally {
        if (Test-Path -LiteralPath $tempPath) {
            Remove-Item -LiteralPath $tempPath -Force
        }
        if (Test-Path -LiteralPath $backupPath) {
            Remove-Item -LiteralPath $backupPath -Force
        }
    }
} finally {
    if ($lockTaken) {
        $mutex.ReleaseMutex()
    }
    $mutex.Dispose()
}
