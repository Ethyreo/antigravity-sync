#!/bin/bash
# auto_sync.sh

cd "/Users/gurman/Coding Projects/antigravity-sync" || exit 1

# 1. Sync current Mac config to the repo
./sync.sh

# 2. Add and commit changes from Mac
git add .
# We only commit if there are changes
if ! git diff-index --quiet HEAD --; then
    git commit -m "Auto-sync from Mac (Main Machine) - $(date)"
else
    echo "No local changes to commit."
fi

# 3. Check for incoming changes from remote (e.g. from Windows)
git fetch origin main >/dev/null 2>&1
INCOMING=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo "0")

# 4. Pull latest changes from remote
# Since Mac is main, we favor our changes if a conflict occurs
git pull origin main -s recursive -X ours --no-edit >/dev/null 2>&1

# 5. Push combined changes back to remote
git push origin main >/dev/null 2>&1

# 6. Apply any new remote changes to Mac
mkdir -p ~/.antigravity/extensions
cp -R extensions/* ~/.antigravity/extensions/ 2>/dev/null

mkdir -p "$HOME/Library/Application Support/Antigravity/User"
cp -R User/* "$HOME/Library/Application Support/Antigravity/User/" 2>/dev/null

# 7. Notify the user if we received new changes from Windows
if [ "$INCOMING" -gt 0 ]; then
    osascript -e 'display notification "Settings and extensions from Windows were just synced to your Mac!" with title "Antigravity Sync"'
fi

echo "Auto-sync complete: $(date)"
