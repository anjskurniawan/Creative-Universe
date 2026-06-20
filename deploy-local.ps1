# Script untuk mem-build frontend Next.js dan menyalinnya ke folder public backend Laravel (Same-Origin)

$PSScriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

Write-Host "1. Memulai build static export Next.js..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\apps\frontend"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Gagal mem-build frontend!" -ForegroundColor Red
    Exit $LASTEXITCODE
}

Write-Host "`n2. Menyalin berkas static build ke public backend..." -ForegroundColor Cyan
$src = "$PSScriptRoot\apps\frontend\out"
$dest = "$PSScriptRoot\apps\backend\public"

# Dapatkan semua item di source, salin ke tujuan tanpa menghapus file backend penting
# (seperti index.php dan .htaccess)
Get-ChildItem -Path $src | ForEach-Object {
    $targetPath = Join-Path -Path $dest -ChildPath $_.Name
    if ($_.PSIsContainer) {
        if (Test-Path -Path $targetPath) {
            Remove-Item -Path $targetPath -Recurse -Force
        }
        Copy-Item -Path $_.FullName -Destination $targetPath -Recurse -Force
    } else {
        if ($_.Name -ne "index.php" -and $_.Name -ne ".htaccess") {
            Copy-Item -Path $_.FullName -Destination $targetPath -Force
        }
    }
}

Write-Host "`nSukses! Frontend Next.js telah disinkronisasikan ke Laragon backend." -ForegroundColor Green
Write-Host "Silakan buka http://creativeuniverse.test/ di browser Anda." -ForegroundColor Yellow
