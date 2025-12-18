# Contributing Guide

## Development Setup

### Prerequisites
- **Node.js 18+** and npm
- **Git**
- **Docker** (optional, for Jaeger tracing)

### Platform-Specific Setup

#### macOS
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Docker Desktop (optional)
brew install --cask docker

# Or use nvm for Node.js version management
brew install nvm
nvm install 18
nvm use 18
```

#### Windows
```powershell
# Using winget
winget install OpenJS.NodeJS
winget install Git.Git
winget install Docker.DockerDesktop

# Or download installers from:
# Node.js: https://nodejs.org/
# Git: https://git-scm.com/download/win
# Docker: https://www.docker.com/products/docker-desktop

# Recommended: Use Git Bash or WSL2 for bash script compatibility
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
sudo apt install -y docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd madlen-case-study
   
   # Automated setup (macOS/Linux/Git Bash)
   chmod +x setup.sh
   ./setup.sh
   
   # Or manual installation
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Setup**
   ```bash
   # Backend (.env)
   cp backend/.env.example backend/.env
   # Add your OPENROUTER_API_KEY to backend/.env
   ```

3. **Run Development**
   
   **macOS/Linux:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   
   # Terminal 3 - Jaeger (optional)
   docker-compose up
   ```
   
   **Windows PowerShell:**
   ```powershell
   # Terminal 1 - Backend
   cd backend; npm run dev
   
   # Terminal 2 - Frontend
   cd frontend; npm run dev
   
   # Terminal 3 - Jaeger (optional)
   docker-compose up
   ```

## Project Structure

```
madlen-case-study/
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── types/           # TypeScript types
│   │   └── tracing.ts       # OpenTelemetry setup
│   └── tests/               # Backend tests
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── api/             # API client
│   │   └── main.jsx         # Entry point
│   └── tests/               # Frontend tests
│
└── docker-compose.yml       # Jaeger setup
```

## Coding Standards

### TypeScript/JavaScript
- Use TypeScript for backend
- Use ES6+ features
- Async/await over promises
- Meaningful variable names
- Add JSDoc comments for complex functions

### React Components
- Functional components with hooks
- Props destructuring
- CSS modules or scoped styles
- Accessibility (ARIA labels)

### API Design
- RESTful conventions
- Consistent error responses
- Proper HTTP status codes
- Request/response validation

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## Common Tasks

### Adding a New API Endpoint
1. Create route in `backend/src/routes/`
2. Add service logic in `backend/src/services/`
3. Update types in `backend/src/types/`
4. Add OpenTelemetry spans
5. Write tests

### Adding a New Component
1. Create component in `frontend/src/components/`
2. Create matching CSS file
3. Export from component
4. Add to parent component
5. Test in browser

## Troubleshooting

### Port Already in Use

**macOS/Linux:**
```bash
# Backend (port 3000)
lsof -ti:3000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

**Windows PowerShell:**
```powershell
# Backend (port 3000)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Frontend (port 5173)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### OpenRouter API Issues
- Check API key in `.env`
- Verify model availability
- Check rate limits
- View logs: `backend/logs/`

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues (macOS)
- Ensure Docker Desktop is running
- Check Docker preferences > Resources
- Restart Docker Desktop if needed

### WSL2 Issues (Windows)
```powershell
# Check WSL version
wsl --list --verbose

# Set default to WSL2
wsl --set-default-version 2

# Restart WSL
wsl --shutdown
```

## Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push: `git push origin feature/your-feature`
4. Create Pull Request

### Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

## Performance Tips

- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load images
- Use compression middleware
- Enable HTTP/2
- Add Redis caching (future enhancement)

## Getting Help

- Check existing issues
- Read documentation
- Ask in discussions
- Contact maintainers
