@echo off
echo =======================================================
echo        ASPATAL HMS - Application Startup Script
echo =======================================================
echo.

echo Starting Spring Boot Backend...
cd backend
start "ASPATAL Backend" cmd /k ".\mvnw.cmd spring-boot:run"
cd ..

echo Starting React Frontend...
cd frontend
start "ASPATAL Frontend" cmd /k "npm run dev"
cd ..

echo.
echo =======================================================
echo Both services are starting up!
echo.
echo Please wait a moment for the servers to initialize.
echo.
echo The Frontend will be available at: http://localhost:5173
echo The Backend API will be available at: http://localhost:8080
echo.
echo (Two new command prompt windows have opened. To stop
echo the application, simply close those two windows.)
echo =======================================================
pause
