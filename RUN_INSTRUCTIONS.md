# ASPATAL Hospital Management System

This project has been set up to easily run on any local machine. 

You have two options for running the project on your local host:

## Option 1: Native Startup (Recommended for Development)
*Requires Java 17 and Node.js installed.*

1. Double-click on `install.bat` - This will download and install all the necessary dependencies for both the backend and the frontend. You only need to run this once!
2. Double-click on `start.bat` - This will automatically open two command prompts and start the Spring Boot backend and the React frontend simultaneously.
   - Frontend will be available at: http://localhost:5173
   - Backend API will be available at: http://localhost:8080

## Option 2: Docker Startup (Recommended for Production/Testing)
*Requires Docker Desktop installed.*

1. Ensure Docker Desktop is running.
2. Double-click on `start-docker.bat` - This will build and run the entire application (Database, Backend, and Frontend) inside isolated Docker containers.
   - Frontend will be available at: http://localhost:5173
   - Backend API will be available at: http://localhost:8080
   - HL7 MLLP Server will be available at: port 2575

To stop the Docker containers, you can press `Ctrl+C` in the command prompt or manage them from Docker Desktop.
