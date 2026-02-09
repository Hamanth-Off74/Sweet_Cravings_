# Voice Ordering Setup Script for Windows
# This script helps you set up the voice ordering feature

Write-Host "🎤 Voice Ordering Feature Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get your AssemblyAI API key:" -ForegroundColor White
Write-Host "   - Visit: https://www.assemblyai.com/" -ForegroundColor Gray
Write-Host "   - Sign up for a free account" -ForegroundColor Gray
Write-Host "   - Copy your API key from the dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Open the .env file and add your AssemblyAI key:" -ForegroundColor White
Write-Host "   ASSEMBLYAI_KEY=your_actual_api_key_here" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Restart your backend server:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Visit the Menu page in your browser" -ForegroundColor White
Write-Host "   http://localhost:3000/menu" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Look for the purple 'Voice Order' section and start ordering!" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed documentation, see: VOICE_ORDERING_GUIDE.md" -ForegroundColor Magenta
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete! Happy Voice Ordering!" -ForegroundColor Green
Write-Host ""

# Open .env file in default editor
$openFile = Read-Host "Would you like to open the .env file now? (y/n)"
if ($openFile -eq "y" -or $openFile -eq "Y") {
    notepad .env
}
