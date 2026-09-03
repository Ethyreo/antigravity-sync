# Codex Sync

This directory stores the Codex app setup that is safe and useful to sync across machines.

Synced:
- `config.toml` snapshots per platform
- `AGENTS.md`
- custom `agents/`
- `rules/`
- user-installed `skills/` excluding `.system`

Not synced:
- `auth.json`
- logs, history, sessions, sqlite databases
- caches and plugin caches
- secrets and sandbox state

Use:
- Windows backup: `powershell -ExecutionPolicy Bypass -File .\sync_codex.ps1`
- Windows restore: `powershell -ExecutionPolicy Bypass -File .\apply_codex.ps1`
- macOS backup: `./sync_codex.sh`

The live Codex app on this machine is configured to trust and work from:
- `D:\Coding Projects\Projects`
