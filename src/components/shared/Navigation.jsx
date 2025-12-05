import React, { useState } from 'react';
import { Trophy, User, LogOut, ChevronDown, Sun, Moon, Menu, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/apiService';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/index.css';

const Navigation = ({ currentView, setCurrentView }) => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentUser = authService.getCurrentUser();
    const { theme, toggleTheme } = useTheme();

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

    const handleNavClick = (id) => {
        setCurrentView(id);
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar" role="navigation" aria-label="Navigation principale">
            <div className="navbar-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div className="navbar-brand">
                        <Trophy className="w-8 h-8 text-blue-600" aria-hidden="true" style={{ width: '2rem', height: '2rem', color: 'var(--color-primary)' }} />
                        <h1 style={{ margin: 0 }}>Podium</h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="btn-icon mobile-flex"
                            style={{ color: 'var(--color-gray-600)' }}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Desktop Nav */}
                        <div className="navbar-nav desktop-only" role="menubar">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`nav-button ${currentView === item.id ? 'active' : ''}`}
                                    aria-current={currentView === item.id ? 'page' : undefined}
                                    role="menuitem"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Profile & Theme Section */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-sm)',
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
                                <div className="desktop-only" style={{ textAlign: 'left' }}>
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
                                    background: 'var(--color-gray-50)',
                                    border: '1px solid var(--color-gray-200)',
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
                                        {/* Show role in dropdown on mobile since it's hidden in button */}
                                        <div className="mobile-only" style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                                            {currentUser?.role === 'admin' ? 'Administrateur' : 'Membre'}
                                        </div>
                                    </div>

                                    {/* Admin Link */}
                                    {currentUser?.role === 'admin' && (
                                        <button
                                            onClick={() => {
                                                navigate('/create-user');
                                                setShowProfileMenu(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-sm)',
                                                padding: 'var(--spacing-md)',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--color-gray-900)',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                transition: 'background var(--transition-base)',
                                                borderBottom: '1px solid var(--color-gray-200)'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-50)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <UserPlus size={16} />
                                            Créer un utilisateur
                                        </button>
                                    )}

                                    {/* Theme Toggle inside Dropdown for Mobile/Desktop consistency or just keep it separate? 
                                        User asked: "put the dark mode button in the same div with the profile"
                                        I will put it inside the dropdown for cleaner UI or just next to it?
                                        "in the same div with the profile" implies grouping.
                                        Let's put it as an item in the dropdown for better mobile experience, 
                                        OR just keep it next to the profile button but wrapped in the same container.
                                        The user said "put the dark mode button in the same div with the profile".
                                        I'll put it INSIDE the dropdown menu as a row.
                                    */}
                                    <button
                                        onClick={() => { toggleTheme(); setShowProfileMenu(false); }}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)',
                                            padding: 'var(--spacing-md)',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-gray-900)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            transition: 'background var(--transition-base)',
                                            borderBottom: '1px solid var(--color-gray-200)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-50)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                                        {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
                                    </button>

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
                                            color: 'var(--color-gray-900)',
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
                </div>

                {/* Mobile Nav Dropdown */}
                <div className={`navbar-nav mobile-only ${isMenuOpen ? 'open' : ''}`} role="menubar">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`nav-button ${currentView === item.id ? 'active' : ''}`}
                            aria-current={currentView === item.id ? 'page' : undefined}
                            role="menuitem"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
