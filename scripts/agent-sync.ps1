[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('status', 'new', 'claim', 'handoff', 'done', 'block')]
    [string]$Command = 'status',
    [string]$Id,
    [string]$Title,
    [string]$Owner,
    [string]$Branch,
    [string]$Scope,
    [string]$NonScope,
    [string]$Summary,
    [string]$Checks,
    [string]$Reason
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$stateRoot = Join-Path $repoRoot '.ai-coordination'
$taskRoot = Join-Path $stateRoot 'tasks'
$handoffRoot = Join-Path $stateRoot 'handoffs'
New-Item -ItemType Directory -Force -Path $taskRoot, $handoffRoot | Out-Null

function Assert-TaskId {
    if ([string]::IsNullOrWhiteSpace($Id) -or $Id -notmatch '^[A-Za-z0-9][A-Za-z0-9_-]*$') {
        throw 'Use -Id with letters, numbers, hyphens, or underscores only.'
    }
}

function Get-TaskPath {
    Assert-TaskId
    Join-Path $taskRoot "$Id.md"
}

function Get-Field([string]$Content, [string]$Name) {
    $match = [regex]::Match($Content, "(?m)^$([regex]::Escape($Name)):\s*(.*)$")
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
    return ''
}

function Set-Field([string]$Content, [string]$Name, [string]$Value) {
    $pattern = "(?m)^$([regex]::Escape($Name)):\s*.*$"
    if ([regex]::IsMatch($Content, $pattern)) {
        return [regex]::Replace($Content, $pattern, "${Name}: $Value", 1)
    }
    return $Content -replace '(?m)^---\r?\n', "---`n${Name}: $Value`n"
}

function Invoke-WithTaskLock([scriptblock]$Action) {
    $lockPath = Join-Path $taskRoot "$Id.lock"
    try {
        $lock = [System.IO.File]::Open($lockPath, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
    } catch {
        throw "Task '$Id' is currently being updated by another agent. Wait, refresh status, and retry."
    }
    try { & $Action } finally { $lock.Dispose(); Remove-Item -LiteralPath $lockPath -Force -ErrorAction SilentlyContinue }
}

function Get-TaskRows {
    Get-ChildItem -LiteralPath $taskRoot -Filter '*.md' | ForEach-Object {
        $content = Get-Content -LiteralPath $_.FullName -Raw
        [PSCustomObject]@{
            Id = $_.BaseName
            Status = Get-Field $content 'status'
            Owner = Get-Field $content 'owner'
            Branch = Get-Field $content 'branch'
            Updated = Get-Field $content 'updated'
            Title = Get-Field $content 'title'
        }
    }
}

switch ($Command) {
    'status' {
        $rows = @(Get-TaskRows)
        if ($rows.Count -eq 0) { Write-Output 'No coordinated tasks yet.'; break }
        $rows | Sort-Object Updated -Descending | Format-Table Id, Status, Owner, Branch, Updated, Title -AutoSize
    }
    'new' {
        Assert-TaskId
        if ([string]::IsNullOrWhiteSpace($Title) -or [string]::IsNullOrWhiteSpace($Owner) -or [string]::IsNullOrWhiteSpace($Scope) -or [string]::IsNullOrWhiteSpace($NonScope)) { throw 'new requires -Title, -Owner, -Scope, and -NonScope.' }
        $path = Get-TaskPath
        Invoke-WithTaskLock {
            if (Test-Path -LiteralPath $path) { throw "Task '$Id' already exists." }
            $now = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
            @"
---
id: $Id
title: $Title
status: READY
owner: $Owner
branch:
created: $now
updated: $now
---

## Scope

$Scope

## Non-scope

$NonScope
"@ | Set-Content -LiteralPath $path -NoNewline
        }
        Write-Output "Created task $Id. Add scope and non-scope, then claim it."
    }
    'claim' {
        Assert-TaskId
        if ([string]::IsNullOrWhiteSpace($Owner)) { throw 'claim requires -Owner.' }
        $path = Get-TaskPath
        Invoke-WithTaskLock {
            if (-not (Test-Path -LiteralPath $path)) { throw "Task '$Id' does not exist. Create it first." }
            $content = Get-Content -LiteralPath $path -Raw
            $currentStatus = Get-Field $content 'status'
            $currentOwner = Get-Field $content 'owner'
            if ($currentStatus -eq 'IN_PROGRESS' -and $currentOwner -ne $Owner) { throw "Task '$Id' is owned by $currentOwner." }
            if ($currentStatus -notin @('READY', 'HANDOFF', 'BLOCKED', 'IN_PROGRESS')) { throw "Task '$Id' cannot be claimed from status $currentStatus." }
            $content = Set-Field $content 'status' 'IN_PROGRESS'
            $content = Set-Field $content 'owner' $Owner
            $content = Set-Field $content 'branch' $Branch
            $content = Set-Field $content 'updated' ((Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'))
            Set-Content -LiteralPath $path -Value $content -NoNewline
        }
        Write-Output "Claimed task $Id for $Owner."
    }
    'handoff' {
        Assert-TaskId
        if ([string]::IsNullOrWhiteSpace($Owner) -or [string]::IsNullOrWhiteSpace($Summary)) { throw 'handoff requires -Owner and -Summary.' }
        $path = Get-TaskPath
        Invoke-WithTaskLock {
            if (-not (Test-Path -LiteralPath $path)) { throw "Task '$Id' does not exist." }
            $content = Get-Content -LiteralPath $path -Raw
            if ((Get-Field $content 'owner') -ne $Owner) { throw "Only the current owner can hand off task '$Id'." }
            $now = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
            $handoffPath = Join-Path $handoffRoot ("{0}-{1}-{2}.md" -f $Id, $now.Replace(':', ''), $Owner)
            @"
# Handoff: $Id

- From: $Owner
- At: $now
- Branch: $(Get-Field $content 'branch')
- Checks: $Checks

## Summary

$Summary
"@ | Set-Content -LiteralPath $handoffPath -NoNewline
            $content = Set-Field $content 'status' 'HANDOFF'
            $content = Set-Field $content 'updated' $now
            Set-Content -LiteralPath $path -Value $content -NoNewline
        }
        Write-Output "Published handoff for task $Id."
    }
    'done' {
        Assert-TaskId
        $path = Get-TaskPath
        Invoke-WithTaskLock {
            if (-not (Test-Path -LiteralPath $path)) { throw "Task '$Id' does not exist." }
            $content = Get-Content -LiteralPath $path -Raw
            $content = Set-Field $content 'status' 'DONE'
            $content = Set-Field $content 'updated' ((Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'))
            Set-Content -LiteralPath $path -Value $content -NoNewline
        }
        Write-Output "Marked task $Id as DONE."
    }
    'block' {
        Assert-TaskId
        if ([string]::IsNullOrWhiteSpace($Reason)) { throw 'block requires -Reason.' }
        $path = Get-TaskPath
        Invoke-WithTaskLock {
            if (-not (Test-Path -LiteralPath $path)) { throw "Task '$Id' does not exist." }
            $content = Get-Content -LiteralPath $path -Raw
            $content = Set-Field $content 'status' 'BLOCKED'
            $content = Set-Field $content 'updated' ((Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'))
            $content += "`n## Blocker`n`n$Reason`n"
            Set-Content -LiteralPath $path -Value $content -NoNewline
        }
        Write-Output "Blocked task $Id."
    }
}
