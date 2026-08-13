[CmdletBinding()]
param(
    [string] $ProjectRoot,
    [string] $Remote = 'origin',
    [switch] $DryRun
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
} else {
    $ProjectRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
}

$insideWorkTree = (& git -C $ProjectRoot rev-parse --is-inside-work-tree 2>$null)
if ($LASTEXITCODE -ne 0 -or $insideWorkTree.Trim() -ne 'true') {
    throw "Project is not a Git work tree: $ProjectRoot"
}

$branch = (& git -C $ProjectRoot branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($branch)) {
    throw 'Cannot push from a detached HEAD or unresolved branch.'
}

$remoteUrl = (& git -C $ProjectRoot remote get-url $Remote 2>$null)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace(($remoteUrl | Out-String))) {
    throw "Remote is not configured: $Remote"
}
$remoteUrl = ($remoteUrl | Select-Object -First 1).Trim()

$upstream = (& git -C $ProjectRoot rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null)
$hasUpstream = $LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace(($upstream | Out-String))
$upstream = if ($hasUpstream) { ($upstream | Select-Object -First 1).Trim() } else { "$Remote/$branch" }
$commandDescription = if ($hasUpstream) { 'git push' } else { "git push --set-upstream $Remote $branch" }

if ($DryRun) {
    Write-Output "Dry run: $commandDescription"
    Write-Output "Branch: $branch"
    Write-Output "Remote: $Remote"
    Write-Output "Remote URL: $remoteUrl"
    Write-Output "Upstream: $upstream"
    exit 0
}

if ($hasUpstream) {
    & git -C $ProjectRoot push
} else {
    & git -C $ProjectRoot push --set-upstream $Remote $branch
}
if ($LASTEXITCODE -ne 0) {
    throw "Git push failed. Local commit remains intact. Command: $commandDescription"
}

$localHead = (& git -C $ProjectRoot rev-parse HEAD).Trim()
$upstreamHead = (& git -C $ProjectRoot rev-parse '@{u}').Trim()
if ($LASTEXITCODE -ne 0 -or $localHead -ne $upstreamHead) {
    throw "Push verification failed: local HEAD does not match upstream $upstream."
}

Write-Output "Pushed commit: $localHead"
Write-Output "Branch: $branch"
Write-Output "Upstream: $upstream"
Write-Output "Remote URL: $remoteUrl"
