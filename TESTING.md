# Testing Guide

## API Testing

This guide covers testing the Marketplace backend API.

---

## Manual Testing with Postman

### Setup

1. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select `Marketplace-API.postman_collection.json`
   - Click Import

2. **Configure Environment Variables**
   - Click "Environments" in left panel
   - Create new environment: "Local Development"
   - Add variables:
     - `base_url`: http://localhost:5000/api
     - `token`: (leave empty for now)
     - `user_id`: (will be filled after registration)
     - `listing_id`: (will be filled after creating listing)

3. **Run Tests**
   - Select "Local Development" environment
   - Execute requests in order

---

## Testing Workflow

### 1. Authentication Tests

**Test 1.1: Register User**
```
Request: POST /auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPassword123",
  "confirmPassword": "TestPassword123"
}

Expected Response: 201 Created
Response Body includes: token
Action: Copy token to {{token}} variable
```

**Test 1.2: Register with Duplicate Email**
```
Request: POST /auth/register
Body: (same as above)

Expected Response: 400 Bad Request
Message: "User already exists with this email"
```

**Test 1.3: Register with Weak Password**
```
Request: POST /auth/register
Body: {
  "name": "Test User",
  "email": "test2@example.com",
  "password": "123", (too short)
  "confirmPassword": "123"
}

Expected Response: 400 Bad Request
```

**Test 1.4: Login**
```
Request: POST /auth/login
Body: {
  "email": "test@example.com",
  "password": "TestPassword123"
}

Expected Response: 200 OK
Response Body includes: token
Action: Update {{token}} variable with new token
```

**Test 1.5: Login with Wrong Password**
```
Request: POST /auth/login
Body: {
  "email": "test@example.com",
  "password": "WrongPassword"
}

Expected Response: 401 Unauthorized
Message: "Invalid email or password"
```

**Test 1.6: Get Current User**
```
Request: GET /auth/me
Headers: Authorization: Bearer {{token}}

Expected Response: 200 OK
Returns: Full user profile
```

**Test 1.7: Update Profile**
```
Request: PUT /auth/profile
Headers: Authorization: Bearer {{token}}
Body: {
  "bio": "I'm a seller",
  "phone": "1234567890"
}

Expected Response: 200 OK
```

**Test 1.8: Change Password**
```
Request: POST /auth/change-password
Headers: Authorization: Bearer {{token}}
Body: {
  "currentPassword": "TestPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}

Expected Response: 200 OK
Message: "Password changed successfully"
Action: Login again with new password
```

---

### 2. Listing Tests

**Test 2.1: Create Listing**
```
Request: POST /listings
Headers: Authorization: Bearer {{token}}
Body: {
  "title": "Test Listing",
  "description": "This is a test listing for testing purposes",
  "price": 99.99,
  "category": "Electronics",
  "condition": "New",
  "images": ["https://example.com/image.jpg"],
  "location": {
    "city": "New York",
    "state": "NY"
  }
}

Expected Response: 201 Created
Response Body includes: listing with ID
Action: Copy listing._id to {{listing_id}} variable
```

**Test 2.2: Create Invalid Listing (Missing Required Field)**
```
Request: POST /listings
Headers: Authorization: Bearer {{token}}
Body: (without title)

Expected Response: 400 Bad Request
Message: "Please provide all required fields"
```

**Test 2.3: Create Listing Without Auth**
```
Request: POST /listings
Body: (same as Test 2.1)
Note: Don't include Authorization header

Expected Response: 401 Unauthorized
Message: "No authorization token provided"
```

**Test 2.4: Get All Listings**
```
Request: GET /listings

Expected Response: 200 OK
Returns: Array of listings with pagination
```

**Test 2.5: Get Listings with Filters**
```
Request: GET /listings?category=Electronics&minPrice=50&maxPrice=500&page=1&limit=10

Expected Response: 200 OK
Returns: Filtered listings
```

**Test 2.6: Search Listings**
```
Request: GET /listings?search=test

Expected Response: 200 OK
Returns: Listings matching search
```

**Test 2.7: Get Single Listing**
```
Request: GET /listings/{{listing_id}}

Expected Response: 200 OK
Returns: Listing details with incremented view count
```

