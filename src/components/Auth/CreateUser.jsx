import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/apiService';
import '../../styles/index.css';

const CreateUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'member'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.register(formData.email, formData.password, formData.role);
            setSuccess('Utilisateur créé avec succès !');
            setFormData({ email: '', password: '', role: 'member' });
        } catch (err) {
            setError(err.message || 'Erreur lors de la création de l\'utilisateur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-gray-100)',
            padding: 'var(--spacing-md)'
        }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-900)', margin: 0 }}>
                        Créer un utilisateur
                    </h1>
                    <button onClick={() => navigate('/')} className="btn btn-secondary">
                        Retour
                    </button>
                </div>

                {error && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--color-danger)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--color-success)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: '0.875rem'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="utilisateur@exemple.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Mot de passe</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Minimum 6 caractères"
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role" className="form-label">Rôle</label>
                        <select
                            id="role"
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="member">Membre</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                    >
                        {loading ? 'Création...' : 'Créer l\'utilisateur'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
