# Frontend API Integration Guide

Complete documentation for frontend developers to integrate with the Gamification Backend API.

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [WebSocket Integration](#websocket-integration)
7. [Error Handling](#error-handling)
8. [Code Examples](#code-examples)
9. [Best Practices](#best-practices)

---

## Overview

### Base URL
```
Development: http://localhost:5000
Production: [Your production URL]
```

### API Version
Current version: `v1`

### Content Type
All requests and responses use `application/json` except file uploads which use `multipart/form-data`.

### Authentication
JWT (JSON Web Token) based authentication. Token must be included in the `Authorization` header for protected routes.

---

## Getting Started

### Prerequisites
- Node.js environment (for examples)
- HTTP client library (axios, fetch, etc.)
- WebSocket client (for real-time updates)

### Quick Setup

#### Using Axios (Recommended)
```bash
npm install axios
```

#### Using Fetch (Built-in)
No installation needed - available in modern browsers and Node.js 18+

---

## Authentication

### Registration

**Endpoint:** `POST /api/auth/register`

**Request:**
```javascript
const response = await axios.post('http://localhost:5000/api/auth/register', {
  email: 'user@example.com',
  password: 'securePassword123',
  role: 'member' // or 'admin'
});
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "member",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**
- Email must be valid format
- Password must be at least 6 characters
- Role is optional (defaults to 'member')

---

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```javascript
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'user@example.com',
  password: 'securePassword123'
});
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "member",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

---

### Token Management

#### Storing the Token
```javascript
// Store in localStorage
localStorage.setItem('authToken', response.data.token);

// Store in sessionStorage (more secure, clears on tab close)
sessionStorage.setItem('authToken', response.data.token);

// Store in memory (most secure, but lost on refresh)
let authToken = response.data.token;
```

#### Using the Token
```javascript
// With Axios
const config = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
};

const response = await axios.get('http://localhost:5000/api/teams', config);
```

#### Axios Interceptor (Recommended)
```javascript
// Set up once in your app
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## API Endpoints

### Teams

#### Get All Teams
**Endpoint:** `GET /api/teams`  
**Auth Required:** Yes  
**Admin Only:** No

```javascript
const teams = await axios.get('/api/teams');
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Alpha Team",
    "color": "#FF5733",
    "created_at": "2025-12-04T20:00:00.000Z"
  }
]
```

---

#### Get Team by ID
**Endpoint:** `GET /api/teams/:id`  
**Auth Required:** Yes  
**Admin Only:** No

```javascript
const team = await axios.get(`/api/teams/${teamId}`);
```

**Response:**
```json
{
  "id": 1,
  "name": "Alpha Team",
  "color": "#FF5733",
  "created_at": "2025-12-04T20:00:00.000Z"
}
```

---

#### Create Team
**Endpoint:** `POST /api/teams`  
**Auth Required:** Yes  
**Admin Only:** Yes ⚠️

```javascript
const newTeam = await axios.post('/api/teams', {
  name: 'Beta Team',
  color: '#3498DB'
});
```

**Request Body:**
```typescript
{
  name: string;      // Required
  color?: string;    // Optional, defaults to '#000000'
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Beta Team",
  "color": "#3498DB",
  "created_at": "2025-12-04T20:05:00.000Z"
}
```

---

#### Update Team
**Endpoint:** `PUT /api/teams/:id`  
**Auth Required:** Yes  
**Admin Only:** Yes ⚠️

```javascript
const updatedTeam = await axios.put(`/api/teams/${teamId}`, {
  name: 'Beta Team Updated',
  color: '#2980B9'
});
```

---

#### Delete Team
**Endpoint:** `DELETE /api/teams/:id`  
**Auth Required:** Yes  
**Admin Only:** Yes ⚠️

```javascript
await axios.delete(`/api/teams/${teamId}`);
```

**Response:**
```json
{
  "message": "Team removed"
}
```

---

### Members

#### Get All Members
**Endpoint:** `GET /api/members`  
**Auth Required:** Yes  
**Admin Only:** No

```javascript
// Get all members
const members = await axios.get('/api/members');

