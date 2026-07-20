# Disaster Relief Backend

Backend for the Disaster Relief Distribution Management System. It provides database-pool configuration, versioned routing, centralized error handling, and victim authentication.

## Requirements

- Node.js 18 or later
- MySQL 8.0 or later

## Setup

1. Copy `.env.example` to `.env`, update the database values, and set `JWT_SECRET` to a long random value.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The server listens on `http://localhost:5000` by default.

## Health Check

```text
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "message": "Disaster Relief API is running"
}
```

## Structure

```text
backend/
├── config/       # Database configuration
├── controllers/  # Health and authentication handlers
├── middleware/   # Authentication, authorization, error, and not-found middleware
├── models/       # Parameterized database queries
├── routes/       # Versioned API routes
├── utils/        # Shared utilities
└── server.js     # Application entry point
```

## Authentication API

### Register a victim

```text
POST /api/v1/auth/register
Content-Type: application/json
```

```json
{
  "full_name": "Farhana Islam",
  "email": "farhana.islam@example.com",
  "password": "securepass123",
  "phone": "+8801712345678",
  "address": "Banani, Dhaka"
}
```

Successful response (`201 Created`):

```json
{
  "success": true,
  "message": "Victim registered successfully",
  "user": {
    "id": 7,
    "full_name": "Farhana Islam",
    "email": "farhana.islam@example.com",
    "phone": "+8801712345678",
    "address": "Banani, Dhaka",
    "role": "victim"
  }
}
```

### Login

```text
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "farhana.islam@example.com",
  "password": "securepass123"
}
```

Successful response (`200 OK`):

```json
{
  "success": true,
  "token": "<jwt valid for 24 hours>",
  "user": {
    "id": 7,
    "full_name": "Farhana Islam",
    "email": "farhana.islam@example.com",
    "phone": "+8801712345678",
    "address": "Banani, Dhaka",
    "role": "victim",
    "created_at": "2026-07-14T00:00:00.000Z"
  }
}
```

### Postman examples

Create two requests using the URLs below. Set the `Content-Type` header to `application/json` and use the corresponding JSON bodies above.

```text
POST http://localhost:5000/api/v1/auth/register
POST http://localhost:5000/api/v1/auth/login
```

For future protected endpoints, set this header in Postman:

```text
Authorization: Bearer <token>
```

The `authenticate` middleware verifies the token and attaches its `{ id, role, email }` payload to `req.user`. Use `authorize('admin')`, `authorize('victim')`, or `authorize('admin', 'victim')` after it to restrict routes by role.

No CRUD modules are implemented in this milestone.
