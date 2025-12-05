# Podium - Team Gamification Platform

A full-stack web application for team management and gamification with real-time leaderboards, task tracking, and member management.

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with React Router
- **Styling**: Vanilla CSS with CSS variables for theming
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Deployment**: Vercel (https://poduim-front-end.vercel.app)

### Backend
- **Runtime**: Node.js with Express
- **Database**: MySQL
- **Authentication**: JWT-based with role-based access control (Admin/Member)
- **Real-time**: WebSocket support for live updates
- **File Uploads**: Multer for task proof uploads
- **Deployment**: Render.com (https://podium-7y67.onrender.com)

## 🚀 Features

### Team Management
- Create, update, and delete teams
- Assign custom colors to teams
- View team members and statistics

### Member Management
- Add members to teams with user accounts
- Assign roles (Leader/Member) within teams
- Link members to user accounts for authentication
- Display member avatars and information

### Task Management
- Create tasks with difficulty levels (Easy/Medium/Hard)
- Set priorities (Low/Medium/High)
- Assign tasks to team members
- Track task status (Todo/Doing/Done/Validated)
- Upload proof of completion
- Admin validation with automatic point calculation

### Scoring & Leaderboard
- Automatic point calculation based on task difficulty
- Bonus points for early completion (before deadline)
- Streak detection for consecutive completions
- Real-time leaderboard with filtering (Daily/Weekly/Total)
- Points history tracking

### Authentication & Authorization
- JWT-based authentication
- Two roles: Admin and Member
- Protected routes and API endpoints
- Admin-only features:
  - User creation
  - Team management
  - Task validation
  - Member assignment

### Real-time Updates
- WebSocket integration for live leaderboard updates
- Instant notifications when tasks are validated
- Live score updates across all connected clients

## 📁 Project Structure

```
podium/
├── src/                          # Frontend source code
│   ├── api/                      # API configuration
│   │   ├── apiService.js        # API service layer
│   │   ├── axiosConfig.js       # Axios configuration with interceptors
│   │   └── endpoints.js         # API endpoint definitions
│   ├── components/              # React components
│   │   ├── Auth/               # Authentication components
│   │   │   ├── Login.jsx
│   │   │   ├── CreateUser.jsx  # Admin-only user creation
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── Dashboard/          # Main dashboard
│   │   ├── Leaderboard/        # Leaderboard view
│   │   ├── Tasks/              # Task management
│   │   ├── Teams/              # Team management
│   │   └── shared/             # Shared components
│   │       ├── Navigation.jsx  # Responsive navigation bar
│   │       ├── LoadingSpinner.jsx
│   │       └── ConfirmationModal.jsx
│   ├── context/                # React context
│   │   └── ThemeContext.js    # Dark mode theme provider
│   ├── styles/                 # Global styles
│   │   └── index.css          # Main stylesheet with CSS variables
│   └── App.js                 # Main application component
│
├── backend/podium/             # Backend source code
│   └── src/
│       ├── config/            # Configuration
│       │   ├── db.js         # MySQL connection
│       │   ├── schema.sql    # Database schema
│       │   └── socket.js     # WebSocket configuration
│       ├── controllers/       # Route controllers
│       │   ├── authController.js
│       │   ├── teamController.js
│       │   ├── memberController.js
│       │   ├── taskController.js
│       │   └── leaderboardController.js
│       ├── services/          # Business logic
│       │   ├── authService.js
│       │   ├── teamService.js
│       │   ├── memberService.js
│       │   ├── taskService.js
│       │   ├── scoringService.js
│       │   └── leaderboardService.js
│       ├── middleware/        # Express middleware
│       │   └── authMiddleware.js  # JWT verification
│       ├── routes/            # API routes
│       │   ├── authRoutes.js
│       │   ├── teamRoutes.js
│       │   ├── memberRoutes.js
│       │   ├── taskRoutes.js
│       │   └── leaderboardRoutes.js
│       └── app.js            # Express app configuration
│
└── sources/                   # Documentation
    ├── README.md
    ├── FRONTEND_API_DOCUMENTATION.md
    └── POSTMAN_TESTING_GUIDE.md
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend/podium
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in `backend/podium/`:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=gamification_db
   
   # JWT Secret (use a strong random string in production)
   JWT_SECRET=your_jwt_secret_key
   
   # Uploads
   UPLOAD_PATH=src/uploads
   ```

4. **Initialize Database**
   ```bash
   npm run db:init
   ```
   This will create the database and all required tables.

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:5000`

## 🌐 Production Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel at: https://poduim-front-end.vercel.app

**Environment Variables on Vercel:**
```
REACT_APP_API_URL=https://podium-7y67.onrender.com
```

### Backend (Render.com)
The backend is deployed on Render.com at: https://podium-7y67.onrender.com

**Required Environment Variables on Render:**
- `DB_HOST` - MySQL database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (e.g., `gamification_db`)
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Port number (default: 5000)
- `NODE_ENV` - Set to `production`

**Important Notes:**
- Ensure your MySQL database is accessible from Render.com
- The backend must support HTTPS (Render provides this automatically)
- WebSocket connections use WSS (secure WebSocket) in production

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (returns user data, no auto-login)
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/users` - Get all users (Admin only)

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team (Admin only)
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team (Admin only)
- `DELETE /api/teams/:id` - Delete team (Admin only)

### Members
- `GET /api/members?team_id=1` - List members (optional filter by team)
- `POST /api/members` - Add member to team (Admin only)
- `PUT /api/members/:id` - Update member (Admin only)
- `DELETE /api/members/:id` - Remove member (Admin only)

### Tasks
- `GET /api/tasks` - List tasks (supports filtering)
- `POST /api/tasks` - Create task (Admin only)
- `PUT /api/tasks/:id` - Update task (auto-assigns member when status changes to 'doing')
- `POST /api/tasks/:id/proof` - Upload proof file
- `PUT /api/tasks/:id/validate` - Validate task and award points (Admin only)

### Leaderboard
- `GET /api/leaderboard?period=total` - Get leaderboard
  - Periods: `daily`, `weekly`, `total`

## 🔐 Authentication Flow

1. **User Registration** (Admin only)
   - Admin creates user account via `/create-user` page
   - User receives email and password
   - No auto-login after registration

2. **User Login**
   - User logs in with email and password
   - Receives JWT token
   - Token stored in localStorage
   - Token automatically included in all API requests

3. **Protected Routes**
   - Frontend: `ProtectedRoute` component checks authentication
   - Admin routes: `AdminRoute` component checks for admin role
   - Backend: `authMiddleware` verifies JWT token

## 🎨 UI Features

### Responsive Design
- Mobile-first approach with breakpoints at 768px
- Hamburger menu for mobile navigation
- Collapsible navigation links
- Simplified profile display on mobile

### Dark Mode
- Theme toggle in profile menu
- Persistent theme selection (localStorage)
- CSS variables for easy theme switching

### Real-time Updates
- WebSocket connection for live leaderboard
- Automatic score updates when tasks are validated
- Visual feedback for all user actions

## 🐛 Common Issues & Solutions

### Mixed Content Error
**Error:** "This request has been blocked; the content must be served over HTTPS"

**Solution:** Ensure the frontend uses HTTPS URLs for the backend:
```javascript
// src/api/endpoints.js
export const BASE_URL = 'https://podium-7y67.onrender.com';
```

### 500 Internal Server Error
**Possible Causes:**
1. Database connection failure - Check DB credentials
2. Missing environment variables - Verify all required env vars are set
3. Database schema mismatch - Run `npm run db:init` to recreate tables
4. Backend code error - Check Render.com logs for stack trace

### User Dropdown Empty
**Cause:** Missing `getAllUsers` function in backend `authService.js`

**Solution:** Ensure the function exists and is exported:
```javascript
const getAllUsers = async () => {
    const [users] = await db.query('SELECT id, email, role FROM users');
    return users;
};
module.exports = { register, login, getAllUsers };
```

## 📊 Database Schema

### Tables
- `users` - User accounts with authentication
- `teams` - Team information
- `members` - Team members (links users to teams)
- `tasks` - Task management
- `points_log` - Points history and tracking

### Key Relationships
- Users → Members (one-to-one via `user_id`)
- Teams → Members (one-to-many)
- Teams → Tasks (one-to-many)
- Members → Tasks (one-to-many, optional assignment)

## 🧪 Testing

### Backend Tests
Test scripts are available in `backend/podium/scripts/`:
- `test_validation.js` - Tests task validation flow
- `test_team_deletion.js` - Tests team deletion with cascading

Run tests:
```bash
cd backend/podium
node scripts/test_validation.js
```

### Manual Testing
Use the provided Postman collection in `sources/` directory for comprehensive API testing.

## 📝 License

This project is private and proprietary.

## 👥 Team

Developed for team gamification and collaboration tracking.
