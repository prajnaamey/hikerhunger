#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ===== Docker Management Functions =====
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${BLUE}Docker not found. Installing via Homebrew...${NC}"
        if ! command -v brew &> /dev/null; then
            echo -e "${RED}Error: Homebrew is not installed${NC}"
            echo "Please install Homebrew first: https://brew.sh"
            exit 1
        fi
        brew install --cask docker
        echo -e "${GREEN}Docker Desktop has been installed.${NC}"
        echo "Please start Docker Desktop application and try again."
        exit 1
    fi
}

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
        echo -e "${RED}Virtual environment not found. Please run 'setup --local' first.${NC}"
        exit 1
    fi
}

check_venv() {
    if [ ! -d "venv" ]; then
        echo -e "${RED}Virtual environment not found. Please run 'setup --local' first.${NC}"
        exit 1
    fi
}

# ===== Backend Functions =====
setup_backend() {
    if [ "$USE_LOCAL" = false ]; then
        echo -e "${GREEN}Setting up backend with Docker...${NC}"
        check_docker
        docker-compose build backend
    else
        create_venv
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        ./venv/bin/pip install -r src/backend/requirements.txt
        echo -e "${GREEN}Backend setup complete!${NC}"
        echo ""
        show_venv_activation
    fi
}

start_backend() {
    if [ "$USE_LOCAL" = false ]; then
        echo -e "${GREEN}Starting backend with Docker...${NC}"
        check_docker
        docker-compose up -d backend
        echo -e "${GREEN}Backend started! Access:${NC}"
        echo "API: http://localhost:8000"
        echo "Swagger Docs: http://localhost:8000/docs"
        echo "ReDoc: http://localhost:8000/redoc"
    else
        check_venv
        echo -e "${GREEN}Starting HikerHunger backend server...${NC}"
        PYTHONPATH=$PYTHONPATH:./src ./venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
    fi
}

stop_backend() {
    if [ "$USE_LOCAL" = false ]; then
        echo -e "${GREEN}Stopping backend with Docker...${NC}"
        check_docker
        docker-compose stop backend
    else
        echo -e "${GREEN}Stopping backend locally...${NC}"
        pkill -f "uvicorn backend.main:app"
    fi
}

view_logs() {
    if [ "$USE_LOCAL" = false ]; then
        echo -e "${GREEN}Viewing logs from Docker...${NC}"
        check_docker
        docker-compose logs -f "$COMPONENT"
    else
        echo -e "${RED}Logs viewing is only supported in Docker mode${NC}"
        exit 1
    fi
}

open_swagger() {
    echo -e "${GREEN}Opening Swagger documentation...${NC}"
    open http://localhost:8000/docs
}

open_redoc() {
    echo -e "${GREEN}Opening ReDoc documentation...${NC}"
    open http://localhost:8000/redoc
}

rebuild_backend() {
    if [ "$USE_LOCAL" = false ]; then
        echo -e "${GREEN}Rebuilding backend Docker image...${NC}"
        check_docker
        docker-compose down
        docker-compose build backend
        docker-compose up -d backend
        echo -e "${GREEN}Backend rebuilt and restarted!${NC}"
        echo -e "${BLUE}Note: Regular code changes don't require rebuild - they hot reload automatically${NC}"
    else
        echo -e "${YELLOW}Reinstalling dependencies...${NC}"
        ./venv/bin/pip install -r src/backend/requirements.txt
    fi
}

check_backend_status() {
    if [ "$USE_LOCAL" = false ]; then
        echo -e "${GREEN}Checking Docker container status...${NC}"
        check_docker
        CONTAINER_ID=$(docker-compose ps -q backend)
        if [ -z "$CONTAINER_ID" ]; then
            echo -e "${RED}Backend container is not running${NC}"
            exit 1
        fi
        echo -e "${GREEN}Backend container is running (ID: $CONTAINER_ID)${NC}"
        docker-compose ps backend
        
        # Show watched directories
        echo -e "\n${BLUE}Watching for changes in:${NC}"
        echo "- src/backend/"
        echo -e "${YELLOW}Note: Changes to Python files will auto-reload${NC}"
        echo -e "${YELLOW}Use 'rebuild' command if you change requirements.txt or Dockerfile${NC}"
    else
        echo -e "${GREEN}Checking local backend status...${NC}"
        if pgrep -f "uvicorn backend.main:app" > /dev/null; then
            echo -e "${GREEN}Backend is running locally${NC}"
            echo -e "\n${BLUE}Watching for changes in:${NC}"
            echo "- src/backend/"
            echo -e "${YELLOW}Note: Changes to Python files will auto-reload${NC}"
        else
            echo -e "${RED}Backend is not running locally${NC}"
            exit 1
        fi
    fi
}

