import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Calendar, Clock } from 'lucide-react';
import { leaderboardService } from '../../api/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import '../../styles/index.css';

const RankBadge = ({ rank }) => {
    const colors = {
        1: '#fbbf24', // Gold
        2: '#9ca3af', // Silver
        3: '#fb923c', // Bronze
    };

    if (rank <= 3) {
        return (
            <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                background: colors[rank],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                {rank}
            </div>
        );
    }

    return (
        <div style={{
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-gray-500)',
            fontWeight: '600',
            fontSize: '1.125rem'
        }}>
            {rank}
        </div>
    );
};

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [period, setPeriod] = useState('total');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const data = await leaderboardService.get(period);
                setLeaderboard(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [period]);

    const periods = [
        { id: 'daily', label: 'Aujourd\'hui', icon: Clock },
        { id: 'weekly', label: 'Cette semaine', icon: Calendar },
        { id: 'total', label: 'Total', icon: Trophy },
    ];

    return (
        <div style={{ padding: 'var(--spacing-xl) 0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-gray-900)' }}>
                    Classement
                </h1>

                <div style={{
                    display: 'flex',
                    background: 'white',
                    padding: '4px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {periods.map((p) => {
                        const Icon = p.icon;
                        const isActive = period === p.id;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)',
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    border: 'none',
                                    background: isActive ? 'var(--color-primary)' : 'transparent',
                                    color: isActive ? 'white' : 'var(--color-gray-600)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all var(--transition-base)'
                                }}
                            >
                                <Icon size={16} />
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading ? (
                <LoadingSpinner message="Chargement du classement..." />
            ) : (
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                                <th style={{ padding: 'var(--spacing-lg)', textAlign: 'left', color: 'var(--color-gray-500)', width: '100px' }}>Rang</th>
                                <th style={{ padding: 'var(--spacing-lg)', textAlign: 'left', color: 'var(--color-gray-500)' }}>Équipe</th>
                                <th style={{ padding: 'var(--spacing-lg)', textAlign: 'right', color: 'var(--color-gray-500)' }}>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <tr
                                    key={entry.team_id}
                                    style={{
                                        borderBottom: index < leaderboard.length - 1 ? '1px solid var(--color-gray-100)' : 'none',
                                        transition: 'background var(--transition-base)'
                                    }}
                                    className="hover-bg-gray-50"
                                >
                                    <td style={{ padding: 'var(--spacing-lg)' }}>
                                        <RankBadge rank={index + 1} />
                                    </td>
                                    <td style={{ padding: 'var(--spacing-lg)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                            <div style={{
                                                width: '3rem',
                                                height: '3rem',
                                                borderRadius: 'var(--radius-md)',
                                                background: entry.team_color || 'var(--color-gray-400)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '1.25rem'
                                            }}>
                                                {entry.team_name ? entry.team_name.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--color-gray-900)', fontSize: '1.125rem' }}>
                                                    {entry.team_name || 'Équipe inconnue'}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                                                    {entry.completed_tasks || 0} tâches complétées
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-lg)', textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                                            {entry.total_points}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                                            points
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {leaderboard.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                                        Aucune donnée disponible pour cette période
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
