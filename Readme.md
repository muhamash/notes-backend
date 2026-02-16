# Notes API

A RESTful API for managing users, posts, and notes with authentication and admin capabilities.

##  Live Backend URL

```
https://notes-backend-1-qb3v.onrender.com/api/v1
```
## Live Frontend URL

```
https://secure-web-note.vercel.app
```


## Features

- User registration and authentication (JWT)
- Post management (CRUD operations)
- Note management (CRUD operations)
- Admin panel for user management
- Interest-based user grouping
- Role-based access control
- Input validation
- Security headers (Helmet)
- CORS enabled
- Request logging (Morgan)

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (Access & Refresh Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Custom validation middleware
- **Security**: Helmet, CORS
- **Logging**: Morgan


### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd notes-api
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory (see [Environment Variables](#environment-variables))

4. Start the development server
```bash
npm run dev
```

5. The API will be running at `http://localhost:5000`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DB_URL=mongodb://localhost:27017/notes-db
NODE_ENV=development

# JWT Secrets
ACCESS_TOKEN_SECRET=your_strong_access_token_secret_here
REFRESH_TOKEN_SECRET=your_strong_refresh_token_secret_here

# Bcrypt
BCRYPT_SALT=10

# Token Expiration
ACCESS_TOKEN_EXPIRE=5m
REFRESH_TOKEN_EXPIRE=7d
```


## 📚 API Documentation

### Base URL

```
https://notes-backend-1-qb3v.onrender.com/api/v1
```

### Endpoints Overview

| Method | Endpoint | Description | Auth Required | Admin Required | Connected to Frontend |
|--------|----------|-------------|---------------|----------------|-----------------------|
| GET | `/` | Health check | ❌ | ❌ | ✅ |
| POST | `/api/v1/user/register` | Register new user | ❌ | ❌ | ✅ |
| POST | `/api/v1/user/login` | Login user | ❌ | ❌ | ✅ |
| GET | `/api/v1/user/get-users-interests` | Get users by interests | ❌ | ❌ | ✅ |
| POST | `/api/v1/post/create` | Create post | ✅ | ❌ | ✅ |
| GET | `/api/v1/post/get-all-post` | Get all posts (public) | ❌ | ❌ | ✅ |
| GET | `/api/v1/post/get-user-post` | Get current user posts | ✅ | ❌ | ✅ |
| GET | `/api/v1/post/get-user-single-post/:postId` | Get single post | ✅ | ❌ | ❌ |
| PATCH | `/api/v1/post/update-user-post/:postId` | Update post | ✅ | ❌ | ❌ |
| DELETE | `/api/v1/post/delete-user-post/:postId` | Delete post | ✅ | ❌ | ❌ |
| POST | `/api/v1/note/create-note` | Create note | ✅ | ❌ | ✅ |
| GET | `/api/v1/note/get-all-note` | Get all notes | ✅ | ✅ | ❌ |
| GET | `/api/v1/note/get-user-note/:userId` | Get user notes | ✅ | ❌ | ✅ |
| GET | `/api/v1/note/get-single-user-note/:noteId` | Get single note | ✅ | ❌ | ✅ |
| PATCH | `/api/v1/note/update-note/:noteId` | Update note | ✅ | ❌ | ✅ |
| DELETE | `/api/v1/note/delete-note/:noteId` | Delete note | ✅ | ❌ | ✅ |
| GET | `/api/v1/admin` | Get all users | ✅ | ✅ | ❌ |
| GET | `/api/v1/admin/:userId` | Get user by ID | ✅ | ✅ | ❌ |
| PATCH | `/api/v1/admin/:userId` | Update user | ✅ | ✅ | ❌ |
| DELETE | `/api/v1/admin/:userId` | Delete user | ✅ | ✅ | ❌ |
| PATCH | `/api/v1/admin/:userId/block` | Block/unblock user | ✅ | ✅ | ❌ |

---

## 🔑 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Tokens are returned upon successful registration or login.

### Registration

**POST** `/api/v1/user/register`

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "interests": ["technology", "sports"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login

**POST** `/api/v1/user/login`

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Using Tokens

Include the access token in requests:

**Cookie (automatic):**
Tokens are set as HTTP-only cookies automatically.

**Authorization Header:**
```
Authorization: Bearer <your_access_token>
```

---

## 📝 Posts

### Create Post

**POST** `/api/v1/post/create` ✅ *Connected to Frontend*

```json
{
  "title": "My First Post",
  "content": "This is the content of my post",
  "tags": ["introduction", "first-post"]
}
```

### Get All Posts (Public)

**GET** `/api/v1/post/get-all-post` ✅ *Connected to Frontend*

Returns all public posts. No authentication required.

### Get Current User Posts

**GET** `/api/v1/post/get-user-post` ✅ *Connected to Frontend*

Returns all posts by the authenticated user. Requires authentication.

### Get Single Post

**GET** `/api/v1/post/get-user-single-post/:postId`

Returns a specific post by its ID.

### Update Post

**PATCH** `/api/v1/post/update-user-post/:postId`

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete Post

**DELETE** `/api/v1/post/delete-user-post/:postId`

---

## 📓 Notes

### Create Note

**POST** `/api/v1/note/create-note` ✅ *Connected to Frontend*

```json
{
  "title": "Important Note",
  "content": "Note content here",
  "category": "work"
}
```

### Get All Notes (Admin Only)

**GET** `/api/v1/note/get-all-note`

Returns all notes from all users. Admin access required.

### Get User Notes

**GET** `/api/v1/note/get-user-note/:userId` ✅ *Connected to Frontend*

Returns all notes for a specific user.

**URL Parameters:**
- `userId`: The ID of the user

### Get Single Note

**GET** `/api/v1/note/get-single-user-note/:noteId` ✅ *Connected to Frontend*

Returns a specific note by its ID.

**URL Parameters:**
- `noteId`: The ID of the note

### Update Note

**PATCH** `/api/v1/note/update-note/:noteId` ✅ *Connected to Frontend*

```json
{
  "title": "Updated Note Title",
  "content": "Updated content"
}
```

**URL Parameters:**
- `noteId`: The ID of the note to update

### Delete Note

**DELETE** `/api/v1/note/delete-note/:noteId` ✅ *Connected to Frontend*

**URL Parameters:**
- `noteId`: The ID of the note to delete

---

## 👑 Admin Endpoints

### Get All Users

**GET** `/api/v1/admin`

Returns a list of all users (admin only).

### Get User by ID

**GET** `/api/v1/admin/:userId`

### Update User

**PATCH** `/api/v1/admin/:userId`

```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "role": "admin"
}
```

### Delete User

**DELETE** `/api/v1/admin/:userId`

### Block/Unblock User

**PATCH** `/api/v1/admin/:userId/block`

```json
{
  "blocked": true
}
```

---

## ⚠️ Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔒 Security Features

- **Helmet**: Sets secure HTTP headers
- **CORS**: Configured for cross-origin requests
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable salt rounds
- **Input Validation**: Request validation middleware
- **Cookie Parser**: Secure cookie handling

---

## 📦 Project Structure

```
notes-api/
├── middleware/
│   ├── checkAuth.middleware.js
│   ├── requireAdmin.middleware.js
│   ├── validateRequest.middleware.js
│   ├── globalError.middleware.js
│   └── globalNotFound.middleware.js
├── modules/
│   ├── home/
│   ├── user/
│   ├── post/
│   ├── note/
│   └── admin/
├── routes/
│   └── service.route.js
├── config/
│   └── envStrings.js
├── app.js
├── server.js
└── .env
```

