$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$codexRoot = Join-Path $repoRoot "codex"
$sharedRoot = Join-Path $codexRoot "shared"
$windowsRoot = Join-Path $codexRoot "windows"
$codexHome = Join-Path $env:USERPROFILE ".codex"
$backupRoot = Join-Path $codexHome ("backup-" + (Get-Date -Format "yyyyMMdd-HHmmss"))

if (-not (Test-Path $codexRoot)) {
    throw "Codex sync directory not found at $codexRoot"
}

New-Item -ItemType Directory -Force -Path $codexHome | Out-Null
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

if (Test-Path (Join-Path $codexHome "config.toml")) {
    Copy-Item (Join-Path $codexHome "config.toml") (Join-Path $backupRoot "config.toml") -Force
}

if (Test-Path (Join-Path $windowsRoot "config.toml")) {
    Copy-Item (Join-Path $windowsRoot "config.toml") (Join-Path $codexHome "config.toml") -Force
}

foreach ($fileName in @("AGENTS.md")) {
    $source = Join-Path $sharedRoot $fileName
    if (Test-Path $source) {
        Copy-Item $source (Join-Path $codexHome $fileName) -Force
    }
}

foreach ($dirName in @("agents", "rules", "skills")) {
    $source = Join-Path $sharedRoot $dirName
    $target = Join-Path $codexHome $dirName

    if (-not (Test-Path $source)) {
        continue
    }

    if (Test-Path $target) {
        Copy-Item $target (Join-Path $backupRoot $dirName) -Recurse -Force
        Remove-Item -Recurse -Force $target
    }

    Copy-Item $source $target -Recurse -Force
}

Write-Host "Codex config restored to $codexHome"
Write-Host "Backup saved to $backupRoot"
