// Mock data simulating backend responses
// This file contains all static data until the real API is ready

export const mockUsers = [
    {
        id: 1,
        email: 'admin@podium.com',
        password: 'admin123', // In real app, this would be hashed
        role: 'admin',
        created_at: '2025-12-01T10:00:00.000Z'
    },
    {
        id: 2,
        email: 'member@podium.com',
        password: 'member123',
        role: 'member',
        created_at: '2025-12-01T10:00:00.000Z'
    }
];

export const mockTeams = [
    {
        id: 1,
        name: 'Les Innovateurs',
        color: '#3b82f6',
        created_at: '2025-12-01T10:00:00.000Z'
    },
    {
        id: 2,
        name: 'Team Alpha',
        color: '#10b981',
        created_at: '2025-12-01T10:00:00.000Z'
    },
    {
        id: 3,
        name: 'Les Warriors',
        color: '#f59e0b',
        created_at: '2025-12-01T10:00:00.000Z'
    },
    {
        id: 4,
        name: 'Phoenix Squad',
        color: '#ef4444',
        created_at: '2025-12-01T10:00:00.000Z'
    }
];

export const mockMembers = [
    {
        id: 1,
        team_id: 1,
        user_id: 2,
        name: 'Alice Martin',
        role: 'leader',
        avatar_url: 'https://i.pravatar.cc/150?img=1'
    },
    {
        id: 2,
        team_id: 1,
        user_id: 3,
        name: 'Bob Chen',
        role: 'member',
        avatar_url: 'https://i.pravatar.cc/150?img=2'
    },
    {
        id: 3,
        team_id: 1,
        user_id: 4,
        name: 'Sophie Laurent',
        role: 'member',
        avatar_url: 'https://i.pravatar.cc/150?img=3'
    },
    {
        id: 4,
        team_id: 2,
        user_id: 5,
        name: 'Claire Dubois',
        role: 'leader',
        avatar_url: 'https://i.pravatar.cc/150?img=4'
    },
    {
        id: 5,
        team_id: 2,
        user_id: 6,
        name: 'David Kumar',
        role: 'member',
        avatar_url: 'https://i.pravatar.cc/150?img=5'
    },
    {
        id: 6,
        team_id: 2,
        user_id: 7,
        name: 'Maria Garcia',
        role: 'member',
        avatar_url: 'https://i.pravatar.cc/150?img=6'
    },
    {
        id: 7,
        team_id: 3,
        user_id: 8,
        name: 'Emma Wilson',
        role: 'leader',
        avatar_url: 'https://i.pravatar.cc/150?img=7'
    },
    {
        id: 8,
        team_id: 3,
        user_id: 9,
        name: 'Frank Lopez',
        role: 'member',
        avatar_url: 'https://i.pravatar.cc/150?img=8'
    },
    {
        id: 9,
        team_id: 4,
        user_id: 10,
        name: 'James Anderson',
        role: 'leader',
        avatar_url: 'https://i.pravatar.cc/150?img=9'
    },
    {
        id: 10,
        team_id: 4,
        user_id: 11,
        name: 'Lisa Thompson',
        role: 'member',
        avatar_url: 'https://i.pravatar.cc/150?img=10'
    }
];

