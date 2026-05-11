@echo off
echo =======================================================
echo     ASPATAL HMS - Setup and Installation Script
echo =======================================================
echo.

echo [1/2] Installing Backend Dependencies (Maven)...
cd backend
call .\mvnw.cmd clean install -DskipTests
cd ..
echo.

echo [2/2] Installing Frontend Dependencies (NPM)...
cd frontend
call npm install
cd ..
echo.

echo =======================================================
echo Installation Complete!
echo You can now run the application using start.bat
echo =======================================================
pause
