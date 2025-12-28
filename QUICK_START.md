# Quick Start Guide - Backend Authentication

## 🚀 Your Application Now Has Real Backend Authentication!

### What Changed?

✅ **Before**: Used localStorage (client-side only)
✅ **Now**: Real backend server with database

### Current Status

- ✅ Backend server created with Express + TypeScript
- ✅ SQLite database for user storage
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ CORS configured
- ✅ Frontend integrated with backend API

## 🏃 Running Your Application

### Start Both Frontend & Backend Together:

```bash
npm run dev:all
```

### Or Start Them Separately:

**Terminal 1 - Backend:**

```bash
npm run dev:server
```

Server runs on: http://localhost:3001

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Frontend runs on: http://localhost:5173 (or 5174)

## 🧪 Testing the Authentication

1. **Open your browser**: http://localhost:5173 (or 5174)

2. **Create an account**:

   - Click "Sign Up" in the upper right
   - Enter a username and password
   - Your password is now hashed in the database!

3. **Login**:

   - Click "Login"
   - Use your credentials
   - You'll receive a JWT token (valid for 7 days)

4. **Logout**:
   - Click on your username
   - Select "Logout"

## 🔍 What's Happening Behind the Scenes

### When you sign up:

1. Frontend sends username + password to `/api/auth/signup`
2. Backend hashes password with bcrypt
3. User stored in SQLite database
4. JWT token generated and returned
5. Token saved in localStorage
6. User automatically logged in

### When you login:

1. Frontend sends credentials to `/api/auth/login`
2. Backend verifies password hash
3. JWT token generated and returned
4. User authenticated

### Database Location:

```
data/database.db
```

This file is created automatically. You can inspect it with DB Browser for SQLite.

## 📁 Key Files Created

### Backend:

- `server/index.ts` - Express server
- `server/routes/auth.ts` - Authentication endpoints
- `server/middleware/auth.ts` - JWT verification
- `server/database/db.ts` - Database setup

### Frontend:

- `src/services/auth-service.ts` - API communication
- Updated `src/contexts/AuthContext.tsx` - Now uses backend

### Configuration:

- `.env` - Backend environment variables
- `.env.local` - Frontend environment variables
- `.env.example` - Template for environment variables

## 🛠️ API Endpoints Available

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires token)
- `GET /api/health` - Server health check

## 🔒 Security Features

✅ Passwords hashed with bcrypt (10 rounds)
✅ JWT tokens with expiration (7 days)
✅ CORS protection
✅ SQL injection protection (parameterized queries)
✅ No plain-text passwords stored

## 📝 Next Steps (Optional Enhancements)

1. **Email verification** - Verify email addresses
2. **Password reset** - Forgot password functionality
3. **2FA** - Two-factor authentication
4. **Rate limiting** - Prevent brute force attacks
5. **Session management** - Multiple device login
6. **Profile management** - Update username, password
7. **Production database** - PostgreSQL/MySQL

## 🐛 Troubleshooting

### Backend won't start - Port in use:

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Frontend can't connect to backend:

1. Make sure backend is running (`npm run dev:server`)
2. Check `.env.local` has `VITE_API_URL=http://localhost:3001`
3. Restart frontend after changing `.env.local`

### Database issues:

```bash
# Delete and recreate database
rm -rf data/
# Restart server - it will recreate the database
```

### CORS errors:

Make sure `.env` has correct `CLIENT_URL` matching your frontend URL.

## 📚 Documentation

For detailed information, see:

- `BACKEND_SETUP.md` - Complete backend documentation
- `AUTH_DOCUMENTATION.md` - Original auth system docs

## 🎉 You're All Set!

Your Pokemon TCG Card Selector now has professional-grade authentication with a real backend!

Try creating an account and exploring the cards! 🎴
