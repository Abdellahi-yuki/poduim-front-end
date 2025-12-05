import React, { useState, useEffect } from 'react';
import { Plus, Users, Trash2, Edit2, X, Check, UserPlus } from 'lucide-react';
import { teamsService, membersService, authService } from '../../api/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
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
                                    onClick={() => onDelete(team.id)}
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                    {members.map((member) => (
                        <div
                            key={member.id}
                            title={`${member.name} (${member.role})`}
                            style={{
                                position: 'relative',
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                background: 'var(--color-gray-200)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'var(--color-gray-700)',
                                border: '2px solid white',
                                cursor: 'help',
                                transition: 'transform var(--transition-base)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {member.avatar_url ? (
                                <img
                                    src={member.avatar_url}
                                    alt={member.name}
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                member.name.charAt(0)
                            )}
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteMember(member.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: 'var(--color-error)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        opacity: 0,
                                        transition: 'opacity var(--transition-base)'
                                    }}
                                    className="member-delete-btn"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    {members.length === 0 && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>
                            Aucun membre
                        </span>
                    )}
                </div>
            </div>

            {showAddMember && (
                <AddMemberModal
                    teamId={team.id}
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

const AddMemberModal = ({ teamId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: 'member',
        avatar_url: ''
    });
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        // Fetch available users - for now we'll use a simple approach
        // In a real app, you'd fetch users from an API
        const mockUsers = [
            { id: 5, email: 'member1@podium.com' },
            { id: 6, email: 'member2@podium.com' },
            { id: 7, email: 'member3@podium.com' },
            { id: 8, email: 'member4@podium.com' }
        ];
        setUsers(mockUsers);
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-md)'
        }} onClick={onClose}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)', color: 'var(--color-gray-900)' }}>
                    Ajouter un membre
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Utilisateur</label>
                        <select
                            className="input"
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
                    <div className="form-group">
                        <label className="label">Nom d'affichage</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Ex: Jean Dupont"
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Rôle dans l'équipe</label>
                        <select
                            className="input"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="member">Membre</option>
                            <option value="leader">Leader</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label">URL de l'avatar (optionnel)</label>
                        <input
                            type="url"
                            className="input"
                            value={formData.avatar_url}
                            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary">
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-md)'
        }} onClick={onClose}>
            <div className="card" style={{ width: '100%', maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)', color: 'var(--color-gray-900)' }}>
                    Nouvelle équipe
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Nom de l'équipe</label>
                        <input
                            type="text"
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Ex: Les Vainqueurs"
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Couleur de l'équipe</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{
                                    height: '48px',
                                    width: '80px',
                                    padding: '4px',
                                    border: '2px solid var(--color-gray-200)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '4px' }}>
                                    Couleur sélectionnée
                                </div>
                                <div style={{
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-gray-50)',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: 'var(--color-gray-700)'
                                }}>
                                    {color}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary">
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

    const handleDeleteTeam = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
            try {
                await teamsService.delete(id);
                await fetchTeams();
            } catch (error) {
                console.error('Error deleting team:', error);
                alert('Erreur lors de la suppression de l\'équipe');
            }
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

            <style>{`
                .member-delete-btn {
                    opacity: 0 !important;
                }
                div:hover > .member-delete-btn {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default Teams;
