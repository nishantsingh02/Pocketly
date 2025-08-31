#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up environment files for Personal Expense Tracker...\n');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Server environment content
const serverEnvContent = `# Server Environment Variables
PORT=5000
JWT_SECRET=${jwtSecret}
GOOGLE_CLIENT_ID=your-google-client-id-here

# Database Configuration
DATABASE_URL="file:./dev.db"

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Node Environment
NODE_ENV=development
`;

// Client environment content
const clientEnvContent = `# Client Environment Variables
VITE_PRODUCTION_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# Development Configuration
VITE_APP_NAME=Personal Expense Tracker
VITE_APP_VERSION=1.0.0

# API Configuration
VITE_API_TIMEOUT=30000
VITE_POLLING_INTERVAL=30000
`;

try {
  // Create server .env file
  fs.writeFileSync(path.join(__dirname, 'server', '.env'), serverEnvContent);
  console.log('✅ Created server/.env file');
  
  // Create client .env file
  fs.writeFileSync(path.join(__dirname, 'client', '.env'), clientEnvContent);
  console.log('✅ Created client/.env file');
  
  console.log('\n📝 Next steps:');
  console.log('1. Update the GOOGLE_CLIENT_ID in both .env files with your actual Google OAuth client ID');
  console.log('2. Update the DATABASE_URL in server/.env with your PostgreSQL connection string');
  console.log('3. Run "npm run install-all" to install dependencies');
  console.log('4. Run "npm run dev" to start the development servers');
  
} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
  console.log('\n📝 Manual setup required:');
  console.log('1. Create server/.env file with the content from server/env.example');
  console.log('2. Create client/.env file with the content from client/env.example');
  console.log('3. Update the values with your actual configuration');
}
