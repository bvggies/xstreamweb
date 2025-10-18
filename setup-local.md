# 🚀 Quick Local Testing Setup for Xstream

## Option 1: MongoDB Atlas (Recommended - Free & Easy)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a free account**
3. **Create a new cluster** (free tier)
4. **Get your connection string** (looks like: `mongodb+srv://username:password@cluster.mongodb.net/xstream`)
5. **Update your `.env` file** with the connection string

## Option 2: Local MongoDB Installation

1. **Download MongoDB Community Server** from [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Install and start MongoDB service**
3. **Keep the default connection string** in `.env`: `mongodb://localhost:27017/xstream`

## Option 3: Docker (If you have Docker installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🔑 API Keys Setup

### Paystack (Optional for testing)
- Go to [Paystack](https://paystack.com)
- Sign up and get test keys
- Update `.env` with your keys

### API-Football (Optional for testing)
- Go to [API-Football](https://www.api-football.com)
- Sign up and get API key
- Update `.env` with your key

## 🎯 For Quick Testing (No API Keys Required)

The app will work without API keys, but with limited functionality:
- ✅ User registration/login
- ✅ Match viewing
- ✅ Admin dashboard
- ❌ Live scores (needs API-Football)
- ❌ Payments (needs Paystack)

## 🚀 Start the Application

1. **Update `.env` with MongoDB connection string**
2. **Start backend**: `cd backend && npm run dev`
3. **Start frontend**: `cd frontend && npm run dev`
4. **Visit**: http://localhost:3000

## 🧪 Test Accounts

The app will automatically create these test accounts:
- **Admin**: admin@xstream.com / admin123
- **User**: user@xstream.com / user123

## 📱 Test Features

1. **Register/Login** with test accounts
2. **Browse matches** on home page
3. **Try to watch** a match (shows subscription required)
4. **Access admin dashboard** (if logged in as admin)
5. **Add/edit matches** in admin panel
