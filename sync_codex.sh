#!/bin/bash
set -euo pipefail

SYNC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CODEX_HOME="${HOME}/.codex"
TARGET_ROOT="${SYNC_DIR}/codex"
SHARED_ROOT="${TARGET_ROOT}/shared"
MACOS_ROOT="${TARGET_ROOT}/macos"

if [ ! -d "${CODEX_HOME}" ]; then
  echo "Codex home not found at ${CODEX_HOME}"
  exit 1
fi

mkdir -p "${SHARED_ROOT}" "${MACOS_ROOT}"

cp "${CODEX_HOME}/config.toml" "${MACOS_ROOT}/config.toml" 2>/dev/null || true
cp "${CODEX_HOME}/AGENTS.md" "${SHARED_ROOT}/AGENTS.md" 2>/dev/null || true

rm -rf "${SHARED_ROOT}/agents" "${SHARED_ROOT}/rules" "${SHARED_ROOT}/skills"

cp -R "${CODEX_HOME}/agents" "${SHARED_ROOT}/agents" 2>/dev/null || true
cp -R "${CODEX_HOME}/rules" "${SHARED_ROOT}/rules" 2>/dev/null || true

mkdir -p "${SHARED_ROOT}/skills"
if [ -d "${CODEX_HOME}/skills" ]; then
  find "${CODEX_HOME}/skills" -mindepth 1 -maxdepth 1 ! -name ".system" -exec cp -R {} "${SHARED_ROOT}/skills/" \;
fi

cat > "${MACOS_ROOT}/manifest.json" <<EOF
{"platform":"macos","workspace_root":"D:/Coding Projects/Projects"}
EOF

echo "Codex sync snapshot updated in ${TARGET_ROOT}"
