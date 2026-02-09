#!/bin/bash

# Voice Ordering Setup Script
# This script helps you set up the voice ordering feature

echo "🎤 Voice Ordering Feature Setup"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Get your AssemblyAI API key:"
echo "   - Visit: https://www.assemblyai.com/"
echo "   - Sign up for a free account"
echo "   - Copy your API key from the dashboard"
echo ""
echo "2. Open the .env file and add your AssemblyAI key:"
echo "   ASSEMBLYAI_KEY=your_actual_api_key_here"
echo ""
echo "3. Restart your backend server:"
echo "   npm start"
echo ""
echo "4. Visit the Menu page in your browser"
echo "   http://localhost:3000/menu"
echo ""
echo "5. Look for the purple 'Voice Order' section and start ordering!"
echo ""
echo "📖 For detailed documentation, see: VOICE_ORDERING_GUIDE.md"
echo ""
echo "================================"
echo "✨ Setup Complete! Happy Voice Ordering!"