// Filter by team
const teamMembers = await axios.get(`/api/members?team_id=${teamId}`);
```

**Response:**
```json
[
  {
    "id": 1,
    "team_id": 1,
    "user_id": 2,
    "name": "John Doe",
    "role": "leader",
    "avatar_url": "https://i.pravatar.cc/150?img=1"
  }
]
```

---

#### Add Member
**Endpoint:** `POST /api/members`  
**Auth Required:** Yes  
**Admin Only:** Yes ⚠️

```javascript
const newMember = await axios.post('/api/members', {
  team_id: 1,
  user_id: 2,
  name: 'John Doe',
  role: 'member',
  avatar_url: 'https://example.com/avatar.jpg'
});
```

**Request Body:**
```typescript
{
  team_id: number;      // Required
  user_id: number;      // Required - must exist in users table
  name: string;         // Required
  role?: string;        // Optional, defaults to 'member'
  avatar_url?: string;  // Optional
}
```

---

#### Update Member
**Endpoint:** `PUT /api/members/:id`  
**Auth Required:** Yes  
**Admin Only:** Yes ⚠️

```javascript
const updatedMember = await axios.put(`/api/members/${memberId}`, {
  name: 'John Doe Updated',
  role: 'leader',
  avatar_url: 'https://example.com/new-avatar.jpg'
});
```

---

#### Delete Member
**Endpoint:** `DELETE /api/members/:id`  
**Auth Required:** Yes  
**Admin Only:** Yes ⚠️

```javascript
await axios.delete(`/api/members/${memberId}`);
```

---

### Tasks

#### Get All Tasks
**Endpoint:** `GET /api/tasks`  
**Auth Required:** Yes  
**Admin Only:** No

```javascript
// Get all tasks
const tasks = await axios.get('/api/tasks');

// Filter by team
const teamTasks = await axios.get(`/api/tasks?team_id=${teamId}`);

// Filter by status
const todoTasks = await axios.get('/api/tasks?status=todo');

// Multiple filters
const filteredTasks = await axios.get(
  `/api/tasks?team_id=${teamId}&status=doing&difficulty=hard`
);
```

**Query Parameters:**
- `team_id` - Filter by team
- `member_id` - Filter by assigned member
- `status` - Filter by status (todo, doing, done, validated)
- `difficulty` - Filter by difficulty (easy, medium, hard)
- `priority` - Filter by priority (low, medium, high)

**Response:**
```json
[
  {
    "id": 1,
    "team_id": 1,
    "member_id": 1,
    "title": "Complete Project Documentation",
    "description": "Write comprehensive documentation",
    "points": 50,
    "difficulty": "medium",
    "priority": "high",
    "status": "todo",
    "deadline": "2025-12-10T23:59:59.000Z",
    "proof_url": null,
    "created_at": "2025-12-04T20:00:00.000Z",
    "updated_at": "2025-12-04T20:00:00.000Z",
    "validated_at": null
  }
]
```

---

#### Create Task
**Endpoint:** `POST /api/tasks`  
**Auth Required:** Yes  
**Admin Only:** Yes ⚠️

```javascript
const newTask = await axios.post('/api/tasks', {
  team_id: 1,
  member_id: 1,
  title: 'Implement Feature X',
  description: 'Build the new feature as per requirements',
  points: 50,
  difficulty: 'medium',
  priority: 'high',
  deadline: '2025-12-15T23:59:59Z'
});
```

**Request Body:**
```typescript
{
  team_id: number;                           // Required
  member_id?: number;                        // Optional - assigned member
  title: string;                             // Required
  description?: string;                      // Optional
  points?: number;                           // Optional, defaults to 0
  difficulty?: 'easy' | 'medium' | 'hard';  // Optional, defaults to 'medium'
  priority?: 'low' | 'medium' | 'high';     // Optional, defaults to 'medium'
  deadline?: string;                         // Optional - ISO 8601 format
}
```

**Point Guidelines:**
- Easy tasks: 20 points
- Medium tasks: 50 points
- Hard tasks: 100 points

---

#### Update Task
**Endpoint:** `PUT /api/tasks/:id`  
**Auth Required:** Yes  
**Admin Only:** No (Members can update their own tasks)

```javascript
// Update status
const updatedTask = await axios.put(`/api/tasks/${taskId}`, {
  status: 'doing'
});

