[CmdletBinding()]
param(
    [string] $ProjectRoot,
    [ValidateSet('Markdown', 'Json')]
    [string] $Format = 'Markdown'
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
} else {
    $ProjectRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
}

$logPath = Join-Path $ProjectRoot 'logs\logs.md'
if (-not (Test-Path -LiteralPath $logPath -PathType Leaf)) {
    throw "Work-log not found: $logPath"
}

$insideWorkTree = (& git -C $ProjectRoot rev-parse --is-inside-work-tree 2>$null)
if ($LASTEXITCODE -ne 0 -or $insideWorkTree.Trim() -ne 'true') {
    throw "Project is not a Git work tree: $ProjectRoot"
}

$currentContent = Get-Content -Raw -LiteralPath $logPath
$blockPattern = '(?ms)(?=^---\r?\n## )'
$currentBlocks = @([regex]::Split($currentContent.Trim(), $blockPattern) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
if ($currentBlocks.Count -eq 0) {
    throw 'Current work-log contains no entry blocks.'
}

function Get-BlockKey {
    param([Parameter(Mandatory = $true)][string] $Block)

    $idMatch = [regex]::Match($Block, '(?m)^- \*\*Entry ID:\*\* `(?<id>[0-9a-fA-F-]{36})`\s*$')
    if ($idMatch.Success) {
        return 'id:' + $idMatch.Groups['id'].Value.ToLowerInvariant()
    }

    $timestampMatch = [regex]::Match($Block, '(?m)^- \*\*Timestamp:\*\* `(?<timestamp>[^`]+)`\s*$')
    $titleMatch = [regex]::Match($Block, '(?m)^## (?<title>.+)$')
    if ($timestampMatch.Success -and $titleMatch.Success) {
        return 'legacy:' + $timestampMatch.Groups['timestamp'].Value + '|' + $titleMatch.Groups['title'].Value.Trim()
    }

    throw 'A work-log block has no usable immutable key.'
}

$head = (& git -C $ProjectRoot rev-parse HEAD 2>$null)
$baselineAvailable = $LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace(($head | Out-String))
$baselineBlocks = @()

if ($baselineAvailable) {
    $trackedLogPath = @(& git -C $ProjectRoot ls-tree -r --name-only HEAD -- 'logs/logs.md' 2>$null)
    if ($LASTEXITCODE -eq 0 -and ($trackedLogPath -join "`n").Trim() -eq 'logs/logs.md') {
        $baselineLines = @(& git -C $ProjectRoot show 'HEAD:logs/logs.md' 2>$null)
        if ($LASTEXITCODE -ne 0) {
            throw 'Unable to read the committed work-log baseline.'
        }
        $baselineContent = ($baselineLines -join "`n").Trim()
        if (-not [string]::IsNullOrWhiteSpace($baselineContent)) {
            $baselineBlocks = @([regex]::Split($baselineContent, $blockPattern) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
        }
    } else {
        $baselineAvailable = $false
    }
}

$baselineKeys = @{}
foreach ($block in $baselineBlocks) {
    $baselineKeys[(Get-BlockKey -Block $block)] = $true
}

$newBlocks = [System.Collections.Generic.List[string]]::new()
$checkpointFound = -not $baselineAvailable -or $baselineBlocks.Count -eq 0

foreach ($block in $currentBlocks) {
    $key = Get-BlockKey -Block $block
    if ($baselineKeys.ContainsKey($key)) {
        $checkpointFound = $true
        break
    }
    $newBlocks.Add($block.Trim())
}

if ($baselineAvailable -and $baselineBlocks.Count -gt 0 -and -not $checkpointFound) {
    throw 'Current and committed work-log histories do not share an immutable checkpoint.'
}

$entries = @()
foreach ($block in $newBlocks) {
    $titleMatch = [regex]::Match($block, '(?m)^## (?<title>.+)$')
    $instructionMatch = [regex]::Match($block, '(?m)^- \*\*User Instruction:\*\* (?<value>.+)$')
    $resultMatch = [regex]::Match($block, '(?m)^- \*\*Result:\*\* (?<value>.+)$')
    $filesMatch = [regex]::Match($block, '(?m)^- \*\*Reference Files Changed:\*\* (?<value>.+)$')
    $entries += [pscustomobject]@{
        key = Get-BlockKey -Block $block
        title = if ($titleMatch.Success) { $titleMatch.Groups['title'].Value.Trim() } else { 'Untitled entry' }
        user_instruction = if ($instructionMatch.Success) { $instructionMatch.Groups['value'].Value.Trim() } else { 'Tidak ada' }
        result = if ($resultMatch.Success) { $resultMatch.Groups['value'].Value.Trim() } else { 'Tidak ada' }
        files_changed = if ($filesMatch.Success) { $filesMatch.Groups['value'].Value.Trim() } else { 'Tidak ada' }
    }
}

$payload = [pscustomobject]@{
    baseline = if ($baselineAvailable) { ($head | Select-Object -First 1).Trim() } else { 'Tidak tersedia' }
    initial_range = -not $baselineAvailable -or $baselineBlocks.Count -eq 0
    entry_count = $entries.Count
    entries_newest_first = $entries
}

if ($Format -eq 'Json') {
    $payload | ConvertTo-Json -Depth 5
    exit 0
}

Write-Output '# Repository Log Range'
Write-Output ''
Write-Output "- Baseline commit: $($payload.baseline)"
Write-Output "- Initial range: $($payload.initial_range)"
Write-Output "- New entry count: $($payload.entry_count)"

foreach ($entry in $entries) {
    Write-Output ''
    Write-Output "## $($entry.title)"
    Write-Output ''
    Write-Output "- Instruction: $($entry.user_instruction)"
    Write-Output "- Result: $($entry.result)"
    Write-Output "- Files: $($entry.files_changed)"
}
