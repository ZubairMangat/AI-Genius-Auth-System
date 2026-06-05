# AI-Genius Auth System

A secure Node.js + Express authentication and authorization backend for the **AI-Genius** SaaS platform. This project demonstrates **JWT-based authentication**, **refresh token handling**, **Role-Based Access Control (RBAC)**, and protected AI endpoints.

## Features

* User login with email and password
* Password hashing with **bcryptjs**
* Short-lived **JWT access token**
* Long-lived **JWT refresh token** stored in an **httpOnly cookie**
* Refresh token whitelist stored in memory for demonstration
* Custom authentication middleware (`protect`)
* Role-based authorization middleware (`restrictTo`)
* Centralized error handling
* Protected AI routes for Free, Premium, and Admin users

## Roles

The system supports three roles:

* `Admin`
* `Premium_User`
* `Free_User`

## API Endpoints

### Auth Routes

#### `POST /api/auth/login`

Logs in a user and returns an access token.

**Request Body**

```json
{
  "email": "free@aigenius.com",
  "password": "Free@123"
}
```

**Response**

```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "...",
  "user": {
    "id": "3",
    "email": "free@aigenius.com",
    "role": "Free_User"
  }
}
```

#### `POST /api/auth/refresh`

Generates a new access token using the refresh token cookie.

**Response**

```json
{
  "success": true,
  "message": "Access token refreshed",
  "accessToken": "..."
}
```

#### `POST /api/auth/logout`

Logs the user out and clears the refresh token cookie.

---

### AI Routes

#### `GET /api/ai/free-model`

Accessible by all authenticated users.

#### `POST /api/ai/premium-model`

Accessible by `Premium_User` and `Admin` only.

#### `DELETE /api/ai/purge-cache`

Accessible by `Admin` only.

## Project Structure

```text
ai-genius-auth/
│── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── protect.js
│   │   ├── restrictTo.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/
│   │   └── token.js
│   └── app.js
├── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── AI-Genius-Auth.postman_collection.json
```

## Installation

### 1. Clone the repository

```bash
git clone <your-github-repo-link>
cd ai-genius-auth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env` file in the project root and add:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 4. Run the server

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

## Demo Users

Use the following sample users to test the API:

### Admin

* Email: `admin@aigenius.com`
* Password: `Admin@123`

### Premium User

* Email: `premium@aigenius.com`
* Password: `Premium@123`

### Free User

* Email: `free@aigenius.com`
* Password: `Free@123`

## How the Authentication Flow Works

1. The user sends email and password to `POST /api/auth/login`.
2. The server validates the password using bcrypt.
3. A short-lived access token is returned in the response.
4. A refresh token is stored in an `httpOnly` cookie.
5. The client sends the access token in the `Authorization: Bearer <token>` header for protected routes.
6. When the access token expires, the client calls `POST /api/auth/refresh`.
7. The server verifies the refresh token and issues a new access token.
8. Role-based middleware ensures only the correct roles can access premium or admin routes.

## Security Notes

* Passwords are never stored in plaintext.
* JWT payload includes only safe data: `id`, `email`, and `role`.
* Refresh token is stored in a secure cookie.
* Unauthorized access returns `401 Unauthorized`.
* Forbidden role access returns `403 Forbidden`.

## Postman / Thunder Client Testing

This project was tested using API client requests for:

* Login
* Accessing protected routes
* Role-based access control
* Token expiry
* Refresh token generation
* Admin-only access

Screenshots and saved responses can be included as proof of testing for submission.

## Example Headers for Protected Requests

```text
Authorization: Bearer <your_access_token>
```

## Example Refresh Request

```http
POST /api/auth/refresh
```

No body is required. The refresh token is read from the cookie.

## Technologies Used

* Node.js
* Express.js
* JWT
* bcryptjs
* dotenv
* cookie-parser
* CORS
* Postman / Thunder Client

## Notes

This project uses a mock in-memory user store for assignment demonstration purposes. In a production application, replace the mock database with a real database such as MongoDB or PostgreSQL.

## Author

Prepared for a Web Engineering and AI assignment on secure authentication, JWT, and RBAC.
