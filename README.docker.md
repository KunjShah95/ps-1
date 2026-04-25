# Docker Support for Vortex Arena AI

This project is configured for production-ready Docker deployment using Next.js Standalone mode.

## Files
- `Dockerfile`: Multi-stage production build.
- `docker-compose.yml`: Local testing configuration.
- `.dockerignore`: Optimized to exclude unnecessary files.
- `docker-build.ps1`: PowerShell script for easy building on Windows.

## How to Build
Run the PowerShell script:
```powershell
.\docker-build.ps1
```
Or manually:
```bash
docker build -t vortex-arena-ai .
```

## How to Run
Use Docker Compose to start the container:
```bash
docker-compose up
```
The application will be available at `http://localhost:8080`.

## Configuration
The Docker build uses `.env.production` for build-time environment variables (like Firebase keys). Ensure this file is up to date before building.
