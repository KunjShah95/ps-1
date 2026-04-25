# Docker Build Script for Windows
Write-Host "Building Docker image for Vortex Arena AI..." -ForegroundColor Cyan

# Build the image
docker build -t vortex-arena-ai .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host "You can run the container using: docker-compose up" -ForegroundColor Yellow
} else {
    Write-Host "Build failed." -ForegroundColor Red
}
