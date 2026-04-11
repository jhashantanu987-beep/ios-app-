# API Documentation

## Base URL

All endpoints are mounted under `/api`.

Example:

- `http://localhost:5000/api/auth/register`
- `http://localhost:5000/api/listings`

---

# Authentication Endpoints

## Register a new user

`POST /api/auth/register`

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

Response (201 Created):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-04-11T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

## Login

`POST /api/auth/login`

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```

Response (200 OK):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

## Get current user

`GET /api/auth/me`

Headers:

- `Authorization: Bearer <token>`

Response (200 OK):

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

---

# Listings Endpoints

## Create Listing

`POST /api/listings`

Headers:

- `Authorization: Bearer <token>`
- `Content-Type: application/json`

Body:

```json
{
  "title": "Mountain Bike",
  "description": "Lightly used bike in great shape.",
  "price": 450,
  "images": [
    "https://example.com/bike1.jpg"
  ],
  "location": "Portland, OR"
}
```

Response (201 Created):

```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "listing": {
      "_id": "listing_id",
      "title": "Mountain Bike",
      "description": "Lightly used bike in great shape.",
      "price": 450,
      "images": [
        "https://example.com/bike1.jpg"
      ],
      "location": "Portland, OR",
      "userId": {
        "_id": "user_id",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "createdAt": "2026-04-11T00:00:00.000Z"
    }
  }
}
```

## Get all listings

`GET /api/listings`

Response (200 OK):

```json
{
  "success": true,
  "message": "Listings retrieved successfully",
  "data": {
    "listings": [
      {
        "_id": "listing_id",
        "title": "Mountain Bike",
        "description": "Lightly used bike in great shape.",
        "price": 450,
        "images": [
          "https://example.com/bike1.jpg"
        ],
        "location": "Portland, OR",
        "userId": {
          "_id": "user_id",
          "name": "Jane Doe",
          "email": "jane@example.com"
        },
        "createdAt": "2026-04-11T00:00:00.000Z"
      }
    ]
  }
}
```

## Get single listing

`GET /api/listings/:id`

Response (200 OK):

```json
{
  "success": true,
  "message": "Listing retrieved successfully",
  "data": {
    "listing": {
      "_id": "listing_id",
      "title": "Mountain Bike",
      "description": "Lightly used bike in great shape.",
      "price": 450,
      "images": [
        "https://example.com/bike1.jpg"
      ],
      "location": "Portland, OR",
      "userId": {
        "_id": "user_id",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "createdAt": "2026-04-11T00:00:00.000Z"
    }
  }
}
```

---

# Error Responses

Errors return a consistent structure:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Detailed validation or error message"
    }
  ]
}
```

Common status codes:

- `400` — Validation or bad request
- `401` — Authentication required or invalid token
- `404` — Resource not found
- `500` — Server error