export const mockTasks = [
    {
        id: 1,
        team_id: 1,
        member_id: 1,
        title: 'Développer API REST',
        description: 'Créer endpoints CRUD pour la gestion des équipes',
        points: 50,
        difficulty: 'medium',
        priority: 'high',
        status: 'validated',
        deadline: '2025-12-10T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-01T10:00:00.000Z',
        updated_at: '2025-12-03T15:30:00.000Z',
        validated_at: '2025-12-03T15:30:00.000Z'
    },
    {
        id: 2,
        team_id: 1,
        member_id: 2,
        title: 'Maquettes UI/UX',
        description: 'Design système complet de l\'application',
        points: 40,
        difficulty: 'medium',
        priority: 'high',
        status: 'validated',
        deadline: '2025-12-08T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-01T10:00:00.000Z',
        updated_at: '2025-12-02T14:20:00.000Z',
        validated_at: '2025-12-02T14:20:00.000Z'
    },
    {
        id: 3,
        team_id: 1,
        member_id: 3,
        title: 'Intégration WebSocket',
        description: 'Mise en place des notifications temps réel',
        points: 60,
        difficulty: 'hard',
        priority: 'medium',
        status: 'doing',
        deadline: '2025-12-12T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-02T10:00:00.000Z',
        updated_at: '2025-12-04T09:00:00.000Z',
        validated_at: null
    },
    {
        id: 4,
        team_id: 2,
        member_id: 4,
        title: 'Planning Sprint 3',
        description: 'Organiser et planifier le sprint 3',
        points: 20,
        difficulty: 'easy',
        priority: 'medium',
        status: 'done',
        deadline: '2025-12-05T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-02T10:00:00.000Z',
        updated_at: '2025-12-04T11:00:00.000Z',
        validated_at: null
    },
    {
        id: 5,
        team_id: 2,
        member_id: 5,
        title: 'Tests unitaires',
        description: 'Couvrir 80% du code avec des tests',
        points: 60,
        difficulty: 'hard',
        priority: 'high',
        status: 'doing',
        deadline: '2025-12-15T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-03T10:00:00.000Z',
        updated_at: '2025-12-04T10:00:00.000Z',
        validated_at: null
    },
    {
        id: 6,
        team_id: 2,
        member_id: 6,
        title: 'Documentation API',
        description: 'Rédiger la documentation complète de l\'API',
        points: 30,
        difficulty: 'easy',
        priority: 'medium',
        status: 'validated',
        deadline: '2025-12-07T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-01T10:00:00.000Z',
        updated_at: '2025-12-03T16:00:00.000Z',
        validated_at: '2025-12-03T16:00:00.000Z'
    },
    {
        id: 7,
        team_id: 3,
        member_id: 7,
        title: 'Analyse données',
        description: 'Rapport mensuel d\'analyse des métriques',
        points: 30,
        difficulty: 'easy',
        priority: 'medium',
        status: 'validated',
        deadline: '2025-12-06T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-01T10:00:00.000Z',
        updated_at: '2025-12-02T17:00:00.000Z',
        validated_at: '2025-12-02T17:00:00.000Z'
    },
    {
        id: 8,
        team_id: 3,
        member_id: 8,
        title: 'Optimisation performance',
        description: 'Améliorer les temps de chargement de 30%',
        points: 70,
        difficulty: 'hard',
        priority: 'high',
        status: 'todo',
        deadline: '2025-12-20T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-03T10:00:00.000Z',
        updated_at: '2025-12-03T10:00:00.000Z',
        validated_at: null
    },
    {
        id: 9,
        team_id: 4,
        member_id: 9,
        title: 'Migration base de données',
        description: 'Migrer vers PostgreSQL',
        points: 80,
        difficulty: 'hard',
        priority: 'high',
        status: 'doing',
        deadline: '2025-12-18T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-02T10:00:00.000Z',
        updated_at: '2025-12-04T08:00:00.000Z',
        validated_at: null
    },
    {
        id: 10,
        team_id: 4,
        member_id: 10,
        title: 'Revue de code',
        description: 'Review des PRs de la semaine',
        points: 20,
        difficulty: 'easy',
        priority: 'low',
        status: 'todo',
        deadline: '2025-12-09T23:59:59.000Z',
        proof_url: null,
        created_at: '2025-12-04T10:00:00.000Z',
        updated_at: '2025-12-04T10:00:00.000Z',
        validated_at: null
    }
];

// Chart data for dashboard
export const mockChartData = [
    { day: 'Lun', points: 110 },
    { day: 'Mar', points: 150 },
    { day: 'Mer', points: 180 },
    { day: 'Jeu', points: 200 },
    { day: 'Ven', points: 220 },
    { day: 'Sam', points: 240 },
    { day: 'Dim', points: 260 }
];

// Helper to generate leaderboard data
export const generateLeaderboard = (period = 'total') => {
    // For now, return total leaderboard
    // In real implementation, filter by period
    const teamScores = mockTeams.map(team => {
        const teamTasks = mockTasks.filter(t => t.team_id === team.id && t.status === 'validated');
        const totalPoints = teamTasks.reduce((sum, t) => sum + t.points, 0);
        const completedTasks = teamTasks.length;
        const totalTasks = mockTasks.filter(t => t.team_id === team.id).length;

        return {
            team_id: team.id,
            team_name: team.name,
            team_color: team.color,
            total_points: totalPoints,
            completed_tasks: completedTasks,
            total_tasks: totalTasks
        };
    });

    // Sort by points and add rank
    return teamScores
        .sort((a, b) => b.total_points - a.total_points)
        .map((team, index) => ({
            ...team,
            rank: index + 1
        }));
};
