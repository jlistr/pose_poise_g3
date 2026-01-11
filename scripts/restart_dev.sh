
#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Stopping existing development processes...${NC}"

# Kill processes on common ports
ports=(3000 4000 8080 9099 5001 9399)

for port in "${ports[@]}"; do
    pid=$(lsof -t -i:$port)
    if [ -n "$pid" ]; then
        echo -e "${RED}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid
    fi
done

echo -e "${GREEN}Ports cleaned.${NC}"

echo -e "${GREEN}Starting Firebase Emulators...${NC}"
# Start emulators in background? Or just tell user to run them?
# We'll run them in the background for this script, but ideally they'd be separate.
# However, for a "restart" command, we can try to launch everything.

# Check if emulators are already running (failed to kill?)
# If we run this as a one-shot script, we should probably output instructions
# or use a tool like concurrently if installed.
# Since we don't have concurrently, we'll guide the user.

echo "----------------------------------------------------------------"
echo "To restart your environment cleanly, please run these commands"
echo "in two SEPARATE terminal tabs:"
echo ""
echo -e "Tab 1: ${GREEN}firebase emulators:start${NC}"
echo -e "Tab 2: ${GREEN}npm run dev${NC}"
echo "----------------------------------------------------------------"
echo "Config Check:"
echo " - Firestore: Local Emulator (Port 8080)"
echo " - Functions: Cloud (Deployed)"
echo " - DataConnect: Cloud (Default)"
echo "----------------------------------------------------------------"

