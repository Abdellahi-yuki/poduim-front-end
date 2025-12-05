import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Users, CheckCircle, Clock } from 'lucide-react';
import { teamsService, tasksService, leaderboardService } from '../../api/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import '../../styles/index.css';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
        <div className="stat-info">
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
        </div>
        <div className="stat-icon" style={{ background: color }}>
            <Icon size={24} />
        </div>
    </div>
);

const QuickAction = ({ label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className="card"
        style={{
            cursor: 'pointer',
            border: 'none',
            textAlign: 'left',
            padding: 'var(--spacing-lg)'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-primary)'
            }}>
                <Icon size={24} />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-gray-900)' }}>
                {label}
            </span>
        </div>
    </button>
);

const Dashboard = ({ setCurrentView }) => {
    const [teams, setTeams] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamsData, tasksData, leaderboardData] = await Promise.all([
                    teamsService.getAll(),
                    tasksService.getAll(),
                    leaderboardService.get()
                ]);

                setTeams(teamsData);
                setTasks(tasksData);
                setLeaderboard(leaderboardData);

                // Calculate chart data (points per day for the last 7 days)
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const data = last7Days.map(date => {
                    const points = tasksData
                        .filter(t => t.status === 'validated' && t.validated_at && t.validated_at.startsWith(date))
                        .reduce((sum, t) => sum + t.points, 0);

                    const dayName = new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' });
                    return { day: dayName, points };
                });

                setChartData(data);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Chargement du tableau de bord..." />;
    }

    const validatedTasks = tasks.filter(t => t.status === 'validated').length;
    const inProgressTasks = tasks.filter(t => t.status === 'doing').length;
    const totalPoints = tasks
        .filter(t => t.status === 'validated')
        .reduce((sum, t) => sum + t.points, 0);

    return (
        <div style={{ padding: 'var(--spacing-xl) 0' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-xl)' }}>
                Tableau de bord
            </h1>

            {/* Stats Cards */}
            <div className="stats-grid">
                <StatCard
                    icon={Users}
                    label="Équipes actives"
                    value={teams.length}
                    color="var(--color-primary)"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Tâches validées"
                    value={validatedTasks}
                    color="var(--color-success)"
                />
                <StatCard
                    icon={Clock}
                    label="Tâches en cours"
                    value={inProgressTasks}
                    color="var(--color-warning)"
                />
                <StatCard
                    icon={Trophy}
                    label="Points totaux"
                    value={totalPoints}
                    color="var(--color-secondary)"
                />
            </div>

            {/* Chart */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)', color: 'var(--color-gray-900)' }}>
                    Évolution des points cette semaine
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="points" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top 3 Teams */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)', color: 'var(--color-gray-900)' }}>
                    Top 3 des équipes
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {leaderboard.slice(0, 3).map((team, idx) => {
                        const medalColors = ['#fbbf24', '#9ca3af', '#fb923c'];
                        return (
                            <div
                                key={team.team_id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 'var(--spacing-lg)',
                                    background: 'var(--color-gray-50)',
                                    borderRadius: 'var(--radius-lg)',
                                    transition: 'all var(--transition-base)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-gray-100)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-gray-50)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{
                                        width: '2rem',
                                        height: '2rem',
                                        borderRadius: '50%',
                                        background: medalColors[idx],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        color: 'white'
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: '600', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-xs)' }}>
                                            {team.team_name}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                                            {team.completed_tasks || 0} tâches complétées
                                        </p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: team.team_color }}>
                                        {team.total_points}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                                        points
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {leaderboard.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', color: 'var(--color-gray-500)' }}>
                            Aucune équipe classée pour le moment
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--spacing-lg)'
            }}>
                <QuickAction
                    label="Voir le classement"
                    icon={Trophy}
                    onClick={() => setCurrentView('leaderboard')}
                />
                <QuickAction
                    label="Gérer les équipes"
                    icon={Users}
                    onClick={() => setCurrentView('teams')}
                />
                <QuickAction
                    label="Gérer les tâches"
                    icon={CheckCircle}
                    onClick={() => setCurrentView('tasks')}
                />
            </div>
        </div>
    );
};

export default Dashboard;
