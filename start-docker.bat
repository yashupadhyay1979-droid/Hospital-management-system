@echo off
echo =======================================================
echo     ASPATAL HMS - Docker Environment Startup
echo =======================================================
echo.
echo Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running or not installed.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Starting Full Stack Environment via Docker Compose...
docker-compose up --build

pause
