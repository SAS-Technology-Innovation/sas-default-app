#!/bin/bash
# ============================================================
#  Quick Start — run this script to launch your app.
#  It checks for Docker, helps you install it if needed,
#  builds the container, and opens the app in your browser.
# ============================================================

set -e

APP_URL="http://localhost:11000"

# ---- Colors (fallback to plain text if terminal doesn't support them) ----
if [ -t 1 ]; then
  BOLD="\033[1m"
  GREEN="\033[32m"
  YELLOW="\033[33m"
  RED="\033[31m"
  RESET="\033[0m"
else
  BOLD="" GREEN="" YELLOW="" RED="" RESET=""
fi

info()  { echo -e "${GREEN}${BOLD}>>>${RESET} $1"; }
warn()  { echo -e "${YELLOW}${BOLD}>>>${RESET} $1"; }
error() { echo -e "${RED}${BOLD}>>>${RESET} $1"; }

# ---- Check for Docker ----
check_docker() {
  if command -v docker &>/dev/null; then
    return 0
  fi
  return 1
}

check_docker_running() {
  if docker info &>/dev/null 2>&1; then
    return 0
  fi
  return 1
}

install_docker_prompt() {
  error "Docker is not installed."
  echo ""
  echo "Docker Desktop is a free app that lets you run this project."
  echo "Install it for your system:"
  echo ""

  case "$(uname -s)" in
    Darwin)
      echo "  Mac: https://docs.docker.com/desktop/install/mac-install/"
      echo ""
      echo "  Or install with Homebrew:"
      echo "    brew install --cask docker"
      ;;
    Linux)
      echo "  Linux: https://docs.docker.com/desktop/install/linux/"
      echo ""
      echo "  Or use your package manager:"
      echo "    Ubuntu/Debian: sudo apt install docker.io docker-compose-v2"
      echo "    Fedora:        sudo dnf install docker docker-compose"
      ;;
    MINGW*|MSYS*|CYGWIN*)
      echo "  Windows: https://docs.docker.com/desktop/install/windows-install/"
      ;;
    *)
      echo "  https://docs.docker.com/get-docker/"
      ;;
  esac

  echo ""
  echo "After installing, open Docker Desktop, then run this script again."
  exit 1
}

# ---- Open browser (cross-platform) ----
open_browser() {
  case "$(uname -s)" in
    Darwin)  open "$1" ;;
    Linux)   xdg-open "$1" 2>/dev/null || true ;;
    MINGW*|MSYS*|CYGWIN*) start "$1" ;;
  esac
}

# ---- Main ----
echo ""
info "Starting your app..."
echo ""

# 1. Check Docker is installed
if ! check_docker; then
  install_docker_prompt
fi

# 2. Check Docker daemon is running
if ! check_docker_running; then
  warn "Docker is installed but not running."
  echo ""
  echo "Please open Docker Desktop and wait for it to start,"
  echo "then run this script again."
  exit 1
fi

# 3. Build and start
info "Building the app (this may take a few minutes the first time)..."
docker compose up -d --build

echo ""
info "Your app is running!"
echo ""
echo "  Open in your browser:  ${BOLD}${APP_URL}${RESET}"
echo ""
echo "  First time? The app will walk you through setting up"
echo "  your authentication — just follow the on-screen steps."
echo ""
echo "  Useful commands:"
echo "    ./start.sh          Start the app"
echo "    docker compose down  Stop the app"
echo "    docker compose logs  View logs"
echo ""

# 4. Open browser
open_browser "$APP_URL"
