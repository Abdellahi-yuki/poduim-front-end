import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/shared/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { authService } from './api/apiService';
import './styles/index.css';

import Leaderboard from './components/Leaderboard/Leaderboard';
import Teams from './components/Teams/Teams';
import Tasks from './components/Tasks/Tasks';

function App() {
    const [currentView, setCurrentView] = useState('dashboard');

    const MainApp = () => {
        const renderView = () => {
            switch (currentView) {
                case 'dashboard':
                    return <Dashboard setCurrentView={setCurrentView} />;
                case 'leaderboard':
                    return <Leaderboard setCurrentView={setCurrentView} />;
                case 'teams':
                    return <Teams setCurrentView={setCurrentView} />;
                case 'tasks':
                    return <Tasks setCurrentView={setCurrentView} />;
                default:
                    return <Dashboard setCurrentView={setCurrentView} />;
            }
        };

        return (
            <div style={{ minHeight: '100vh', background: 'var(--color-gray-100)' }}>
                <Navigation currentView={currentView} setCurrentView={setCurrentView} />
                <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--spacing-md)' }}>
                    {renderView()}
                </main>
            </div>
        );
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainApp />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