// Update multiple fields
const updatedTask = await axios.put(`/api/tasks/${taskId}`, {
  title: 'Updated Title',
  description: 'Updated description',
  priority: 'high',
  status: 'done'
});
```

**Status Flow:**
```
todo → doing → done → validated (by admin)
```

---

#### Upload Task Proof
**Endpoint:** `POST /api/tasks/:id/proof`  
**Auth Required:** Yes  
**Admin Only:** No

```javascript
// Using FormData
const formData = new FormData();
formData.append('proof', fileInput.files[0]);

const response = await axios.post(
  `/api/tasks/${taskId}/proof`,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
);
```

**Supported File Types:**
- Images: PNG, JPG, JPEG, GIF
- Documents: PDF

**Response:**
```json
{
  "id": 1,
  "team_id": 1,
  "member_id": 1,
  "title": "Complete Project Documentation",
  "proof_url": "/uploads/proof-1733342400000-123456789.jpg",
  "status": "done",
  ...
}
```

---

#### Validate Task
**Endpoint:** `PUT /api/tasks/:id/validate`  
**Auth Required:** Yes  
**Admin Only:** Yes ⚠️

```javascript
const result = await axios.put(`/api/tasks/${taskId}/validate`);
```

**Response:**
```json
{
  "task": {
    "id": 1,
    "status": "validated",
    "validated_at": "2025-12-04T20:15:00.000Z",
    ...
  },
  "points": 50,
  "streak": false,
  "streakBonus": 0
}
```

**With Streak Bonus:**
```json
{
  "task": { ... },
  "points": 75,
  "streak": true,
  "streakBonus": 25
}
```

**Note:** Validating a task:
- Changes status to "validated"
- Awards points to the team
- May award 50% bonus for streaks (tasks validated within 24 hours)
- Triggers WebSocket event for real-time updates

---

### Leaderboard

#### Get Leaderboard
**Endpoint:** `GET /api/leaderboard`  
**Auth Required:** Yes  
**Admin Only:** No

```javascript
// Daily leaderboard
const dailyLeaderboard = await axios.get('/api/leaderboard?period=daily');

// Weekly leaderboard
const weeklyLeaderboard = await axios.get('/api/leaderboard?period=weekly');

// Total (all-time) leaderboard
const totalLeaderboard = await axios.get('/api/leaderboard?period=total');

// Default (no parameter = total)
const leaderboard = await axios.get('/api/leaderboard');
```

**Query Parameters:**
- `period` - Filter by time period: `daily`, `weekly`, or `total`

**Response:**
```json
[
  {
    "team_id": 1,
    "team_name": "Alpha Team",
    "team_color": "#FF5733",
    "total_points": 125,
    "rank": 1
  },
  {
    "team_id": 2,
    "team_name": "Beta Team",
    "team_color": "#3498DB",
    "total_points": 70,
    "rank": 2
  }
]
```

**Note:** Teams are automatically ranked by `total_points` in descending order.

---

## Data Models

### TypeScript Interfaces

```typescript
// User
interface User {
  id: number;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
}

