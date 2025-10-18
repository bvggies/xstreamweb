# 🚀 Xstream Deployment Guide - Vercel

## 📋 **Prerequisites**

1. **GitHub Account** - [github.com](https://github.com)
2. **Vercel Account** - [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - [mongodb.com/atlas](https://mongodb.com/atlas) (Free)

## 🎯 **Step-by-Step Deployment**

### **Step 1: Push Code to GitHub**

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `xstream-football`
   - Make it **Public** (required for free Vercel)
   - Click "Create repository"

2. **Push your code to GitHub:**
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Xstream Football Streaming Platform"
   
   # Add remote origin (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/xstream-football.git
   
   # Push to GitHub
   git push -u origin main
   ```

### **Step 2: Set Up MongoDB Atlas**

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Sign up for free account**
3. **Create a new cluster:**
   - Choose "Free" tier
   - Select a region close to you
   - Click "Create Cluster"
4. **Set up database access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `xstream`
   - Password: `xstream123` (or your own)
   - Click "Add User"
5. **Set up network access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
6. **Get connection string:**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://xstream:xstream123@cluster0.mongodb.net/xstream?retryWrites=true&w=majority`

### **Step 3: Deploy Backend to Vercel**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository:**
   - Select `xstream-football`
   - Click "Import"
4. **Configure the backend deployment:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`
5. **Add Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://xstream:xstream123@cluster0.mongodb.net/xstream?retryWrites=true&w=majority
   JWT_SECRET=xstream_super_secret_jwt_key_for_production
   NODE_ENV=production
   FRONTEND_URL=https://xstream-frontend.vercel.app
   PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
   API_FOOTBALL_KEY=your_api_football_key_here
   ```
6. **Click "Deploy"**
7. **Wait for deployment to complete**
8. **Note the deployment URL** (e.g., `https://xstream-backend.vercel.app`)

### **Step 4: Deploy Frontend to Vercel**

1. **Go back to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import the same GitHub repository:**
   - Select `xstream-football`
   - Click "Import"
4. **Configure the frontend deployment:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`
5. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://xstream-backend.vercel.app/api
   ```
6. **Click "Deploy"**
7. **Wait for deployment to complete**
8. **Note the deployment URL** (e.g., `https://xstream-frontend.vercel.app`)

### **Step 5: Update Backend Environment Variables**

1. **Go to your backend project in Vercel**
2. **Go to Settings > Environment Variables**
3. **Update FRONTEND_URL:**
   ```
   FRONTEND_URL=https://xstream-frontend.vercel.app
   ```
4. **Redeploy the backend**

### **Step 6: Test Your Deployment**

1. **Visit your frontend URL:** `https://xstream-frontend.vercel.app`
2. **Test the features:**
   - Register a new account
   - Login with test accounts:
     - Admin: `admin@xstream.com` / `admin123`
     - User: `user@xstream.com` / `user123`
   - Browse matches
   - Try to watch a match
   - Access admin dashboard (if logged in as admin)

## 🎉 **You're Live!**

Your Xstream Football Streaming Platform is now deployed and accessible worldwide!

### **Your URLs:**
- **Frontend:** `https://xstream-frontend.vercel.app`
- **Backend API:** `https://xstream-backend.vercel.app/api`
- **Health Check:** `https://xstream-backend.vercel.app/api/health`

## 🔧 **Optional: Add Custom Domain**

1. **Go to your Vercel project settings**
2. **Click "Domains"**
3. **Add your custom domain**
4. **Update DNS settings as instructed**

## 📱 **Features Available:**

✅ **User Registration/Login**  
✅ **Match Browsing**  
✅ **Admin Dashboard**  
✅ **Video Player** (with sample streams)  
✅ **Responsive Design**  
✅ **Live Database**  
⏳ **Live Scores** (needs API-Football key)  
⏳ **Payments** (needs Paystack keys)  

## 🆘 **Troubleshooting**

### **Backend not working:**
- Check environment variables in Vercel
- Check MongoDB connection string
- Check Vercel function logs

### **Frontend not connecting to backend:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings
- Verify backend is deployed and running

### **Database connection issues:**
- Check MongoDB Atlas network access
- Verify connection string format
- Check database user permissions

## 🎯 **Next Steps:**

1. **Add API keys** for full functionality
2. **Customize the design** to your liking
3. **Add more matches** via admin dashboard
4. **Set up custom domain**
5. **Configure analytics**

---

**🎉 Congratulations! Your Football Streaming Platform is now live on the internet!**
