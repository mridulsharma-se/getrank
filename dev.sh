#!/bin/bash

#############################################################################
# GetRank Development Startup Script
# Starts both Django backend and Next.js frontend servers
# Usage: ./dev.sh
#############################################################################

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   GetRank Development Startup        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python3 not found${NC}"
    echo "Please install Python 3.8 or higher: https://python.org"
    exit 1
fi
PYTHON_V=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✓ Python ${PYTHON_V}${NC}"

# Check Node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "Please install Node.js 16+: https://nodejs.org"
    exit 1
fi
NODE_V=$(node --version)
echo -e "${GREEN}✓ Node.js ${NODE_V}${NC}"
echo ""

# Setup backend
echo -e "${YELLOW}Setting up backend...${NC}"
if [ ! -d "backend/venv" ]; then
    cd backend
    python3 -m venv venv
    cd ..
fi

# Install backend dependencies
cd backend
source venv/bin/activate
pip install --upgrade pip -q 2>/dev/null
pip install -r requirements.txt -q 2>/dev/null
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Setup frontend
echo -e "${YELLOW}Setting up frontend...${NC}"
cd frontend
npm install -q 2>/dev/null
cd ..
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Servers Starting on:               ║${NC}"
echo -e "${BLUE}║  Frontend: http://localhost:3000     ║${NC}"
echo -e "${BLUE}║  Backend:  http://localhost:8000     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Starting servers (Ctrl+C to stop)...${NC}"
echo ""

# Kill function for cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    jobs -p | xargs kill 2>/dev/null || true
    exit 0
}

trap cleanup EXIT INT TERM

# Start servers side by side
(
    cd backend
    source venv/bin/activate
    exec python manage.py runserver 8000 2>&1 | sed 's/^/[Backend] /'
) &

sleep 2

(
    cd frontend
    exec npm run dev 2>&1 | sed 's/^/[Frontend] /'
) &

echo -e "${GREEN}✓ Both servers started!${NC}"
echo ""

# Wait for both to complete
wait
