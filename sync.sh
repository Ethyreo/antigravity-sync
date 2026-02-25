#!/bin/bash
SYNC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_DIR_MAC="$HOME/.antigravity/extensions"
USER_DIR_MAC="$HOME/Library/Application Support/Antigravity/User"

echo "Syncing extensions..."
mkdir -p "$SYNC_DIR/extensions"
cp "$EXT_DIR_MAC/extensions.json" "$SYNC_DIR/extensions/" 2>/dev/null

echo "Syncing user settings..."
mkdir -p "$SYNC_DIR/User"
cp -R "$USER_DIR_MAC/"* "$SYNC_DIR/User/" 2>/dev/null

echo "Done!"
