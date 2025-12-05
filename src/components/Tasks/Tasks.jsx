import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, Upload, Check, X } from 'lucide-react';
import { tasksService, authService, teamsService } from '../../api/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import '../../styles/index.css';

const TaskCard = ({ task, onUpdateStatus, onUploadProof, onValidate, isAdmin, isMember }) => {
    const [showProofModal, setShowProofModal] = useState(false);
    const [proofFile, setProofFile] = useState(null);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'var(--color-error)';
            case 'medium': return 'var(--color-warning)';
            case 'low': return 'var(--color-success)';
            default: return 'var(--color-gray-500)';
        }
    };

    const getDifficultyLabel = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'Facile (20pts)';
            case 'medium': return 'Moyen (50pts)';
            case 'hard': return 'Difficile (100pts)';
            default: return difficulty;
        }
    };

    const handleProofUpload = async (e) => {
        e.preventDefault();
        if (!proofFile) return;
        await onUploadProof(task.id, proofFile);
        setShowProofModal(false);
    };

    return (
        <div className="card" style={{ marginBottom: 'var(--spacing-md)', borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-gray-900)' }}>{task.title}</h3>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>
                    {getDifficultyLabel(task.difficulty)}
                </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-md)' }}>
                {task.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    {task.status === 'todo' && isMember && (
                        <button
                            onClick={() => onUpdateStatus(task.id, 'doing')}
                            className="btn btn-sm btn-secondary"
                        >
                            Commencer
                        </button>
                    )}
                    {task.status === 'doing' && isMember && (
                        <button
                            onClick={() => setShowProofModal(true)}
                            className="btn btn-sm btn-primary"
                        >
                            Terminer
                        </button>
                    )}
                    {task.status === 'done' && isAdmin && (
                        <button
                            onClick={() => onValidate(task.id)}
                            className="btn btn-sm btn-success"
                            style={{ background: 'var(--color-success)', color: 'white', border: 'none' }}
                        >
                            Valider
                        </button>
                    )}
                </div>

                {task.proof_url && (
                    <a
                        href={task.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'underline' }}
                    >
                        Voir la preuve
                    </a>
                )}
            </div>

            {showProofModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                        <h3>Preuve de réalisation</h3>
                        <form onSubmit={handleProofUpload}>
                            <div className="form-group">
                                <label className="label">Fichier (Image ou PDF)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setProofFile(e.target.files[0])}
                                    accept="image/*,.pdf"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                                <button type="button" onClick={() => setShowProofModal(false)} className="btn btn-secondary">Annuler</button>
                                <button type="submit" className="btn btn-primary">Envoyer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const CreateTaskModal = ({ onClose, onCreate, teams }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        team_id: teams.length > 0 ? teams[0].id : '',
        points: 50,
        difficulty: 'medium',
        priority: 'medium',
        deadline: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onCreate(formData);
    };

    const getDifficultyInfo = (difficulty) => {
        const info = {
            easy: { points: 20, color: 'var(--color-success)', label: 'Facile' },
            medium: { points: 50, color: 'var(--color-warning)', label: 'Moyen' },
            hard: { points: 100, color: 'var(--color-error)', label: 'Difficile' }
        };
        return info[difficulty];
    };

    const currentDifficulty = getDifficultyInfo(formData.difficulty);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            padding: 'var(--spacing-md)'
        }} onClick={onClose}>
            <div className="card" style={{ width: '100%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)', color: 'var(--color-gray-900)' }}>
                    Nouvelle tâche
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Titre de la tâche</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input"
                            required
                            placeholder="Ex: Développer la fonctionnalité X"
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input"
                            rows="3"
                            placeholder="Détails de la tâche..."
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Équipe assignée</label>
                        <select name="team_id" value={formData.team_id} onChange={handleChange} className="input" required>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label className="label">Difficulté</label>
                            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="input">
                                <option value="easy">Facile</option>
                                <option value="medium">Moyen</option>
                                <option value="hard">Difficile</option>
                            </select>
                            <div style={{
                                marginTop: 'var(--spacing-xs)',
                                padding: 'var(--spacing-sm)',
                                background: 'var(--color-gray-50)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.75rem',
                                color: currentDifficulty.color,
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>
                                {currentDifficulty.points} points
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label">Priorité</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="input">
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="label">Date limite (optionnel)</label>
                        <input
                            type="datetime-local"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Annuler</button>
                        <button type="submit" className="btn btn-primary">Créer la tâche</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    const fetchData = async () => {
        try {
            const [tasksData, teamsData] = await Promise.all([
                tasksService.getAll(),
                teamsService.getAll()
            ]);
            setTasks(tasksData);
            setTeams(teamsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTask = async (taskData) => {
        try {
            // Set points based on difficulty
            const pointsMap = { easy: 20, medium: 50, hard: 100 };
            const data = { ...taskData, points: pointsMap[taskData.difficulty] };

            await tasksService.create(data);
            await fetchData();
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Erreur lors de la création de la tâche');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await tasksService.update(id, { status });
            await fetchData();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleUploadProof = async (id, file) => {
        try {
            await tasksService.uploadProof(id, file);
            await fetchData();
        } catch (error) {
            console.error('Error uploading proof:', error);
            alert('Erreur lors de l\'envoi de la preuve');
        }
    };

    const handleValidate = async (id) => {
        try {
            await tasksService.validate(id);
            await fetchData();
        } catch (error) {
            console.error('Error validating task:', error);
            alert('Erreur lors de la validation');
        }
    };

    const columns = [
        { id: 'todo', label: 'À faire', icon: AlertCircle, color: 'var(--color-gray-500)' },
        { id: 'doing', label: 'En cours', icon: Clock, color: 'var(--color-warning)' },
        { id: 'done', label: 'Terminé', icon: Check, color: 'var(--color-primary)' },
        { id: 'validated', label: 'Validé', icon: CheckCircle, color: 'var(--color-success)' }
    ];

    return (
        <div style={{ padding: 'var(--spacing-xl) 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-gray-900)' }}>Tâches</h1>
                {isAdmin && (
                    <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Plus size={20} /> Nouvelle tâche
                    </button>
                )}
            </div>

            {loading ? (
                <LoadingSpinner message="Chargement des tâches..." />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-lg)', overflowX: 'auto' }}>
                    {columns.map(col => (
                        <div key={col.id} style={{ background: 'var(--color-gray-50)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-lg)', minHeight: '500px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', color: col.color, fontWeight: '600' }}>
                                <col.icon size={20} />
                                {col.label}
                                <span style={{ background: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--color-gray-600)' }}>
                                    {tasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>

                            {tasks.filter(t => t.status === col.id).map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdateStatus={handleUpdateStatus}
                                    onUploadProof={handleUploadProof}
                                    onValidate={handleValidate}
                                    isAdmin={isAdmin}
                                    isMember={!isAdmin} // Simplified for demo
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <CreateTaskModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateTask}
                    teams={teams}
                />
            )}
        </div>
    );
};

export default Tasks;
