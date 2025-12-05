import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, Upload, Check, X, Type, AlignLeft, Users, Calendar, Flag, Target } from 'lucide-react';
import { tasksService, authService, teamsService } from '../../api/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import '../../styles/index.css';

const TaskCard = ({ task, onUpdateStatus, onValidate, isAdmin, isMember }) => {
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
            case 'easy': return 'Facile';
            case 'medium': return 'Moyen';
            case 'hard': return 'Difficile';
            default: return difficulty;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="card" style={{ marginBottom: 'var(--spacing-md)', borderLeft: `4px solid ${getPriorityColor(task.priority)}`, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-gray-900)', flex: 1, marginRight: 'var(--spacing-sm)' }}>{task.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>
                        {getDifficultyLabel(task.difficulty)}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                        {task.points} pts
                    </span>
                </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-md)', lineHeight: '1.4' }}>
                {task.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    {task.member_id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`Assigné à: ${task.member_name}`}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-gray-200)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-gray-600)', overflow: 'hidden'
                            }}>
                                {task.member_avatar ? (
                                    <img src={task.member_avatar} alt={task.member_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    task.member_name ? task.member_name.charAt(0) : '?'
                                )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {task.member_name}
                            </span>
                        </div>
                    ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', fontWeight: '500' }}>
                            {task.team_name ? `Équipe ${task.team_name}` : 'Non assigné'}
                        </span>
                    )}
                </div>

                {task.deadline && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-gray-500)' }} title="Date limite">
                        <Clock size={12} />
                        {formatDate(task.deadline)}
                    </div>
                )}
            </div>

            <div style={{ marginTop: 'var(--spacing-sm)', display: 'flex', justifyContent: 'flex-end' }}>
                {task.status === 'todo' && isMember && !task.member_id && (
                    <button
                        onClick={() => onUpdateStatus(task.id, 'doing')}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                    >
                        Prendre
                    </button>
                )}
                {task.status === 'doing' && isMember && (
                    <button
                        onClick={() => onUpdateStatus(task.id, 'done')}
                        className="btn btn-sm btn-primary"
                        style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                    >
                        Terminer
                    </button>
                )}
                {task.status === 'done' && isAdmin && (
                    <button
                        onClick={() => onValidate(task.id)}
                        className="btn btn-sm btn-success"
                        style={{ background: 'var(--color-success)', color: 'white', border: 'none', fontSize: '0.75rem', padding: '4px 12px' }}
                    >
                        Valider
                    </button>
                )}
            </div>
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

    const handleSelect = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onCreate(formData);
    };

    const difficulties = [
        { id: 'easy', label: 'Facile', points: 20, color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)' },
        { id: 'medium', label: 'Moyen', points: 50, color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
        { id: 'hard', label: 'Difficile', points: 100, color: 'var(--color-error)', bg: 'rgba(239, 68, 68, 0.1)' }
    ];

    const priorities = [
        { id: 'low', label: 'Basse', color: 'var(--color-success)' },
        { id: 'medium', label: 'Moyenne', color: 'var(--color-warning)' },
        { id: 'high', label: 'Haute', color: 'var(--color-error)' }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Plus size={24} className="text-primary" />
                        Nouvelle tâche
                    </h2>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Titre de la tâche</label>
                        <div style={{ position: 'relative' }}>
                            <Type size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                required
                                placeholder="Ex: Développer la fonctionnalité X"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <div style={{ position: 'relative' }}>
                            <AlignLeft size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-gray-400)' }} />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-textarea"
                                style={{ paddingLeft: '40px' }}
                                rows="3"
                                placeholder="Détails de la tâche..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Équipe assignée</label>
                        <div style={{ position: 'relative' }}>
                            <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                            <select
                                name="team_id"
                                value={formData.team_id}
                                onChange={handleChange}
                                className="form-select"
                                style={{ paddingLeft: '40px' }}
                                required
                            >
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                        <div>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <Target size={16} /> Difficulté
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                {difficulties.map(diff => (
                                    <div
                                        key={diff.id}
                                        onClick={() => handleSelect('difficulty', diff.id)}
                                        style={{
                                            padding: 'var(--spacing-sm)',
                                            borderRadius: 'var(--radius-md)',
                                            border: formData.difficulty === diff.id ? `2px solid ${diff.color}` : '1px solid var(--color-gray-200)',
                                            background: formData.difficulty === diff.id ? diff.bg : 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        <span style={{ fontWeight: '500', color: formData.difficulty === diff.id ? diff.color : 'var(--color-gray-700)' }}>
                                            {diff.label}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: diff.color }}>
                                            {diff.points} pts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <Flag size={16} /> Priorité
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                {priorities.map(prio => (
                                    <div
                                        key={prio.id}
                                        onClick={() => handleSelect('priority', prio.id)}
                                        style={{
                                            padding: 'var(--spacing-sm)',
                                            borderRadius: 'var(--radius-md)',
                                            border: formData.priority === prio.id ? `2px solid ${prio.color}` : '1px solid var(--color-gray-200)',
                                            background: formData.priority === prio.id ? 'var(--color-gray-50)' : 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)',
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: prio.color }}></div>
                                        <span style={{ fontWeight: '500', color: formData.priority === prio.id ? 'var(--color-gray-900)' : 'var(--color-gray-700)' }}>
                                            {prio.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date limite (optionnel)</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                            <input
                                type="datetime-local"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Plus size={18} />
                            Créer la tâche
                        </button>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-lg)', overflowX: 'auto', alignItems: 'start' }}>
                    {columns.map(col => (
                        <div key={col.id} style={{ background: 'var(--color-gray-50)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-lg)', minHeight: '150px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', color: col.color, fontWeight: '600' }}>
                                <col.icon size={20} />
                                {col.label}
                                <span style={{ background: 'var(--color-gray-200)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--color-gray-700)' }}>
                                    {tasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>

                            {tasks.filter(t => t.status === col.id).map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdateStatus={handleUpdateStatus}
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
