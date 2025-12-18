#!/bin/bash

# Development Environment Setup Script
# Cross-platform: Works on macOS, Linux, and Windows (Git Bash/WSL)

set -e  # Exit on error

echo "🚀 Madlen Development Environment Setup"
echo "========================================"
echo ""

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="Windows"
fi

echo "📱 Detected OS: $OS"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo ""
    if [[ "$OS" == "macOS" ]]; then
        echo "💡 Install with Homebrew: brew install node"
        echo "   Or download from: https://nodejs.org/"
    elif [[ "$OS" == "Windows" ]]; then
        echo "💡 Download from: https://nodejs.org/"
        echo "   Or use winget: winget install OpenJS.NodeJS"
    else
        echo "💡 Install with package manager:"
        echo "   Ubuntu/Debian: sudo apt install nodejs npm"
        echo "   Fedora: sudo dnf install nodejs npm"
        echo "   Or download from: https://nodejs.org/"
    fi
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    echo "💡 Update Node.js to the latest LTS version"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Setup backend environment
if [ ! -f ".env" ]; then
    echo "⚙️  Setting up backend environment..."
    cp .env.example .env
    echo "⚠️  Please add your OPENROUTER_API_KEY to backend/.env"
else
    echo "✅ Backend .env already exists"
fi

# Build backend
echo "🔨 Building backend..."
npm run build

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker detected (for Jaeger tracing)"
    
    # Check if Docker is running
    if docker info &> /dev/null; then
        echo "✅ Docker daemon is running"
    else
        echo "⚠️  Docker is installed but not running"
        if [[ "$OS" == "macOS" ]]; then
            echo "   Start Docker Desktop from Applications"
        elif [[ "$OS" == "Windows" ]]; then
            echo "   Start Docker Desktop"
        else
            echo "   Start Docker: sudo systemctl start docker"
        fi
    fi
else
    echo "⚠️  Docker not found. Jaeger tracing won't be available."
    if [[ "$OS" == "macOS" ]]; then
        echo "   Install Docker Desktop: brew install --cask docker"
    elif [[ "$OS" == "Windows" ]]; then
        echo "   Install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    else
        echo "   Install Docker: sudo apt install docker.io (Ubuntu/Debian)"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Add your OPENROUTER_API_KEY to backend/.env"
echo "   2. Start backend: cd backend && npm run dev"
echo "   3. Start frontend: cd frontend && npm run dev"
echo "   4. (Optional) Start Jaeger: docker-compose up"
echo ""
echo "🎯 Platform-specific tips:"
if [[ "$OS" == "macOS" ]]; then
    echo "   • Use Terminal or iTerm2"
    echo "   • Consider using nvm for Node.js version management"
    echo "   • Homebrew is your friend: brew install <package>"
elif [[ "$OS" == "Windows" ]]; then
    echo "   • Use Git Bash, PowerShell, or WSL2"
    echo "   • Consider using nvm-windows for version management"
    echo "   • Windows Terminal recommended for better experience"
else
    echo "   • Use your preferred terminal"
    echo "   • Consider using nvm for Node.js version management"
fi
echo ""
echo "📚 Documentation: README.md"
echo "🤝 Contributing: CONTRIBUTING.md"
echo "🎁 Bonus Features: BONUS_FEATURES.md"
echo ""
