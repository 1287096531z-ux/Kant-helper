$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root "dist-share"
$buildIdFile = Join-Path $root ".next\\BUILD_ID"

if (!(Test-Path $buildIdFile)) {
  Write-Host "Production build not found. Running npm.cmd run build ..."
  Push-Location $root
  try {
    npm.cmd run build
  } finally {
    Pop-Location
  }
}

if (Test-Path $dist) {
  Remove-Item -LiteralPath $dist -Recurse -Force
}

New-Item -ItemType Directory -Path $dist | Out-Null

$copyTargets = @(
  ".next",
  "node_modules",
  "public",
  "package.json",
  "next.config.ts"
)

foreach ($target in $copyTargets) {
  $sourcePath = Join-Path $root $target
  if (Test-Path $sourcePath) {
    Copy-Item -LiteralPath $sourcePath -Destination (Join-Path $dist $target) -Recurse
  }
}

$startCmd = @"
@echo off
cd /d %~dp0
set HOSTNAME=0.0.0.0
if "%PORT%"=="" set PORT=3000
call node_modules\.bin\next.cmd start --hostname %HOSTNAME% --port %PORT%
"@
Set-Content -LiteralPath (Join-Path $dist "start.cmd") -Value $startCmd -Encoding ASCII

$readme = @"
Philosopher Research Atlas - share package

This package is meant for another Windows machine.

How to run:
1. Install Node.js 20 or newer.
2. Open this folder.
3. Double-click start.cmd
4. Open http://localhost:3000

To let another device in the same LAN access it:
1. Keep the app running on this machine.
2. Run ipconfig and find the IPv4 address.
3. Open http://<LAN-IP>:3000 on the other device.

Notes:
- This package includes the built app and runtime dependencies for reliability.
- Zip the whole dist-share folder before sending it to someone else.
"@
Set-Content -LiteralPath (Join-Path $dist "README-share.txt") -Value $readme -Encoding ASCII

Write-Host ""
Write-Host "Share package ready:"
Write-Host "  $dist"
