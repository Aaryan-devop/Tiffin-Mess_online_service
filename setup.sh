#!/bin/bash

# TiffinHub - Complete Setup Script
# Run this script to initialize the project

set -e  # Exit on error

echo "==============================================="
echo "   TiffinHub - SaaS Platform Setup"
echo "==============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if PostgreSQL is installed/running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL manually."
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu/Debian: sudo apt-get install postgresql"
    echo "   Windows: Download from postgresql.org"
fi

echo ""
echo "📦 Step 1: Installing dependencies..."
echo "-------------------------------------------"
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "🗄️  Step 2: Setting up database..."
echo "-------------------------------------------"
echo "Before proceeding, ensure:"
echo "1. PostgreSQL is running"
echo "2. You have created a database named 'tiffin_db'"
echo "3. You have updated DATABASE_URL in .env.local"
echo ""
read -p "Have you configured DATABASE_URL? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running Prisma push..."
    npm run db:push

    if [ $? -eq 0 ]; then
        echo "✅ Database schema created"
    else
        echo "❌ Failed to push database schema"
        echo "Check your DATABASE_URL and ensure PostgreSQL is running"
        exit 1
    fi
else
    echo "⚠️  Skipping database setup. Configure DATABASE_URL and run:"
    echo "   npm run db:push"
fi

echo ""
echo "🌱 Step 3: Seeding sample data (optional)..."
echo "-------------------------------------------"
read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
    if [ $? -eq 0 ]; then
        echo "✅ Sample data seeded"
        echo ""
        echo "📋 Test credentials created:"
        echo "   Consumer: consumer@example.com / password123"
        echo "   Vendor: vendor@example.com / password123"
    else
        echo "⚠️  Seed script failed, but you can run it later: npm run db:seed"
    fi
fi

echo ""
echo "🔐 Step 4: Generating NextAuth secret..."
echo "-------------------------------------------"
if ! grep -q "your-secret-key-here-change-this" .env.local; then
    SECRET=$(openssl rand -base64 32)
    echo "Generated secret key"
    echo "Add this to your .env.local:"
    echo "NEXTAUTH_SECRET=$SECRET"
else
    echo "✅ NEXTAUTH_SECRET already set in .env.local"
fi

echo ""
echo "==============================================="
echo "   Setup Complete!"
echo "==============================================="
echo ""
echo "Next steps:"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open http://localhost:3000 in your browser"
echo ""
echo "3. Login with seeded credentials:"
echo "   - Consumer: consumer@example.com / password123"
echo "   - Vendor: vendor@example.com / password123"
echo ""
echo "4. Configure external services (optional):"
echo "   - Google OAuth in Google Cloud Console"
echo "   - Razorpay/Stripe for payments"
echo "   - Twilio for WhatsApp notifications"
echo ""
echo "📚 See README.md for detailed documentation"
echo "==============================================="
