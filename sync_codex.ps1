$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$codexHome = Join-Path $env:USERPROFILE ".codex"
$targetRoot = Join-Path $repoRoot "codex"
$sharedRoot = Join-Path $targetRoot "shared"
$windowsRoot = Join-Path $targetRoot "windows"

if (-not (Test-Path $codexHome)) {
    throw "Codex home not found at $codexHome"
}

New-Item -ItemType Directory -Force -Path $sharedRoot | Out-Null
New-Item -ItemType Directory -Force -Path $windowsRoot | Out-Null

Copy-Item (Join-Path $codexHome "config.toml") (Join-Path $windowsRoot "config.toml") -Force

if (Test-Path (Join-Path $codexHome "AGENTS.md")) {
    Copy-Item (Join-Path $codexHome "AGENTS.md") (Join-Path $sharedRoot "AGENTS.md") -Force
}

foreach ($dirName in @("agents", "rules")) {
    $source = Join-Path $codexHome $dirName
    $target = Join-Path $sharedRoot $dirName

    if (Test-Path $target) {
        Remove-Item -Recurse -Force $target
    }

    if (Test-Path $source) {
        Copy-Item $source $target -Recurse -Force
    }
}

$skillsSource = Join-Path $codexHome "skills"
$skillsTarget = Join-Path $sharedRoot "skills"
if (Test-Path $skillsTarget) {
    Remove-Item -Recurse -Force $skillsTarget
}
New-Item -ItemType Directory -Force -Path $skillsTarget | Out-Null

if (Test-Path $skillsSource) {
    Get-ChildItem $skillsSource -Force | Where-Object { $_.Name -ne ".system" } | ForEach-Object {
        Copy-Item $_.FullName (Join-Path $skillsTarget $_.Name) -Recurse -Force
    }
}

$manifest = [ordered]@{
    platform = "windows"
    synced_at = (Get-Date).ToString("s")
    codex_home = $codexHome
    workspace_root = "D:\Coding Projects\Projects"
}
$manifest | ConvertTo-Json | Set-Content (Join-Path $windowsRoot "manifest.json")

Write-Host "Codex sync snapshot updated in $targetRoot"
