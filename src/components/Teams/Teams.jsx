import React, { useState, useEffect } from 'react';
import { Plus, Users, Trash2, Edit2, X, Check, UserPlus, Type, Shield, Image, Palette } from 'lucide-react';
import { teamsService, membersService, authService } from '../../api/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import ConfirmationModal from '../shared/ConfirmationModal';
import '../../styles/index.css';

const TeamCard = ({ team, onDelete, onUpdate, onRefresh, isAdmin }) => {
    const [members, setMembers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [editName, setEditName] = useState(team.name);
    const [editColor, setEditColor] = useState(team.color);

    const fetchMembers = async () => {
        try {
            const data = await membersService.getAll(team.id);
            setMembers(data);
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [team.id]);

    const handleSave = async () => {
        try {
            await onUpdate(team.id, { name: editName, color: editColor });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (window.confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) {
            try {
                await membersService.delete(memberId);
                await fetchMembers();
            } catch (error) {
                console.error('Error deleting member:', error);
                alert('Erreur lors de la suppression du membre');
            }
        }
    };

    return (
        <div className="card" style={{ borderTop: `4px solid ${team.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', width: '100%' }}>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="input"
                            placeholder="Nom de l'équipe"
                        />
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <input
                                type="color"
                                value={editColor}
                                onChange={(e) => setEditColor(e.target.value)}
                                style={{ height: '38px', width: '50px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                            />
                            <button onClick={handleSave} className="btn btn-primary" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}>
                                <Check size={16} />
                            </button>
                            <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-gray-900)' }}>
                            {team.name}
                        </h3>
                        {isAdmin && (
                            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-icon"
                                    style={{ color: 'var(--color-gray-500)' }}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(team.id);
                                    }}
                                    className="btn-icon"
                                    style={{ color: 'var(--color-error)' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--color-gray-600)' }}>
                        <Users size={16} />
                        <span style={{ fontWeight: '500' }}>Membres ({members.length})</span>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setShowAddMember(true)}
                            style={{
                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all var(--transition-base)'
                            }}
                        >
                            <UserPlus size={14} />
                            Ajouter
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="member-card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-xs)',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--color-gray-50)',
                                border: '1px solid var(--color-gray-100)'
                            }}
                        >
                            <div style={{
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '50%',
                                background: 'var(--color-gray-200)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'var(--color-gray-700)',
                                flexShrink: 0,
                                overflow: 'hidden'
                            }}>
                                {member.avatar_url ? (
                                    <img
                                        src={member.avatar_url}
                                        alt={member.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    member.name.charAt(0)
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {member.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {member.role === 'leader' && <Shield size={12} className="text-warning" style={{ color: 'var(--color-warning)' }} />}
                                    {member.role === 'leader' ? 'Leader' : 'Membre'}
                                </div>
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="btn-icon"
                                    style={{ color: 'var(--color-error)', padding: '4px' }}
                                    title="Retirer le membre"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {members.length === 0 && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-400)', fontStyle: 'italic', padding: 'var(--spacing-sm)' }}>
                            Aucun membre
                        </span>
                    )}
                </div>
            </div>

            {showAddMember && (
                <AddMemberModal
                    teamId={team.id}
                    hasLeader={members.some(m => m.role === 'leader')}
                    onClose={() => setShowAddMember(false)}
                    onSuccess={() => {
                        fetchMembers();
                        setShowAddMember(false);
                    }}
                />
            )}
        </div>
    );
};

const AddMemberModal = ({ teamId, hasLeader, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: 'member',
        avatar_url: ''
    });
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await authService.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await membersService.create({
                team_id: teamId,
                user_id: parseInt(selectedUserId),
                name: formData.name,
                role: formData.role,
                avatar_url: formData.avatar_url || null
            });
            onSuccess();
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Erreur lors de l\'ajout du membre');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <UserPlus size={24} className="text-primary" style={{ color: 'var(--color-primary)' }} />
                        Ajouter un membre
                    </h2>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Utilisateur</label>
                        <div style={{ position: 'relative' }}>
                            <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                            <select
                                className="form-select"
                                style={{ paddingLeft: '40px' }}
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                required
                            >
                                <option value="">Sélectionner un utilisateur</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.email}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nom d'affichage</label>
                        <div style={{ position: 'relative' }}>
                            <Type size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                            <input
                                type="text"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Ex: Jean Dupont"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Rôle dans l'équipe</label>
                        <div style={{ position: 'relative' }}>
                            <Shield size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                            <select
                                className="form-select"
                                style={{ paddingLeft: '40px' }}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="member">Membre</option>
                                {!hasLeader && <option value="leader">Leader</option>}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">URL de l'avatar (optionnel)</label>
                        <div style={{ position: 'relative' }}>
                            <Image size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                            <input
                                type="url"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                value={formData.avatar_url}
                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Plus size={18} />
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CreateTeamModal = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#3b82f6');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onCreate({ name, color });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Users size={24} className="text-primary" style={{ color: 'var(--color-primary)' }} />
                        Nouvelle équipe
                    </h2>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Nom de l'équipe</label>
                        <div style={{ position: 'relative' }}>
                            <Type size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                            <input
                                type="text"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Ex: Les Vainqueurs"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Couleur de l'équipe</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <div style={{ position: 'relative', width: '80px', height: '48px' }}>
                                <Palette size={18} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-500)', zIndex: 1, pointerEvents: 'none' }} />
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        padding: '4px 4px 4px 32px',
                                        border: '1px solid var(--color-gray-300)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        background: 'white'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '4px' }}>
                                    Aperçu
                                </div>
                                <div style={{
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-gray-50)',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: color,
                                    border: '1px solid var(--color-gray-200)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)'
                                }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: color }}></div>
                                    {color}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Plus size={18} />
                            Créer l'équipe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteTeamId, setDeleteTeamId] = useState(null);
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    const fetchTeams = async () => {
        try {
            const data = await teamsService.getAll();
            setTeams(data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleCreateTeam = async (teamData) => {
        try {
            await teamsService.create(teamData);
            await fetchTeams();
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Erreur lors de la création de l\'équipe');
        }
    };

    const handleDeleteTeam = (id) => {
        setDeleteTeamId(id);
    };

    const confirmDeleteTeam = async () => {
        if (!deleteTeamId) return;
        try {
            await teamsService.delete(deleteTeamId);
            await fetchTeams();
            setDeleteTeamId(null);
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Erreur lors de la suppression de l\'équipe');
        }
    };

    const handleUpdateTeam = async (id, data) => {
        try {
            await teamsService.update(id, data);
            await fetchTeams();
        } catch (error) {
            console.error('Error updating team:', error);
            alert('Erreur lors de la mise à jour de l\'équipe');
        }
    };

    return (
        <div style={{ padding: 'var(--spacing-xl) 0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-gray-900)' }}>
                    Équipes
                </h1>
                {isAdmin && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                    >
                        <Plus size={20} />
                        Nouvelle équipe
                    </button>
                )}
            </div>

            {loading ? (
                <LoadingSpinner message="Chargement des équipes..." />
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {teams.map((team) => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            onDelete={handleDeleteTeam}
                            onUpdate={handleUpdateTeam}
                            onRefresh={fetchTeams}
                            isAdmin={isAdmin}
                        />
                    ))}
                    {teams.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-gray-500)' }}>
                            Aucune équipe n'a été créée pour le moment.
                        </div>
                    )}
                </div>
            )}

            {showCreateModal && (
                <CreateTeamModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateTeam}
                />
            )}

            <ConfirmationModal
                isOpen={!!deleteTeamId}
                onClose={() => setDeleteTeamId(null)}
                onConfirm={confirmDeleteTeam}
                title="Supprimer l'équipe"
                message="Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible et supprimera tous les membres et tâches associés."
                confirmLabel="Supprimer"
                confirmColor="danger"
            />

            <style>{`
                .member-delete-btn {
                    opacity: 0 !important;
                }
                .member-card:hover > .member-delete-btn {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default Teams;
