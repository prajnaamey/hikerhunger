#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ===== Environment Management Functions =====
create_venv() {
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}Creating virtual environment...${NC}"
        python3 -m venv venv
    else
        echo -e "${YELLOW}Virtual environment already exists${NC}"
    fi
}

show_venv_activation() {
    if [ -d "venv" ]; then
        echo -e "${GREEN}To activate the virtual environment, run:${NC}"
        echo "source venv/bin/activate"
        echo ""
        echo -e "${GREEN}To deactivate, run:${NC}"
        echo "deactivate"
    else
        echo -e "${RED}Virtual environment not found. Please run 'setup' first.${NC}"
        exit 1
    fi
}

check_venv() {
    if [ ! -d "venv" ]; then
        echo -e "${RED}Virtual environment not found. Please run 'setup' first.${NC}"
        exit 1
    fi
}

# ===== Backend Functions =====
install_backend_deps() {
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    ./venv/bin/pip install -r backend/requirements.txt
}

start_backend() {
    echo -e "${GREEN}Starting HikerHunger backend server...${NC}"
    ./venv/bin/python -m backend.main
}

open_swagger() {
    echo -e "${GREEN}Opening Swagger documentation...${NC}"
    open http://localhost:8000/docs
}

open_redoc() {
    echo -e "${GREEN}Opening ReDoc documentation...${NC}"
    open http://localhost:8000/redoc
}

# ===== Frontend Functions =====
# (To be implemented)

# ===== Help and Command Handlers =====
show_help() {
    echo -e "${GREEN}HikerHunger Development Tools${NC}"
    echo "Available commands:"
    echo ""
    echo -e "${BLUE}Backend Commands:${NC}"
    echo "  backend setup    - Set up the backend development environment"
    echo "  backend start    - Start the backend server"
    echo "  backend docs     - Open Swagger documentation"
    echo "  backend redoc    - Open ReDoc documentation"
    echo "  backend venv     - Show virtual environment activation command"
    echo ""
    echo -e "${BLUE}Frontend Commands:${NC}"
    echo "  frontend setup   - Set up the frontend development environment"
    echo "  frontend start   - Start the frontend development server"
    echo ""
    echo -e "${BLUE}Full App Commands:${NC}"
    echo "  app setup        - Set up both backend and frontend"
    echo "  app start        - Start both backend and frontend servers"
    echo ""
    echo "  help             - Show this help message"
}

handle_backend() {
    case "$1" in
        "setup")
            create_venv
            install_backend_deps
            echo -e "${GREEN}Backend setup complete!${NC}"
            echo ""
            show_venv_activation
            ;;
        "start")
            check_venv
            start_backend
            ;;
        "venv")
            show_venv_activation
            ;;
        "docs")
            open_swagger
            ;;
        "redoc")
            open_redoc
            ;;
        *)
            echo -e "${YELLOW}Unknown backend command: $1${NC}"
            show_help
            ;;
    esac
}

handle_frontend() {
    case "$1" in
        "setup")
            echo -e "${YELLOW}Frontend setup not implemented yet${NC}"
            ;;
        "start")
            echo -e "${YELLOW}Frontend start not implemented yet${NC}"
            ;;
        *)
            echo -e "${YELLOW}Unknown frontend command: $1${NC}"
            show_help
            ;;
    esac
}

handle_app() {
    case "$1" in
        "setup")
            handle_backend setup
            handle_frontend setup
            ;;
        "start")
            handle_backend start
            handle_frontend start
            ;;
        *)
            echo -e "${YELLOW}Unknown app command: $1${NC}"
            show_help
            ;;
    esac
}

# ===== Main Command Handler =====
case "$1" in
    "backend")
        handle_backend "$2"
        ;;
    "frontend")
        handle_frontend "$2"
        ;;
    "app")
        handle_app "$2"
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo -e "${YELLOW}Unknown command: $1${NC}"
        show_help
        ;;
esac
