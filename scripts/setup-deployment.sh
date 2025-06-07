#!/bin/bash

echo "🚀 GuideMate Deployment Setup Script"
echo "======================================"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli
else
    echo "✅ EAS CLI is already installed"
fi

# Check if user is logged in to Expo
echo "🔐 Checking Expo authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please log in to your Expo account:"
    eas login
else
    echo "✅ Already logged in to Expo"
fi

# Configure EAS build
echo "⚙️ Configuring EAS build..."
eas build:configure

echo ""
echo "✅ Setup complete! Next steps:"
echo ""
echo "1. Create your app assets (icon, splash screen, etc.)"
echo "2. Update app.json with your specific details"
echo "3. Update eas.json with your Apple/Google credentials"
echo "4. Run your first build: eas build --platform all --profile preview"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" 