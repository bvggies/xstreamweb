# Xstream - Football Live Streaming Platform

A complete football live streaming website built with Next.js, Node.js, Express, and MongoDB. Features live match streaming, subscription management, and admin dashboard.

## 🚀 Features

- **Live Football Streaming**: Watch matches in HD quality with HLS.js
- **User Authentication**: Secure login/register with JWT tokens
- **Subscription System**: Paystack integration for premium subscriptions
- **Live Scores**: Real-time match updates from API-Football
- **Admin Dashboard**: Manage matches, streams, and content
- **Responsive Design**: Beautiful dark green theme with modern UI
- **IPTV Support**: Stream from m3u8 links

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Paystack** for payments
- **API-Football** for live scores
- **Node-cron** for scheduled tasks

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **HLS.js** for video streaming
- **React Hot Toast** for notifications
- **Axios** for API calls

## 📁 Project Structure

```
xstreamweb/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Match.js
│   │   │   └── Subscription.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── matchRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── paystackRoutes.js
│   │   │   └── subscriptionRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   ├── services/
│   │   │   └── apiFootballService.js
│   │   ├── utils/
│   │   │   └── paystack.js
│   │   ├── server.js
│   │   └── app.js
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── watch/[id]/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── subscription/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── MatchCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── types/
│   │   └── index.ts
│   └── package.json
└── env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Paystack account
- API-Football account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd xstreamweb
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env with your actual values
   ```

5. **Start the development servers**

   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/xstream
JWT_SECRET=your_super_secret_jwt_key_here

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key

# API-Football
API_FOOTBALL_KEY=your_api_football_key_here

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get single match
- `GET /api/matches/live/current` - Get live matches
- `GET /api/matches/upcoming/list` - Get upcoming matches

### Admin
- `POST /api/admin/matches` - Create match
- `PUT /api/admin/matches/:id` - Update match
- `DELETE /api/admin/matches/:id` - Delete match
- `GET /api/admin/matches` - Get all matches (admin)

### Paystack
- `POST /api/paystack/initialize` - Initialize payment
- `POST /api/paystack/webhook` - Paystack webhook
- `POST /api/paystack/verify` - Verify payment

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `GET /api/subscription/history` - Get subscription history
- `POST /api/subscription/renew` - Renew subscription

## 🎨 Design System

### Colors
- **Primary**: `#00B140` (Vivid Green)
- **Accent**: `#FFCC00` (Yellow Gold)
- **Background**: `#0A0A0A` (Dark)
- **Text**: `#FFFFFF` (White)
- **Secondary**: `#1E1E1E` (Dark Gray)

### Typography
- **Primary Font**: Inter
- **Display Font**: Poppins

## 🔐 User Roles

### User
- View matches and schedules
- Subscribe to premium
- Watch live streams (with subscription)

### Admin
- All user permissions
- Create/edit/delete matches
- Manage stream links
- Access admin dashboard

## 💳 Subscription Plans

### Free Plan
- Match schedules
- Live scores
- Match highlights

### Premium Plan (₦50/month)
- Everything in Free
- Live HD streaming
- All matches access
- Ad-free experience
- Priority support

## 🚀 Deployment

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Database (MongoDB Atlas)
1. Create a cluster
2. Get connection string
3. Update MONGO_URI

## 🧪 Testing

### Sample Data
The application includes sample matches with test stream links for development.

### Test Accounts
- **Admin**: Create via registration and update role in database
- **User**: Register normally

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@xstream.com or create an issue in the repository.

---

**Built with ❤️ for football fans worldwide**
