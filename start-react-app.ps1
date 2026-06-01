# Quick Start Script for SweetCravings React

Write-Host "🍰 Starting SweetCravings React Application..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "📦 Checking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if (!$mongoProcess) {
    Write-Host "⚠️  MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
    Write-Host "   Run: mongod" -ForegroundColor Gray
    exit 1
}
Write-Host "✅ MongoDB is running" -ForegroundColor Green
Write-Host ""

# Start Backend Server
Write-Host "🚀 Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
$backendPath = $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm start" -WindowStyle Normal

Write-Host "✅ Backend server starting..." -ForegroundColor Green
Start-Sleep -Seconds 3
Write-Host ""

# Start React Frontend
Write-Host "⚛️  Starting React Frontend (Port 3000)..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal

Write-Host "✅ React frontend starting..." -ForegroundColor Green
Start-Sleep -Seconds 3
Write-Host ""

Write-Host "🎉 Application is starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Opening browser in 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✨ Enjoy your SweetCravings React app! ✨" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
