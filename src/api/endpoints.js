// API Endpoints Configuration
// Easy to update when migrating to real API

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://podium-7y67.onrender.com';

export const ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        USERS: '/api/auth/users'
    },

    // Teams
    TEAMS: {
        LIST: '/api/teams',
        GET: (id) => `/api/teams/${id}`,
        CREATE: '/api/teams',
        UPDATE: (id) => `/api/teams/${id}`,
        DELETE: (id) => `/api/teams/${id}`
    },

    // Members
    MEMBERS: {
        LIST: '/api/members',
        GET: (id) => `/api/members/${id}`,
        CREATE: '/api/members',
        UPDATE: (id) => `/api/members/${id}`,
        DELETE: (id) => `/api/members/${id}`
    },

    // Tasks
    TASKS: {
        LIST: '/api/tasks',
        GET: (id) => `/api/tasks/${id}`,
        CREATE: '/api/tasks',
        UPDATE: (id) => `/api/tasks/${id}`,
        DELETE: (id) => `/api/tasks/${id}`,
        UPLOAD_PROOF: (id) => `/api/tasks/${id}/proof`,
        VALIDATE: (id) => `/api/tasks/${id}/validate`
    },

    // Leaderboard
    LEADERBOARD: {
        GET: '/api/leaderboard'
    }
};
