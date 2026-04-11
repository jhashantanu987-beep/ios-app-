# Architecture Guide

## System Architecture

This document describes the architecture of the Marketplace Backend API.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│           Client Applications                        │
│  (Web, Mobile, Desktop)                             │
└────────────────┬────────────────────────────────────┘
                 │
          ┌──────▼──────┐
          │   Requests  │
          │  (HTTP/HTTPS)
          └──────┬──────┘
                 │
    ┌────────────▼──────────────┐
    │   Express.js Server       │
    │  (Port 5000)              │
    └────────────┬──────────────┘
                 │
         ┌───────▼────────┐
         │   Middleware   │
         │   Pipeline     │
         └───────┬────────┘
                 │
      ┌──────────▼───────────┐
      │  Route Handlers      │
      │  (Controllers)       │
      └──────────┬───────────┘
                 │
    ┌────────────▼────────────┐
    │    Business Logic       │
    │  (Controllers/Services) │
    └────────────┬────────────┘
                 │
     ┌───────────▼────────────┐
     │   MongoDB Database     │
     │  (Data Persistence)    │
     └────────────────────────┘
```

---

## Core Components

### 1. Entry Point (server.js)

**Responsibilities:**
- Load environment variables
- Initialize database connection
- Start Express server
- Handle process signals

**Flow:**
```
server.js
├── dotenv.config() → Load env variables
├── connectDB() → Connect to MongoDB
└── app.listen(PORT) → Start Express server
```

---

### 2. Express Application (app.js)

**Responsibilities:**
- Configure middleware
- Mount routes
- Setup error handling
- Configure CORS

**Middleware Stack:**
```
Request
  ↓
CORS middleware
  ↓
Body Parser (JSON)
  ↓
Route Handlers
  ↓
404 Handler
  ↓
Error Handler
  ↓
Response
```

---

### 3. Routing Layer (routes/)

**Route Organization:**

```
/api
├── /auth (authRoutes.js)
│   ├── POST /register          → public
│   ├── POST /login             → public
│   ├── GET /me                 → protected
│   ├── PUT /profile            → protected
│   └── POST /change-password   → protected
│
└── /listings (listingRoutes.js)
    ├── POST /                  → protected (create)
    ├── GET /                   → public (list with filters)
    ├── GET /user/my-listings   → protected
    ├── GET /stats/overview     → protected
    ├── GET /seller/:sellerId   → public
    ├── GET /:id                → public
    ├── PUT /:id                → protected (owner only)
    └── DELETE /:id             → protected (owner only)
```

**Route Priority:**
- Specific routes before generic routes
- e.g., `/user/my-listings` before `/:id`

---

### 4. Controller Layer (controllers/)

**Responsibility:** Business logic for each endpoint

**Pattern:**
```javascript
exports.functionName = async (req, res, next) => {
  try {
    // Validate input
    // Process business logic
    // Query database
    // Return response
  } catch (error) {
    next(error); // Pass to error handler
  }
};
```

**Features:**
- Input validation
- Database operations
- Response formatting
- Error handling via next()

---

### 5. Model Layer (models/)

**Database Schemas:**

**User Model**
```
User
├── name (String, required)
├── email (String, unique, required)
├── password (String, hashed, required)
├── avatar (String, optional)
├── bio (String, optional)
├── phone (String, optional)
├── address (Object, optional)
├── isVerified (Boolean, default: false)
├── role (Enum: user, admin)
└── timestamps (createdAt, updatedAt)

Pre-save Hook: Hash password
Method: matchPassword() → Compare passwords
```

**Listing Model**
```
Listing
├── title (String, required)
├── description (String, required)
├── price (Number, required)
├── category (Enum)
├── condition (Enum)
├── images (Array)
├── location (Object: city, state, country)
├── seller (Reference to User)
├── status (Enum: active, sold, inactive)
├── rating (Object: average, count)
├── views (Number, tracked)
└── timestamps (createdAt, updatedAt)

Indexes:
- seller + status
- full-text search on title + description
- location based
- price based
```

---

### 6. Middleware Layer (middleware/)

**Authentication Middleware (auth.js)**
```
authMiddleware
└── Verify JWT token
└── Extract user ID
└── Attach to req.user
└── Next handler or 401 error

optionalAuth
└── Same as above
└── Continue even if no token
```

**Error Handler Middleware (errorHandler.js)**
```
errorHandler
├── Mongoose ValidationError → 400
├── Duplicate key error (11000) → 400
├── CastError → 400
├── JWT errors → 401
└── Default → 500
```

**Validation Middleware (validation.js)**
```
validateRequest
└── Check express-validator results
└── Return 400 with errors or continue
```

---

### 7. Utility Layer (utils/)

**Validators (validators.js)**
- Reusable validation chains
- express-validator rules
- Applied to routes

**Constants (constants.js)**
- Categories
- Status enums
- HTTP codes
- Limits

**Helpers (helpers.js)**
- Pagination logic
- Filter builders
- Authorization checks
- Distance calculations

**Logger (logger.js)**
- Colored console output
- Different log levels
- Timestamps

---

## Data Flow

### Authentication Flow

1. **Register**
   ```
   POST /auth/register
     ↓
   registerValidation → validateRequest
     ↓
   authController.register
     ├── Validate passwords match
     ├── Check duplicate email
     ├── Hash password (bcrypt)
     ├── Create user in DB
     ├── Generate JWT token
     └── Return user + token
   ```

2. **Login**
   ```
   POST /auth/login
     ↓
   loginValidation → validateRequest
     ↓
   authController.login
     ├── Find user by email
     ├── Compare passwords (bcrypt)
     ├── Generate JWT token
     └── Return user + token
   ```

3. **Protected Route Access**
   ```
   Any Protected Route
     ↓
   Extract token from "Authorization: Bearer <token>"
     ↓
   Verify JWT signature
     ↓
   Decode token → get user ID
     ↓
   Attach to req.user
     ↓
   Proceed to controller
   ```

---

### Listing CRUD Flow

**Create Listing**
```
POST /listings
  ├── authMiddleware (verify token)
  ├── createListingValidation
  ├── validateRequest
  └── listingController.createListing
      ├── Validate required fields
      ├── Build listing object
      ├── Save to DB
      ├── Populate seller details
      └── Return created listing