verify_backend() {
    echo -e "${GREEN}Verifying backend API...${NC}"
    
    # Wait for the service to be ready
    echo "Waiting for service to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:8000 > /dev/null; then
            break
        fi
        sleep 1
        echo -n "."
    done
    echo ""

    # Test the API
    echo "Testing API endpoints..."
    curl -s http://localhost:8000 | jq . || echo "Failed to connect to API"
    
    echo -e "${GREEN}API Documentation available at:${NC}"
    echo "Swagger UI: http://localhost:8000/docs"
    echo "ReDoc: http://localhost:8000/redoc"
}

# ===== Frontend Functions =====
setup_frontend() {
    echo -e "${YELLOW}Setting up frontend...${NC}"
    cd src/frontend
    npm install --force
    cd ../..
    echo -e "${GREEN}Frontend setup complete!${NC}"
}

start_frontend() {
    echo -e "${YELLOW}Starting frontend...${NC}"
    cd src/frontend
    npm start
    cd ../..
}

stop_frontend() {
    echo -e "${YELLOW}Stopping frontend...${NC}"
    pkill -f "react-scripts start"
    echo -e "${GREEN}Frontend stopped!${NC}"
}

# ===== Help and Usage =====
show_help() {
    echo -e "${GREEN}HikerHunger Development Tools${NC}"
    echo -e "${BLUE}Usage:${NC}"
    echo "  ./hikerhunger.sh <component> <command> [options]"
    echo ""
    echo -e "${BLUE}Components:${NC}"
    echo "  backend   - Backend API service"
    echo "  frontend  - Frontend web application"
    echo "  app      - Full application (both backend and frontend)"
    echo ""
    echo -e "${BLUE}Commands:${NC}"
    echo "  setup     - Set up development environment"
    echo "  start     - Start the service"
    echo "  stop      - Stop the service"
    echo "  status    - Check service status"
    echo "  verify    - Verify API functionality"
    echo "  rebuild   - Rebuild service (needed for dependency changes)"
    echo "  logs      - View logs (Docker only)"
    echo "  docs      - Open Swagger documentation"
    echo "  redoc     - Open ReDoc documentation"
    echo ""
    echo -e "${BLUE}Options:${NC}"
    echo "  --local   - Use local environment instead of Docker (default: false)"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  ./hikerhunger.sh backend setup         # Setup with Docker"
    echo "  ./hikerhunger.sh backend start         # Start with Docker"
    echo "  ./hikerhunger.sh backend status        # Check container status & file watching"
    echo "  ./hikerhunger.sh backend verify        # Verify API is working"
    echo "  ./hikerhunger.sh backend rebuild       # Rebuild after dependency changes"
    echo "  ./hikerhunger.sh backend start --local # Start locally"
    echo "  ./hikerhunger.sh app setup             # Setup both backend and frontend"
    echo "  ./hikerhunger.sh frontend start        # Setup and start frontend"
}

# ===== Command Handlers =====
handle_backend() {
    case "$1" in
        "setup") setup_backend ;;
        "start") start_backend ;;
        "stop") stop_backend ;;
        "logs") view_logs ;;
        "docs") open_swagger ;;
        "redoc") open_redoc ;;
        "status") check_backend_status ;;
        "verify") verify_backend ;;
        "rebuild") rebuild_backend ;;
        *) 
            echo -e "${RED}Unknown backend command: $1${NC}"
            show_help
            ;;
    esac
}

handle_frontend() {
    case "$1" in
        "setup") setup_frontend ;;
        "start") start_frontend ;;
        "stop") stop_frontend ;;
        *) 
            echo -e "${RED}Unknown frontend command: $1${NC}"
            show_help
            ;;
    esac
}

handle_app() {
    case "$1" in
        "setup")
            setup_backend
            setup_frontend
            ;;
        "start")
            start_backend
            start_frontend
            ;;
        "stop")
            stop_frontend
            stop_backend
            ;;
        *)
            echo -e "${RED}Unknown app command: $1${NC}"
            show_help
            ;;
    esac
}

# ===== Main Script Logic =====
main() {
    if [ $# -lt 2 ]; then
        show_help
        exit 1
    fi

    COMPONENT=$1
    COMMAND=$2
    USE_LOCAL=false

    # Parse additional options
    shift 2
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --local) USE_LOCAL=true ;;
            *) echo -e "${RED}Unknown option: $1${NC}" >&2; exit 1 ;;
        esac
        shift
    done

    case "$COMPONENT" in
        "backend") handle_backend "$COMMAND" ;;
        "frontend") handle_frontend "$COMMAND" ;;
        "app") handle_app "$COMMAND" ;;
        "help"|"") show_help ;;
        *)
            echo -e "${RED}Unknown component: $COMPONENT${NC}"
            show_help
            exit 1
            ;;
    esac
}

main "$@" 