// Team
interface Team {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

// Member
interface Member {
  id: number;
  team_id: number;
  user_id: number;
  name: string;
  role: string;
  avatar_url: string | null;
}

// Task
interface Task {
  id: number;
  team_id: number;
  member_id: number | null;
  title: string;
  description: string | null;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done' | 'validated';
  deadline: string | null;
  proof_url: string | null;
  created_at: string;
  updated_at: string;
  validated_at: string | null;
}

// Leaderboard Entry
interface LeaderboardEntry {
  team_id: number;
  team_name: string;
  team_color: string;
  total_points: number;
  rank: number;
}

// Auth Response
interface AuthResponse {
  id: number;
  email: string;
  role: 'admin' | 'member';
  token: string;
}

// Task Validation Response
interface TaskValidationResponse {
  task: Task;
  points: number;
  streak: boolean;
  streakBonus: number;
}
```

---

## WebSocket Integration

### Connecting to WebSocket

```javascript
// Vanilla JavaScript
const ws = new WebSocket('ws://localhost:5000');

ws.onopen = () => {
  console.log('WebSocket connected');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleWebSocketEvent(data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket disconnected');
};
```

### React Example with useEffect

```javascript
import { useEffect, useState } from 'react';

function useWebSocket() {
  const [ws, setWs] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:5000');

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastEvent(data);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  return { ws, lastEvent };
}

// Usage in component
function Dashboard() {
  const { lastEvent } = useWebSocket();

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'TASK_VALIDATED') {
      // Refresh leaderboard or show notification
      console.log(`Task ${lastEvent.taskId} validated! +${lastEvent.points} points`);
      refreshLeaderboard();
    }
  }, [lastEvent]);

  return <div>Dashboard</div>;
}
```

### WebSocket Event Types

#### TASK_VALIDATED Event
```json
{
  "type": "TASK_VALIDATED",
  "taskId": 1,
  "teamId": 1,
  "points": 50,
  "streak": false
}
```

**When to expect:**
- Triggered when an admin validates a task
- Contains task ID, team ID, points awarded, and streak status

**Recommended Actions:**
- Refresh leaderboard
- Show notification to team members
- Update task list
- Play celebration animation if it's your team

---

## Error Handling

### Error Response Format

```json
{
  "message": "Error description"
}
```

### Validation Errors

```json
{
  "errors": [
    {
      "msg": "Please include a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid data, validation errors |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions (not admin) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

### Error Handling Best Practices

```javascript
// Using try-catch with async/await
async function fetchTeams() {
  try {
    const response = await axios.get('/api/teams');
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Show permission error
          alert('You do not have permission to perform this action');
          break;
        case 404:
          // Show not found error
          console.error('Resource not found');
          break;
        default:
          // Show generic error
          console.error('An error occurred:', error.response.data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    throw error;
  }
}
```

### Axios Interceptor for Global Error Handling

```javascript
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Code Examples

### Complete React Authentication Example

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Create Auth Context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Optionally verify token is still valid
      // by making a request to a protected endpoint
    }
    setLoading(false);
  }, []);

  const register = async (email, password, role = 'member') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email,
        password,
        role
      });
      
      const { token, ...userData } = response.data;
      
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, ...userData } = response.data;
      
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Using the Auth Context

```javascript
import { useAuth } from './AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Teams Management Example

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/teams');
      setTeams(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (name, color) => {
    try {
      const response = await axios.post('/api/teams', { name, color });
      setTeams([...teams, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateTeam = async (id, updates) => {
    try {
      const response = await axios.put(`/api/teams/${id}`, updates);
      setTeams(teams.map(team => team.id === id ? response.data : team));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteTeam = async (id) => {
    try {
      await axios.delete(`/api/teams/${id}`);
      setTeams(teams.filter(team => team.id !== id));
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Teams</h1>
      <div className="teams-grid">
        {teams.map(team => (
          <div key={team.id} className="team-card">
            <div 
              className="team-color" 
              style={{ backgroundColor: team.color }}
            />
            <h3>{team.name}</h3>
            <button onClick={() => deleteTeam(team.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Task Management with File Upload

```javascript
import { useState } from 'react';
import axios from 'axios';

function TaskProofUpload({ taskId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Please select a PNG, JPG, or PDF file');
      return;
    }
    
    // Validate file size (e.g., max 5MB)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('proof', file);

      const response = await axios.post(
        `/api/tasks/${taskId}/proof`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      );

      onUploadSuccess(response.data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="proof-upload">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        disabled={uploading}
      />
      {file && <p>Selected: {file.name}</p>}
      {error && <p className="error">{error}</p>}
      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Proof'}
      </button>
    </div>
  );
}
```

### Leaderboard with Real-time Updates

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('total');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  useEffect(() => {
    // WebSocket for real-time updates
    const ws = new WebSocket('ws://localhost:5000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'TASK_VALIDATED') {
        // Refresh leaderboard when a task is validated
        fetchLeaderboard();
        
        // Optional: Show notification
        showNotification(
          `Team earned ${data.points} points!`,
          data.streak ? '🔥 Streak bonus!' : ''
        );
      }
    };

    return () => ws.close();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/leaderboard?period=${period}`);
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (title, message) => {
    // Implement your notification logic
    console.log(title, message);
  };

  return (
    <div className="leaderboard">
      <div className="period-selector">
        <button onClick={() => setPeriod('daily')}>Daily</button>
        <button onClick={() => setPeriod('weekly')}>Weekly</button>
        <button onClick={() => setPeriod('total')}>All Time</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <div key={entry.team_id} className="leaderboard-entry">
              <div className="rank">#{entry.rank}</div>
              <div 
                className="team-color" 
                style={{ backgroundColor: entry.team_color }}
              />
              <div className="team-name">{entry.team_name}</div>
              <div className="points">{entry.total_points} pts</div>
              {index === 0 && <span className="trophy">🏆</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Token Management
- ✅ Store tokens securely (prefer sessionStorage over localStorage)
- ✅ Clear tokens on logout
- ✅ Handle token expiration gracefully
- ✅ Use axios interceptors for automatic token inclusion
- ❌ Don't expose tokens in URLs or logs

### 2. Error Handling
- ✅ Always use try-catch with async/await
- ✅ Provide user-friendly error messages
- ✅ Log errors for debugging
- ✅ Handle network errors separately
- ✅ Implement global error handlers

### 3. API Calls
- ✅ Use environment variables for API URLs
- ✅ Implement loading states
- ✅ Cache data when appropriate
- ✅ Debounce search/filter inputs
- ✅ Cancel pending requests on component unmount

### 4. WebSocket
- ✅ Reconnect on connection loss
- ✅ Clean up connections on unmount
- ✅ Handle connection errors gracefully
- ✅ Throttle rapid updates to prevent UI lag

### 5. File Uploads
- ✅ Validate file type and size on client
- ✅ Show upload progress
- ✅ Handle upload errors
- ✅ Provide preview before upload
- ✅ Compress images if needed

### 6. Performance
- ✅ Implement pagination for large lists
- ✅ Use React.memo for expensive components
- ✅ Debounce API calls for search/filter
- ✅ Lazy load images
- ✅ Cache API responses when appropriate

### 7. Security
- ✅ Validate all user inputs
- ✅ Sanitize data before rendering
- ✅ Use HTTPS in production
- ✅ Implement CORS properly
- ✅ Never expose sensitive data in client code

---

## Environment Configuration

### Development (.env.development)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```

### Production (.env.production)
```bash
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_WS_URL=wss://api.yourapp.com
```

### Usage in Code
```javascript
const API_URL = process.env.REACT_APP_API_URL;
const WS_URL = process.env.REACT_APP_WS_URL;

axios.defaults.baseURL = API_URL;
const ws = new WebSocket(WS_URL);
```

---

## Testing API Integration

### Using Postman
See [POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md) for detailed testing instructions.

### Quick Test Checklist
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Token is stored and used correctly
- [ ] Can fetch teams/members/tasks
- [ ] Can create resources (if admin)
- [ ] Can update task status
- [ ] Can upload files
- [ ] WebSocket receives events
- [ ] Leaderboard updates in real-time
- [ ] Error handling works correctly
- [ ] Logout clears token

---

## Common Issues & Solutions

### Issue: "No token, authorization denied"
**Solution:** Ensure token is included in Authorization header
```javascript
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Issue: "Access denied. Admin only"
**Solution:** This endpoint requires admin role. Check user role before showing admin features.

### Issue: CORS errors
**Solution:** Backend should have CORS configured. Contact backend team if issues persist.

### Issue: WebSocket not connecting
**Solution:** 
- Check WebSocket URL (ws:// not wss:// in development)
- Ensure backend server is running
- Check firewall/proxy settings

### Issue: File upload failing
**Solution:**
- Use FormData for file uploads
- Set Content-Type to multipart/form-data
- Check file size and type restrictions

---

## API Rate Limiting

Currently, there are no rate limits implemented. However, best practices:
- Don't make excessive API calls
- Implement debouncing for search/filter
- Cache responses when appropriate
- Use WebSocket for real-time data instead of polling

---

## Support & Resources

### Documentation Files
- [POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md) - Complete API testing guide
- [SAMPLE_TEST_DATA.md](./SAMPLE_TEST_DATA.md) - Sample data for testing
- [API_WORKFLOW_DIAGRAM.md](./API_WORKFLOW_DIAGRAM.md) - Visual workflow diagrams

### Need Help?
- Check the error message and status code
- Review this documentation
- Test the endpoint in Postman first
- Contact the backend team

---

## Changelog

### Version 1.0.0 (2025-12-04)
- Initial API release
- Authentication endpoints
- Team management
- Member management
- Task management
- Leaderboard
- WebSocket support

---

**Happy Coding! 🚀**