**Test 2.8: Get Single Listing - Invalid ID**
```
Request: GET /listings/invalid-id

Expected Response: 400 Bad Request (CastError)
```

**Test 2.9: Update Listing**
```
Request: PUT /listings/{{listing_id}}
Headers: Authorization: Bearer {{token}}
Body: {
  "title": "Updated Listing",
  "price": 89.99
}

Expected Response: 200 OK
Message: "Listing updated successfully"
```

**Test 2.10: Update Listing - Not Owner**
```
Setup: Create second user
Request: PUT /listings/{{listing_id}} (from first user)
Headers: Authorization: Bearer {{second_user_token}}

Expected Response: 403 Forbidden
Message: "Not authorized to update this listing"
```

**Test 2.11: Delete Listing**
```
Request: DELETE /listings/{{listing_id}}
Headers: Authorization: Bearer {{token}}

Expected Response: 200 OK
Message: "Listing deleted successfully"
```

**Test 2.12: Get User's Listings**
```
Request: GET /listings/user/my-listings
Headers: Authorization: Bearer {{token}}
Query: ?status=active&page=1&limit=10

Expected Response: 200 OK
Returns: Only user's own listings
```

**Test 2.13: Get Seller's Listings**
```
Request: GET /listings/seller/{{user_id}}

Expected Response: 200 OK
Returns: Public listings from seller
```

**Test 2.14: Get Listing Stats**
```
Request: GET /listings/stats/overview
Headers: Authorization: Bearer {{token}}

Expected Response: 200 OK
Returns: {
  "total": number,
  "active": number,
  "sold": number,
  "inactive": number,
  "totalViews": number,
  "avgPrice": number
}
```

---

## Automated Testing with Jest

### Setup

```bash
npm install --save-dev jest supertest
```

### Test Structure

Create `tests/` directory:

```
tests/
├── auth.test.js
├── listings.test.js
└── setup.js
```

### Example Test File

**tests/auth.test.js**
```javascript
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
  });

  afterAll(async () => {
    // Clean up
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'Password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'duplicate@example.com',
          password: 'Password123',
          confirmPassword: 'Password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'duplicate@example.com',
          password: 'Password123',
          confirmPassword: 'Password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
```

### Run Tests

```bash
npm test
```

---

## Performance Testing

### Load Testing with Artillery

```bash
npm install -g artillery
```

**load-test.yml**
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"

scenarios:
  - name: "Get Listings"
    flow:
      - get:
          url: "/api/listings?page=1&limit=10"
```

Run:
```bash
artillery run load-test.yml
```

---

## API Contract Testing

### Using OpenAPI/Swagger

```bash
npm install swagger-ui-express swagger-jsdoc
```

Add to app.js:
```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marketplace API',
      version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:5000/api' }]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

Access documentation at: `http://localhost:5000/api-docs`

---

## Security Testing

### Test Cases

1. **SQL Injection**
   - Try special characters in inputs
   - Expected: Properly escaped/validated

2. **XSS Prevention**
   - Try HTML tags in inputs
   - Expected: Stored securely

3. **CSRF Protection**
   - Test token validation
   - Expected: Invalid tokens rejected

4. **Authentication**
   - Test without token
   - Test with invalid token
   - Test with expired token

5. **Authorization**
   - Try accessing other user's data
   - Expected: 403 Forbidden

6. **Rate Limiting**
   - Send multiple rapid requests
   - Expected: 429 Too Many Requests after limit

---

## Test Coverage

```bash
npm test -- --coverage
```

Target:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

---

## CI/CD Testing

### GitHub Actions Example

**.github/workflows/test.yml**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test
```

---

## Debugging

### Enable Debug Logs

```bash
DEBUG=* npm run dev
```

### VS Code Debugging

**.vscode/launch.json**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/server.js"
    }
  ]
}
```

---

## Checklist Before Production

- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] No console.log in production code
- [ ] Error handling tested
- [ ] Edge cases covered
- [ ] Performance acceptable
- [ ] Security tests passed
- [ ] Load testing successful
- [ ] Rollback tested
- [ ] Documentation complete

---

**Happy Testing! 🧪**