```

**Get Listings**
```
GET /listings?filters
  ├── optionalAuth (get user if exists)
  ├── listingController.getAllListings
      ├── Build filter object from query
      ├── Apply pagination
      ├── Execute MongoDB query
      ├── Populate seller details
      ├── Count total
      └── Return listings + pagination
```

**Update Listing**
```
PUT /listings/:id
  ├── authMiddleware
  ├── updateListingValidation
  ├── validateRequest
  └── listingController.updateListing
      ├── Find listing
      ├── Check ownership
      ├── Update fields
      ├── Save to DB
      └── Return updated listing
```

**Delete Listing**
```
DELETE /listings/:id
  ├── authMiddleware
  └── listingController.deleteListing
      ├── Find listing
      ├── Check ownership
      ├── Delete from DB
      └── Return success
```

---

## Error Handling Strategy

### Error Flow

```
Any Handler
    ↓
throw error or next(error)
    ↓
Global Error Handler Middleware
    ↓
├── Identify error type
├── Set appropriate status code
├── Format error message
├── Include validation errors if any
└── Return JSON response
```

### Error Types Handled

```
1. Validation Errors
   - Missing fields
   - Invalid format
   - Type mismatches

2. Database Errors
   - Mongoose ValidationError
   - Duplicate key (unique constraint)
   - Invalid ObjectId (CastError)

3. Authentication Errors
   - Invalid token
   - Expired token
   - Missing token

4. Authorization Errors
   - User not owner
   - Invalid role

5. Resource Errors
   - Not found
   - Already exists

6. Server Errors
   - Unhandled exceptions
   - Database connection issues
```

---

## Security Architecture

### Password Security
```
User enters password
    ↓
Validate requirements (length, chars)
    ↓
Generate salt (bcrypt)
    ↓
Hash password with salt
    ↓
Store hash (not plaintext)
    ↓
On login: Compare entered password with stored hash
```

### JWT Authentication
```
User credentials valid
    ↓
Create JWT with user ID
    ├── Payload: {id: userId}
    ├── Secret: JWT_SECRET
    └── Expiry: 7 days
    ↓
Send token to client
    ↓
Client stores and sends in Authorization header
    ↓
Server verifies signature and expiry
```

### Input Validation
```
Request received
    ↓
express-validator rules applied
    ↓
├── Type checking
├── Length limits
├── Format validation (email, URL)
├── Enum validation
└── Custom rules
    ↓
If errors → Return 400 with error details
If valid → Continue to controller
```

### Authorization Checks
```
Protected endpoint accessed
    ↓
Verify user is authenticated
    ↓
For resource operations (update, delete)
    ↓
Check if user is resource owner
    ↓
If owner → Allow operation
If not → Return 403 Forbidden
```

---

## Database Design

### Relationships

```
Users (1) ←──── (Many) Listings
         seller reference
```

### Indexing Strategy

```
Listing Indexes:
├── {seller: 1, status: 1}
│   → Fast filter by seller + status
│
├── Text index on {title: 'text', description: 'text'}
│   → Full-text search capability
│
├── {location: 1}
│   → Geographic filtering
│
└── {price: 1}
    → Price range queries
```

### Query Optimization

```
Common Queries → Indexed Fields:
- Get my listings → seller index
- Search listings → text index
- Filter by location → location index
- Filter by price → price index
```

---

## Performance Considerations

### Query Optimization
- Pagination (limit results)
- Field selection (don't fetch unnecessary fields)
- Index utilization
- Lean queries for read-only

### Caching Opportunities
- User profile (rarely changes)
- Listing details
- Seller information
- Search results

### Scalability
- Horizontal: Multiple server instances
- Vertical: Database optimization
- Caching layer (Redis)
- CDN for images

---

## Request/Response Format

### Standard Response Format

**Success Response**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation message"
    }
  ]
}
```

---

## Deployment Architecture

### Development
```
LocalHost:5000
    ↓
Express Server
    ↓
MongoDB (local)
```

### Production
```
Client Application
    ↓ HTTPS
Reverse Proxy (Nginx)
    ↓
Load Balancer (optional)
    ↓
Express Server (multiple instances)
    ↓
MongoDB Atlas (replicated)
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| Validation | express-validator |
| Logging | Custom logger |
| Testing | Jest + Supertest |
| Deployment | Heroku/AWS/DigitalOcean |

---

## Design Patterns

### MVC-like Architecture
- Models: Database schemas
- Views: JSON responses
- Controllers: Business logic

### Middleware Pipeline
- Sequential middleware execution
- Each middleware can modify request
- Error handling at end of chain

### Async/Await
- Clean async code
- Centralized error handling with try/catch

### Dependency Injection
- Models imported in controllers
- Middleware injected into routes
- No tight coupling

---

## Conclusion

The architecture is designed to be:
- **Modular**: Clear separation of concerns
- **Scalable**: Easy to add features
- **Secure**: Authentication, validation, error handling
- **Maintainable**: Clean code structure
- **Professional**: Production-ready patterns

Every component has a single responsibility, making the codebase easy to understand, test, and extend.

---

**Built with best practices for production-ready applications** 🚀
