import React, { useState } from 'react';
import { Trophy, User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/apiService';
import '../../styles/index.css';

const Navigation = ({ currentView, setCurrentView }) => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const currentUser = authService.getCurrentUser();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'leaderboard', label: 'Classement' },
        { id: 'teams', label: 'Équipes' },
        { id: 'tasks', label: 'Tâches' }
    ];

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar" role="navigation" aria-label="Navigation principale">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <Trophy className="w-8 h-8 text-blue-600" aria-hidden="true" style={{ width: '2rem', height: '2rem', color: 'var(--color-primary)' }} />
                    <h1 style={{ margin: 0 }}>Podium</h1>
                </div>
                <div className="navbar-nav" role="menubar">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`nav-button ${currentView === item.id ? 'active' : ''}`}
                            aria-current={currentView === item.id ? 'page' : undefined}
                            role="menuitem"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Profile Section */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'var(--color-gray-100)',
                            border: 'none',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)',
                            color: 'var(--color-gray-700)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-200)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-gray-100)'}
                    >
                        <div style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            background: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                {currentUser?.email?.split('@')[0] || 'User'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                                {currentUser?.role === 'admin' ? 'Administrateur' : 'Membre'}
                            </div>
                        </div>
                        <ChevronDown size={16} style={{
                            transition: 'transform var(--transition-base)',
                            transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} />
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-lg)',
                            minWidth: '200px',
                            overflow: 'hidden',
                            zIndex: 1000
                        }}>
                            <div style={{
                                padding: 'var(--spacing-md)',
                                borderBottom: '1px solid var(--color-gray-200)'
                            }}>
                                <div style={{ fontWeight: '600', color: 'var(--color-gray-900)' }}>
                                    {currentUser?.email}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                                    ID: {currentUser?.id}
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-md)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-error)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    transition: 'background var(--transition-base)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-50)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <LogOut size={16} />
                                Se déconnecter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
