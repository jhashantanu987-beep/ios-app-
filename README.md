# Marketplace Backend API

A production-ready backend for a marketplace web app built with Node.js, Express.js, and MongoDB.

## Features

✅ **User Authentication**
- JWT-based authentication
- Password hashing with bcryptjs
- User registration and login
- Profile management

✅ **Marketplace Listings**
- Create and read listings
- Image support
- User ownership tracking
- Clean response and validation handling

✅ **Security**
- Password hashing with bcrypt
- JWT token-based authentication
- Input validation
- Error handling middleware
- CORS protection

✅ **Architecture**
- Clean modular structure
- Separation of concerns
- Reusable middleware
- Centralized error handling
- Environment variables support

## API Documentation

A complete endpoint reference is available in `docs/api.md`.

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # MongoDB connection
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   └── listingController.js
│   ├── models/              # Database models
│   │   ├── User.js
│   │   └── Listing.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   └── listingRoutes.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication
│   │   ├── errorHandler.js  # Error handling
│   │   └── validation.js    # Request validation
│   ├── utils/               # Utility functions
│   │   ├── validators.js    # Validation rules
│   │   └── helpers.js       # Helper functions
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── .env.example             # Environment variables example
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file and update:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

4. **Start MongoDB**
```bash
# If MongoDB is installed locally
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env with your connection string
```

5. **Start the server**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

### 2. Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

### 3. Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "url",
      "bio": "Bio",
      "phone": "123456789",
      "address": {...},
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 4. Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "I sell quality items",
  "phone": "1234567890",
  "avatar": "image_url",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### 5. Change Password
```
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

---

## Listing Endpoints

### 1. Create Listing
```
POST /listings
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 13 Pro",
  "description": "Great condition, barely used, comes with box and accessories",
  "price": 800,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "location": "New York, NY"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "listing": {
      "_id": "listing_id",
      "title": "iPhone 13 Pro",
      "description": "...",
      "price": 800,
      "images": [...],
      "location": "New York, NY",
      "seller": {
        "_id": "seller_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2. Get All Listings
```
GET /listings
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "listings": [...]
  }
}
```

### 3. Get Single Listing
```
GET /listings/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "listing": {...}
  }
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Common Status Codes

- `200` - OK / Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden (Not authorized for this action)
- `404` - Not Found
- `500` - Internal Server Error

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/marketplace

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

---

## Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test
```

---

## Validation Rules

### User Registration
- **Name**: Required, 2-50 characters
- **Email**: Valid email format, unique
- **Password**: Minimum 6 characters, must contain letters and numbers
- **Confirm Password**: Must match password

### Listing Creation
- **Title**: Required, 3-100 characters
- **Description**: Required, 10-2000 characters
- **Price**: Required, must be positive number
- **Category**: Required, must be valid category
- **Images**: 1-10 images required
- **Location**: City and state required

---

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isVerified: Boolean,
  role: String (user|admin),
  timestamps: true
}
```

### Listing Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  category: String,
  condition: String,
  images: [String],
  location: {
    city: String,
    state: String,
    country: String
  },
  seller: ObjectId (ref: User),
  status: String (active|sold|inactive),
  rating: {
    average: Number,
    count: Number
  },
  views: Number,
  timestamps: true
}
```

---

## Development Tips

1. **Testing with cURL or Postman**
   - Import the API endpoints in Postman
   - Use the provided examples to test endpoints
   - Store JWT token in a Postman variable for reuse

2. **Database Indexing**
   - Application automatically creates indexes
   - Text search available on title and description

3. **Security**
   - Always use HTTPS in production
   - Keep JWT_SECRET secure (use strong random string)
   - Validate all inputs on both frontend and backend
   - Implement rate limiting for production

4. **Scalability**
   - Use MongoDB Atlas for production databases
   - Implement caching (Redis) for frequently accessed data
   - Use CDN for image storage (AWS S3, Cloudinary, etc.)

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify database host is accessible

### JWT Token Expired
- Login again to get a new token
- Token expires after 7 days by default

### Port Already in Use
- Change PORT in .env
- Or kill the process using the port

### CORS Errors
- Update CORS_ORIGIN in .env
- Ensure frontend URL is included

---

## Best Practices

✅ Store JWT tokens securely (not in localStorage for mobile)
✅ Use HTTPS in production
✅ Implement rate limiting
✅ Add request logging
✅ Monitor error logs
✅ Use environment variables for sensitive data
✅ Validate inputs on both client and server
✅ Keep dependencies updated

---

## License

ISC

---

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Node.js, Express, and MongoDB**
