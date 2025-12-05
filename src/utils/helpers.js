// Utility helper functions

// Format date to locale string
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Format date to short format
export const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
};

// Calculate team score
export const calculateTeamScore = (tasks, teamId) => {
    return tasks
        .filter(t => t.team_id === teamId && t.status === 'validated')
        .reduce((sum, t) => sum + t.points, 0);
};

// Calculate member score
export const calculateMemberScore = (tasks, memberId) => {
    return tasks
        .filter(t => t.member_id === memberId && t.status === 'validated')
        .reduce((sum, t) => sum + t.points, 0);
};

// Get status color classes
export const getStatusColor = (status) => {
    const colors = {
        todo: 'bg-gray-200 text-gray-700',
        doing: 'bg-blue-100 text-blue-700',
        done: 'bg-yellow-100 text-yellow-700',
        validated: 'bg-green-100 text-green-700'
    };
    return colors[status] || colors.todo;
};

// Get status label
export const getStatusLabel = (status) => {
    const labels = {
        todo: 'À faire',
        doing: 'En cours',
        done: 'Terminé',
        validated: 'Validé'
    };
    return labels[status] || status;
};

// Get priority color
export const getPriorityColor = (priority) => {
    const colors = {
        high: 'text-red-600',
        medium: 'text-yellow-600',
        low: 'text-green-600'
    };
    return colors[priority] || colors.medium;
};

// Get priority label
export const getPriorityLabel = (priority) => {
    const labels = {
        high: 'Haute',
        medium: 'Moyenne',
        low: 'Basse'
    };
    return labels[priority] || priority;
};

// Get difficulty label
export const getDifficultyLabel = (difficulty) => {
    const labels = {
        easy: 'Facile',
        medium: 'Moyen',
        hard: 'Difficile'
    };
    return labels[difficulty] || difficulty;
};

// Get medal color for ranking
export const getMedalColor = (rank) => {
    if (rank === 1) return 'bg-yellow-500';
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-orange-600';
    return 'bg-gray-300';
};

// Calculate progress percentage
export const calculateProgress = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Check if deadline is approaching (within 3 days)
export const isDeadlineApproaching = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
};

// Check if deadline is overdue
export const isDeadlineOverdue = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
};

// Generate random color
export const generateRandomColor = () => {
    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};
