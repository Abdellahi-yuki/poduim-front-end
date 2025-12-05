# Gamification Backend API

This is a Node.js (Express) + MySQL backend for a gamification application.

## Features

- **Team Management**: Create, update, delete teams.
- **Member Management**: Manage members within teams.
- **Task Management**: Create, assign, update, and validate tasks.
- **Scoring & Streaks**: Automatic point calculation and streak detection.
- **Leaderboard**: Real-time ranking of teams.
- **Authentication**: JWT-based auth with Admin/Member roles.
- **Real-time Updates**: WebSockets for task validation events.
- **File Uploads**: Proof of task completion (images/PDFs).

## Prerequisites

- Node.js
- MySQL Server

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env` (already created if you used the generator).
   - Update `DB_USER` and `DB_PASSWORD` in `.env` to match your local MySQL credentials.

3. **Initialize Database**
   This script will create the database and tables defined in `src/config/schema.sql`.
   ```bash
   npm run db:init
   ```

4. **Run Server**
   - Development (with nodemon):
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team (Admin)
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team (Admin)
- `DELETE /api/teams/:id` - Delete team (Admin)

### Members
- `GET /api/members?team_id=1` - List members (optional filter by team)
- `POST /api/members` - Add member (Admin)
- `PUT /api/members/:id` - Update member (Admin)
- `DELETE /api/members/:id` - Remove member (Admin)

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task details
- `POST /api/tasks/:id/proof` - Upload proof file
- `PUT /api/tasks/:id/validate` - Validate task (Admin) -> Triggers points & WebSocket

### Leaderboard
- `GET /api/leaderboard?period=daily` - Get leaderboard (daily/weekly/total)

## WebSocket

Connect to `ws://localhost:5000` to receive real-time updates when tasks are validated.
Event format:
```json
{
  "type": "TASK_VALIDATED",
  "taskId": 1,
  "teamId": 1,
  "points": 50,
  "streak": false
}
```

## Testing with Postman

Complete documentation for testing all API endpoints using Postman is available:

### 📚 Documentation Files
- **[QUICK_START_POSTMAN.md](./QUICK_START_POSTMAN.md)** - Quick start guide (5 minutes)
- **[POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md)** - Comprehensive testing guide

### 📦 Import Files
- **[Gamification_API.postman_collection.json](./Gamification_API.postman_collection.json)** - Ready-to-use Postman collection
- **[Gamification_API.postman_environment.json](./Gamification_API.postman_environment.json)** - Environment variables

### 🚀 Quick Start
1. Import the collection and environment files into Postman
2. Select "Gamification API Environment" from the environment dropdown
3. Run "Register Admin" and "Login" requests
4. Start testing other endpoints!

See [QUICK_START_POSTMAN.md](./QUICK_START_POSTMAN.md) for detailed instructions.

## Frontend Integration

Complete documentation for frontend developers to integrate with this API:

### 📚 Documentation for Frontend Team
- **[FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md)** - Complete API integration guide
  - Authentication flow with code examples
  - All API endpoints with request/response formats
  - TypeScript interfaces for data models
  - WebSocket integration for real-time updates
  - Error handling best practices
  - Complete React code examples
  
- **[FRONTEND_QUICK_REFERENCE.md](./FRONTEND_QUICK_REFERENCE.md)** - Quick reference card
  - Common API operations at a glance
  - Quick code snippets
  - HTTP status codes
  - Common errors and solutions

### 🎯 Quick Start for Frontend
1. Review [FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md)
2. Set up axios with base URL and token interceptor
3. Implement authentication (register/login)
4. Start integrating endpoints
5. Add WebSocket for real-time leaderboard updates

### 💡 Key Features for Frontend
- **JWT Authentication** - Secure token-based auth
- **Real-time Updates** - WebSocket events for task validation
- **File Uploads** - Support for proof of task completion
- **Filtering** - Query parameters for tasks and leaderboard
- **Role-based Access** - Admin vs Member permissions
