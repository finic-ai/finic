#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Open a new terminal tab and run 'poetry run start' in the /chrome directory
osascript <<EOF
tell application "Terminal"
    if not (exists window 1) then reopen
    activate
    tell application "System Events" to keystroke "t" using {command down}
    do script "cd '$SCRIPT_DIR/chrome' && poetry run start" in front window
end tell
EOF

# Open another terminal tab and run 'poetry run start' in the /server directory
osascript <<EOF
tell application "Terminal"
    tell application "System Events" to keystroke "t" using {command down}
    do script "cd '$SCRIPT_DIR/server' && poetry run start" in front window
end tell
EOF

# Open another terminal tab and run 'poetry run start' in the /server directory
osascript <<EOF
tell application "Terminal"
    tell application "System Events" to keystroke "t" using {command down}
    do script "cd '$SCRIPT_DIR/worker' && poetry run start" in front window
end tell
EOF
