# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# For local development, default values should work
```

### Step 3: Start MongoDB
**Option A - Local MongoDB**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B - MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Update MONGODB_URI in .env with connection string

### Step 4: Start the Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Or production mode
npm start
```

You should see:
```
============================================================
✓ Server running on port 5000
✓ Environment: development
✓ API Base URL: http://localhost:5000/api
============================================================
```

---

## Testing the API

### Option 1: Using Postman
1. Import `Marketplace-API.postman_collection.json` into Postman
2. Set the `base_url` variable to `http://localhost:5000/api`
3. Start with Auth → Register to create a user
4. Copy the token from response
5. Set the `token` variable with the JWT token
6. Test other endpoints

### Option 2: Using cURL

**Register a User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Get Current User (use token from login response):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Option 3: Using REST Client (VS Code Extension)

Create a file `test.http`:
```http
### Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

---

## Project Structure Overview

```
src/
├── config/
│   └── database.js          → MongoDB connection setup
├── controllers/
│   ├── authController.js    → User auth logic
│   └── listingController.js → Listing CRUD logic
├── models/
│   ├── User.js              → User schema
│   ├── Listing.js           → Listing schema
│   └── index.js             → Model exports
├── routes/
│   ├── authRoutes.js        → Auth endpoints
│   └── listingRoutes.js     → Listing endpoints
├── middleware/
│   ├── auth.js              → JWT verification
│   ├── errorHandler.js      → Global error handling
│   └── validation.js        → Request validation
├── utils/
│   ├── constants.js         → App constants
│   ├── validators.js        → Validation rules
│   ├── helpers.js           → Utility functions
│   └── logger.js            → Logging utility
├── app.js                   → Express app setup
└── server.js                → Server entry point
```

---

## Key Features Implemented

✅ **Authentication**
- User registration with validation
- Login with JWT token
- Password hashing with bcrypt
- Profile management
- Password change

✅ **Listings**
- Create/Read/Update/Delete operations
- Filter by category, price, location
- Search functionality
- Pagination support
- View count tracking
- User-specific listings

✅ **Security**
- JWT token-based auth
- Password validation before storage
- Input validation on all endpoints
- Error handling and logging
- CORS protection

✅ **Code Quality**
- Modular structure
- Consistent error responses
- Comprehensive validation
- Professional logging
- Reusable middleware

---

## Troubleshooting

### Server won't start - Port already in use
```bash
# Change port in .env
PORT=5001
```

### MongoDB connection error
```bash
# Check MongoDB is running
mongod

# Verify MONGODB_URI in .env is correct
```

### JWT token issues
```bash
# Ensure JWT_SECRET is set in .env
# Token expires after 7 days by default
JWT_SECRET=your_secret_key_here
```

### CORS errors
```bash
# Make sure frontend URL is in CORS_ORIGIN
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

---

## Next Steps

1. ✅ Install & run the server
2. ✅ Test endpoints with Postman or cURL
3. ✅ Build your frontend
4. ✅ Connect frontend to backend API
5. ✅ Deploy to production

### Production Deployment Checklist
- [ ] Change NODE_ENV to 'production'
- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas (not local)
- [ ] Enable HTTPS
- [ ] Set proper CORS_ORIGIN
- [ ] Add rate limiting
- [ ] Enable logging
- [ ] Monitor error logs
- [ ] Set up backups
- [ ] Use environment variables

---

## Need Help?

- Check [README.md](./README.md) for full API documentation
- Review code comments for implementation details
- Check error messages for debugging hints
- Ensure all dependencies are installed: `npm install`

---

**Happy Coding! 🚀**
