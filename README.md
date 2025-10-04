# Polling Application

A full-stack polling application that allows users to vote on polls created by administrators. Built with React and Node.js.

## Features

-  Create and manage polls (Admin)
-  Real-time voting and results
-  JWT-based authentication
-  Public and private poll visibility
-  Time-limited polls with automatic expiration
-  Vote count and percentage statistics

## Tech Stack

**Frontend:** React  
**Backend:** Node.js, NestJS  
**Database:** MongoDB  
**Authentication:** JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd polling-app
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app will start on `http://localhost:3000`

### 3. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the development server:

```bash
npm run start:dev
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "John Doe"
}
```

**Response:**
```json
{
  "accessToken": "jwt_token_here",
  "userId": "user_id",
  "role": "user"
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "accessToken": "jwt_token_here",
  "userId": "user_id",
  "role": "user"
}
```

### Poll Management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/polling` | Admin | Create new poll |
| GET | `/polling` | Authenticated | List accessible polls |
| GET | `/polling/my-polls` | Admin | List polls created by admin |
| GET | `/polling/:id` | Authenticated | Get specific poll |
| PATCH | `/polling/:id` | Admin (creator) | Update active poll |
| DELETE | `/polling/:id` | Admin (creator) | Delete poll |

#### Create Poll
```http
POST /polling
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Favorite Programming Language",
  "description": "Choose your preferred programming language",
  "options": [
    { "text": "JavaScript" },
    { "text": "Python" },
    { "text": "Java" },
    { "text": "TypeScript" }
  ],
  "visibility": "public",
  "duration": 60,
  "allowedUserIds": []
}
```

**Note:** `allowedUserIds` is only required for private polls.

### Voting & Results

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/polling/:id/vote` | Authenticated | Vote on poll |
| GET | `/polling/:id/results` | Authenticated | View poll results |

#### Vote on Poll
```http
POST /polling/:id/vote
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "optionId": "uuid-of-selected-option"
}
```

#### Get Poll Results
```http
GET /polling/:id/results
Authorization: Bearer <token>
```

**Response:**
```json
{
  "pollId": "poll-id",
  "title": "Favorite Programming Language",
  "description": "Choose your preferred programming language",
  "totalVotes": 150,
  "isActive": false,
  "expiresAt": "2024-01-15T14:30:00Z",
  "results": [
    {
      "id": "option-1-uuid",
      "text": "JavaScript",
      "voteCount": 45,
      "percentage": "30.00"
    },
    {
      "id": "option-2-uuid",
      "text": "Python",
      "voteCount": 60,
      "percentage": "40.00"
    }
  ]
}
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **User (default):** Can view and vote on polls
- **Admin:** Can create, update, and delete polls

### Setting Admin Role

To make a user an admin, manually update the `role` field in the user document in MongoDB:


## Poll Visibility

- **Public:** Accessible to all authenticated users
- **Private:** Only accessible to users specified in `allowedUserIds`

## Poll Duration

- Duration is specified in minutes when creating a poll
- Polls automatically become inactive after the duration expires
- Expired polls can still be viewed but cannot accept new votes

## Project Structure

```
polling-app/
├── frontend/           # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── server/            # Node.js backend
    ├── src/
    ├── .env
    └── package.json
```

