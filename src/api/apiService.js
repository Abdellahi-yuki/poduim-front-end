// API Service Layer
import api from './axiosConfig';
import { ENDPOINTS } from './endpoints';

// ============================================
// AUTHENTICATION
// ============================================

export const authService = {
    // Register new user
    register: async (email, password, role = 'member') => {
        const response = await api.post(ENDPOINTS.AUTH.REGISTER, { email, password, role });

        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: response.data.id,
                email: response.data.email,
                role: response.data.role
            }));
            return response.data;
        } else {
            // If API doesn't return token on register, login automatically
            return authService.login(email, password);
        }
    },

    // Login
    login: async (email, password) => {
        const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });

        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: response.data.id,
                email: response.data.email,
                role: response.data.role
            }));
        }

        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    }
};

// ============================================
// TEAMS
// ============================================

export const teamsService = {
    // Get all teams
    getAll: async () => {
        const response = await api.get(ENDPOINTS.TEAMS.LIST);
        return response.data;
    },

    // Get team by ID
    getById: async (id) => {
        const response = await api.get(ENDPOINTS.TEAMS.GET(id));
        return response.data;
    },

    // Create team
    create: async (teamData) => {
        const response = await api.post(ENDPOINTS.TEAMS.CREATE, teamData);
        return response.data;
    },

    // Update team
    update: async (id, teamData) => {
        const response = await api.put(ENDPOINTS.TEAMS.UPDATE(id), teamData);
        return response.data;
    },

    // Delete team
    delete: async (id) => {
        const response = await api.delete(ENDPOINTS.TEAMS.DELETE(id));
        return response.data;
    }
};

// ============================================
// MEMBERS
// ============================================

export const membersService = {
    // Get all members (with optional team filter)
    getAll: async (teamId = null) => {
        const url = teamId
            ? `${ENDPOINTS.MEMBERS.LIST}?team_id=${teamId}`
            : ENDPOINTS.MEMBERS.LIST;
        const response = await api.get(url);
        return response.data;
    },

    // Get member by ID
    getById: async (id) => {
        const response = await api.get(ENDPOINTS.MEMBERS.GET(id));
        return response.data;
    },

    // Create member
    create: async (memberData) => {
        const response = await api.post(ENDPOINTS.MEMBERS.CREATE, memberData);
        return response.data;
    },

    // Update member
    update: async (id, memberData) => {
        const response = await api.put(ENDPOINTS.MEMBERS.UPDATE(id), memberData);
        return response.data;
    },

    // Delete member
    delete: async (id) => {
        const response = await api.delete(ENDPOINTS.MEMBERS.DELETE(id));
        return response.data;
    }
};

// ============================================
// TASKS
// ============================================

export const tasksService = {
    // Get all tasks (with optional filters)
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.team_id) params.append('team_id', filters.team_id);
        if (filters.member_id) params.append('member_id', filters.member_id);
        if (filters.status) params.append('status', filters.status);
        if (filters.difficulty) params.append('difficulty', filters.difficulty);
        if (filters.priority) params.append('priority', filters.priority);

        const queryString = params.toString();
        const url = queryString
            ? `${ENDPOINTS.TASKS.LIST}?${queryString}`
            : ENDPOINTS.TASKS.LIST;

        const response = await api.get(url);
        return response.data;
    },

    // Get task by ID
    getById: async (id) => {
        const response = await api.get(ENDPOINTS.TASKS.GET(id));
        return response.data;
    },

    // Create task
    create: async (taskData) => {
        const response = await api.post(ENDPOINTS.TASKS.CREATE, taskData);
        return response.data;
    },

    // Update task
    update: async (id, taskData) => {
        const response = await api.put(ENDPOINTS.TASKS.UPDATE(id), taskData);
        return response.data;
    },

    // Upload proof
    uploadProof: async (id, file) => {
        const formData = new FormData();
        formData.append('proof', file);

        const response = await api.post(ENDPOINTS.TASKS.UPLOAD_PROOF(id), formData);
        return response.data;
    },

    // Validate task
    validate: async (id) => {
        const response = await api.put(ENDPOINTS.TASKS.VALIDATE(id));
        return response.data;
    },

    // Delete task
    delete: async (id) => {
        const response = await api.delete(ENDPOINTS.TASKS.DELETE(id));
        return response.data;
    }
};

// ============================================
// LEADERBOARD
// ============================================

export const leaderboardService = {
    // Get leaderboard
    get: async (period = 'total') => {
        const response = await api.get(`${ENDPOINTS.LEADERBOARD.GET}?period=${period}`);
        return response.data;
    }
};

// Export all services
export default {
    auth: authService,
    teams: teamsService,
    members: membersService,
    tasks: tasksService,
    leaderboard: leaderboardService
};
