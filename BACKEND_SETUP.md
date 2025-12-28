# Backend Setup Documentation

## Overview

The application now uses a real backend server with a SQLite database for user authentication instead of localStorage.

## Architecture

### Backend Stack

- **Node.js + Express**: REST API server
- **TypeScript**: Type-safe backend code
- **SQLite**: Lightweight database for user storage
- **bcryptjs**: Password hashing
- **jsonwebtoken (JWT)**: Token-based authentication
- **CORS**: Cross-origin resource sharing

### Frontend Stack

- **React**: UI framework
- **AuthContext**: State management for authentication
- **AuthService**: API communication layer

## Project Structure

```
ptcg-seeker/
├── server/
│   ├── index.ts              # Express server entry point
│   ├── database/
│   │   └── db.ts            # SQLite database setup
│   ├── routes/
│   │   └── auth.ts          # Authentication routes
│   ├── middleware/
│   │   └── auth.ts          # JWT authentication middleware
│   └── tsconfig.json        # TypeScript config for server
├── src/
│   ├── services/
│   │   └── auth-service.ts  # Frontend API service
│   └── contexts/
│       └── AuthContext.tsx  # Authentication state management
├── data/                    # SQLite database storage (auto-created)
├── .env                     # Environment variables (not committed)
├── .env.example             # Example environment variables
└── .env.local               # Frontend environment variables
```

## Environment Variables

### Backend (.env)

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
CLIENT_URL=http://localhost:5173
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3001
```

## API Endpoints

### POST /api/auth/signup

Create a new user account.

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

**Errors:**

- 400: Username already taken
- 400: Password too short (< 6 characters)
- 400: Missing required fields

### POST /api/auth/login

Login with existing credentials.

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

**Errors:**

- 401: Invalid username or password
- 400: Missing required fields

### GET /api/auth/me

Get current user information (requires authentication).

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

**Errors:**

- 401: No token provided
- 401: Invalid or expired token
- 404: User not found

### GET /api/health

Health check endpoint.

**Response (200):**

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Database Schema

### users table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- bcrypt hashed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Running the Application

### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Backend:**

```bash
npm run dev:server
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

### Option 2: Run Both Concurrently

```bash
npm run dev:all
```

The frontend will be available at: http://localhost:5173
The backend will be available at: http://localhost:3001

## Security Features

### Password Security

- Passwords are hashed using bcrypt with 10 salt rounds
- Plain text passwords are never stored in the database
- Password minimum length enforced (6 characters)

### Token-Based Authentication

- JWT tokens with 7-day expiration
- Tokens stored in localStorage on the client
- Tokens sent via Authorization header
- Server validates tokens on protected routes

### CORS Protection

- Only allowed origins can access the API
- Credentials support enabled for cookie/token sharing

## Frontend Integration

### AuthService

The `auth-service.ts` provides a clean API interface:

```typescript
import { authService } from './services/auth-service';

// Signup
await authService.signup({ username, password });

// Login
await authService.login({ username, password });

// Logout
authService.logout();

// Get stored user
const user = authService.getStoredUser();

// Check if user has token
const hasAuth = authService.hasToken();
```

### AuthContext

React context provides authentication state:

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, signup } = useAuth();

  // Use authentication state
}
```

## Production Deployment

### Important Steps for Production:

1. **Change JWT Secret**

   - Generate a strong random secret
   - Update `.env` file
   - Never commit the secret to version control

2. **Use PostgreSQL/MySQL**

   - Replace SQLite with a production database
   - Update database connection in `server/database/db.ts`

3. **Add HTTPS**

   - Use SSL/TLS certificates
   - Configure reverse proxy (nginx/Apache)

4. **Environment Variables**

   - Use environment-specific configurations
   - Set `NODE_ENV=production`

5. **Rate Limiting**

   - Add rate limiting middleware to prevent brute force
   - Limit login attempts per IP

6. **Additional Security**

   - Add email verification
   - Implement password reset
   - Add two-factor authentication (2FA)
   - Add CSRF protection
   - Implement account lockout after failed attempts

7. **Database Backups**

   - Set up regular database backups
   - Test restore procedures

8. **Logging & Monitoring**
   - Add proper logging (Winston, Bunyan)
   - Set up error tracking (Sentry)
   - Monitor server health

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Locked

The SQLite database is stored in `data/database.db`. If you encounter lock issues:

```bash
# Stop the server and delete the database
rm -rf data/
# Restart the server (it will recreate the database)
```

### CORS Errors

Make sure `CLIENT_URL` in `.env` matches your frontend URL.

### Token Expiration

Tokens expire after 7 days. Users will need to log in again.

## Migration from localStorage

The old localStorage-based authentication has been completely replaced. Users will need to create new accounts as the old localStorage data is not migrated to the database.

If you need to migrate existing users:

1. Export localStorage data before upgrading
2. Create a migration script to insert users into the database
3. Hash passwords before insertion

## Development Tips

- The database file is created automatically in `data/database.db`
- Use tools like DB Browser for SQLite to inspect the database
- JWT tokens can be decoded at https://jwt.io for debugging
- Check server logs for detailed error messages
