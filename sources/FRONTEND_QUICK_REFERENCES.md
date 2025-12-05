# Frontend Quick Reference Card

Quick reference for common API operations. See [FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md) for complete details.

## 🔐 Authentication

### Register
```javascript
POST /api/auth/register
Body: { email, password, role }
Response: { id, email, role, token }
```

### Login
```javascript
POST /api/auth/login
Body: { email, password }
Response: { id, email, role, token }
```

### Store Token
```javascript
localStorage.setItem('authToken', token);
```

### Use Token
```javascript
headers: { 'Authorization': `Bearer ${token}` }
```

---

## 👥 Teams

| Method | Endpoint | Auth | Admin | Body |
|--------|----------|------|-------|------|
| GET | `/api/teams` | ✅ | ❌ | - |
| GET | `/api/teams/:id` | ✅ | ❌ | - |
| POST | `/api/teams` | ✅ | ✅ | `{ name, color }` |
| PUT | `/api/teams/:id` | ✅ | ✅ | `{ name, color }` |
| DELETE | `/api/teams/:id` | ✅ | ✅ | - |

---

## 🧑‍🤝‍🧑 Members

| Method | Endpoint | Auth | Admin | Body |
|--------|----------|------|-------|------|
| GET | `/api/members` | ✅ | ❌ | - |
| GET | `/api/members?team_id=1` | ✅ | ❌ | - |
| POST | `/api/members` | ✅ | ✅ | `{ team_id, user_id, name, role, avatar_url }` |
| PUT | `/api/members/:id` | ✅ | ✅ | `{ name, role, avatar_url }` |
| DELETE | `/api/members/:id` | ✅ | ✅ | - |

---

## ✅ Tasks

| Method | Endpoint | Auth | Admin | Body |
|--------|----------|------|-------|------|
| GET | `/api/tasks` | ✅ | ❌ | - |
| GET | `/api/tasks?team_id=1&status=todo` | ✅ | ❌ | - |
| POST | `/api/tasks` | ✅ | ✅ | `{ team_id, member_id, title, description, points, difficulty, priority, deadline }` |
| PUT | `/api/tasks/:id` | ✅ | ❌ | `{ status, title, description, priority }` |
| POST | `/api/tasks/:id/proof` | ✅ | ❌ | FormData with 'proof' file |
| PUT | `/api/tasks/:id/validate` | ✅ | ✅ | - |

### Task Filters
```javascript
?team_id=1
?member_id=1
?status=todo|doing|done|validated
?difficulty=easy|medium|hard
?priority=low|medium|high
```

### Task Status Flow
```
todo → doing → done → validated
```

---

## 🏆 Leaderboard

| Method | Endpoint | Auth | Admin | Query |
|--------|----------|------|-------|-------|
| GET | `/api/leaderboard` | ✅ | ❌ | `?period=daily\|weekly\|total` |

---

## 🔌 WebSocket

### Connect
```javascript
const ws = new WebSocket('ws://localhost:5000');
```

### Listen for Events
```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // { type: 'TASK_VALIDATED', taskId, teamId, points, streak }
};
```

---

## 📊 Data Models (TypeScript)

```typescript
interface User {
  id: number;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

interface Member {
  id: number;
  team_id: number;
  user_id: number;
  name: string;
  role: string;
  avatar_url: string | null;
}

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

interface LeaderboardEntry {
  team_id: number;
  team_name: string;
  team_color: string;
  total_points: number;
  rank: number;
}
```

---

## ⚡ Quick Code Snippets

### Axios Setup
```javascript
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

// Auto-include token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Fetch Teams
```javascript
const teams = await axios.get('/api/teams');
```

### Create Task
```javascript
const task = await axios.post('/api/tasks', {
  team_id: 1,
  member_id: 1,
  title: 'Task Title',
  description: 'Task description',
  points: 50,
  difficulty: 'medium',
  priority: 'high',
  deadline: '2025-12-15T23:59:59Z'
});
```

### Upload Proof
```javascript
const formData = new FormData();
formData.append('proof', fileInput.files[0]);

await axios.post(`/api/tasks/${taskId}/proof`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### Get Leaderboard
```javascript
const leaderboard = await axios.get('/api/leaderboard?period=daily');
```

---

## 🚨 HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Check request data |
| 401 | Unauthorized | Login required |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Contact backend team |

---

## ⚠️ Common Errors

### "No token, authorization denied"
```javascript
// Add token to headers
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### "Access denied. Admin only"
```javascript
// Check user role before showing admin features
if (user.role === 'admin') {
  // Show admin features
}
```

### File upload failing
```javascript
// Use FormData
const formData = new FormData();
formData.append('proof', file);
// Set correct content type
headers: { 'Content-Type': 'multipart/form-data' }
```

---

## 💡 Best Practices

✅ **DO:**
- Store tokens securely
- Handle errors gracefully
- Show loading states
- Validate inputs client-side
- Use environment variables for URLs
- Clean up WebSocket connections
- Implement retry logic for failed requests

❌ **DON'T:**
- Expose tokens in URLs or logs
- Make excessive API calls
- Ignore error responses
- Trust user input without validation
- Hardcode API URLs
- Leave WebSocket connections open

---

## 🎯 Points System

| Difficulty | Base Points | With Streak Bonus |
|------------|-------------|-------------------|
| Easy | 20 | 30 (+50%) |
| Medium | 50 | 75 (+50%) |
| Hard | 100 | 150 (+50%) |

**Streak:** Tasks validated within 24 hours of previous validation

---

## 📱 React Hooks Example

```javascript
// Custom hook for API calls
function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(endpoint)
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading, error };
}

// Usage
function Teams() {
  const { data: teams, loading, error } = useApi('/api/teams');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{teams.map(team => ...)}</div>;
}
```

---

## 🔗 Resources

- **Full Documentation:** [FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md)
- **Testing Guide:** [POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md)
- **Sample Data:** [SAMPLE_TEST_DATA.md](./SAMPLE_TEST_DATA.md)
- **Workflow Diagrams:** [API_WORKFLOW_DIAGRAM.md](./API_WORKFLOW_DIAGRAM.md)

---

## 🌐 URLs

| Environment | API URL | WebSocket URL |
|-------------|---------|---------------|
| Development | `http://localhost:5000` | `ws://localhost:5000` |
| Production | `https://api.yourapp.com` | `wss://api.yourapp.com` |

---

**Print this page for quick reference! 📄**
