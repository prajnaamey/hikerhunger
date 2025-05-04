#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if virtual environment exists
check_venv() {
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}Virtual environment not found. Creating one...${NC}"
        python3 -m venv venv
    fi
}

# Function to activate virtual environment
activate_venv() {
    source venv/bin/activate
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    pip install -r requirements.txt
}

# Function to start the server
start_server() {
    echo -e "${GREEN}Starting HikerHunger backend server...${NC}"
    python -m backend.main
}

# Function to show help
show_help() {
    echo -e "${GREEN}HikerHunger Backend Management${NC}"
    echo "Available commands:"
    echo "  setup    - Set up the development environment"
    echo "  start    - Start the backend server"
    echo "  help     - Show this help message"
}

# Main command handling
case "$1" in
    "setup")
        check_venv
        activate_venv
        install_deps
        echo -e "${GREEN}Setup complete!${NC}"
        ;;
    "start")
        check_venv
        activate_venv
        start_server
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo -e "${YELLOW}Unknown command: $1${NC}"
        show_help
        ;;
esac 
