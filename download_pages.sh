#!/bin/bash

# Array of all page URLs from the manual
urls=(
  "https://manual.raycast.com/"
  "https://manual.raycast.com/the-basics"
  "https://manual.raycast.com/hotkey"
  "https://manual.raycast.com/search-bar"
  "https://manual.raycast.com/action-panel"
  "https://manual.raycast.com/keyboard-shortcuts"
  "https://manual.raycast.com/command-aliases-and-hotkeys"
  "https://manual.raycast.com/preferences"
  "https://manual.raycast.com/core"
  "https://manual.raycast.com/calculator"
  "https://manual.raycast.com/calendar"
  "https://manual.raycast.com/snippets"
  "https://manual.raycast.com/quicklinks"
  "https://manual.raycast.com/store"
  "https://manual.raycast.com/window-management"
  "https://manual.raycast.com/auto-quit-applications"
  "https://manual.raycast.com/notes"
  "https://manual.raycast.com/hyperkey"
  "https://manual.raycast.com/focus"
  "https://manual.raycast.com/system"
  "https://manual.raycast.com/ai"
  "https://manual.raycast.com/ai-extensions"
  "https://manual.raycast.com/model-context-protocol"
  "https://manual.raycast.com/cloud-sync"
  "https://manual.raycast.com/custom-themes"
  "https://manual.raycast.com/referral-program"
  "https://manual.raycast.com/ios"
  "https://manual.raycast.com/getting-started-with-teams"
  "https://manual.raycast.com/quicklinks/shared-quicklinks"
  "https://manual.raycast.com/raycast-for-teams-beta/shared-snippets"
  "https://manual.raycast.com/raycast-ai-privacy-security"
  "https://manual.raycast.com/favicons"
  "https://manual.raycast.com/deeplinks"
  "https://manual.raycast.com/fallback-commands"
  "https://manual.raycast.com/dynamic-placeholders"
  "https://manual.raycast.com/script-commands"
  "https://manual.raycast.com/community-guidelines"
  "https://manual.raycast.com/extensions"
  "https://manual.raycast.com/latex-support"
  "https://manual.raycast.com/migration-guide"
  "https://manual.raycast.com/troubleshooting"
  "https://manual.raycast.com/reminders"
)

# Create pages directory if it doesn't exist
mkdir -p pages

# Download each page
for url in "${urls[@]}"; do
  # Extract filename from URL
  filename=$(echo "$url" | sed 's|https://manual.raycast.com/||' | sed 's|/$|index|' | sed 's|/|_|g')
  
  if [ -z "$filename" ] || [ "$filename" = "index" ]; then
    filename="index"
  fi
  
  echo "Downloading: $url -> pages/${filename}.html"
  curl -s "$url" -o "pages/${filename}.html"
  sleep 0.5  # Be nice to the server
done

echo "Download complete!"
