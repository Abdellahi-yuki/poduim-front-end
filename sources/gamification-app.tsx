import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Users, CheckCircle, Clock, Plus, Filter, Search, Star, Award, TrendingUp } from 'lucide-react';

// Données initiales simulées
const initialData = {
  teams: [
    { id: 1, name: 'Les Innovateurs', color: '#3b82f6', members: [] },
    { id: 2, name: 'Team Alpha', color: '#10b981', members: [] },
    { id: 3, name: 'Les Warriors', color: '#f59e0b', members: [] }
  ],
  members: [
    { id: 1, teamId: 1, name: 'Alice Martin', role: 'Développeur', avatarUrl: '👩‍💻' },
    { id: 2, teamId: 1, name: 'Bob Chen', role: 'Designer', avatarUrl: '👨‍🎨' },
    { id: 3, teamId: 2, name: 'Claire Dubois', role: 'Chef de projet', avatarUrl: '👩‍💼' },
    { id: 4, teamId: 2, name: 'David Kumar', role: 'Développeur', avatarUrl: '👨‍💻' },
    { id: 5, teamId: 3, name: 'Emma Wilson', role: 'Analyste', avatarUrl: '👩‍🔬' },
    { id: 6, teamId: 3, name: 'Frank Lopez', role: 'QA', avatarUrl: '👨‍🔧' }
  ],
  tasks: [
    { id: 1, teamId: 1, memberId: 1, title: 'Développer API REST', description: 'Créer endpoints CRUD', points: 50, difficulty: 'Moyen', priority: 'Haute', status: 'validated', deadline: '2025-12-10', createdAt: '2025-12-01' },
    { id: 2, teamId: 1, memberId: 2, title: 'Maquettes UI/UX', description: 'Design système complet', points: 40, difficulty: 'Moyen', priority: 'Haute', status: 'validated', deadline: '2025-12-08', createdAt: '2025-12-01' },
    { id: 3, teamId: 2, memberId: 3, title: 'Planning Sprint', description: 'Organiser sprint 3', points: 20, difficulty: 'Facile', priority: 'Moyenne', status: 'done', deadline: '2025-12-05', createdAt: '2025-12-02' },
    { id: 4, teamId: 2, memberId: 4, title: 'Tests unitaires', description: 'Couvrir 80% du code', points: 60, difficulty: 'Difficile', priority: 'Haute', status: 'doing', deadline: '2025-12-15', createdAt: '2025-12-03' },
    { id: 5, teamId: 3, memberId: 5, title: 'Analyse données', description: 'Rapport mensuel', points: 30, difficulty: 'Facile', priority: 'Moyenne', status: 'validated', deadline: '2025-12-06', createdAt: '2025-12-01' }
  ],
  pointsLog: []
};

const GameApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [teams, setTeams] = useState(initialData.teams);
  const [members, setMembers] = useState(initialData.members);
  const [tasks, setTasks] = useState(initialData.tasks);
  const [pointsLog, setPointsLog] = useState(initialData.pointsLog);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAdmin] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Calcul des scores
  const calculateTeamScore = (teamId) => {
    return tasks
      .filter(t => t.teamId === teamId && t.status === 'validated')
      .reduce((sum, t) => sum + t.points, 0);
  };

  const calculateMemberScore = (memberId) => {
    return tasks
      .filter(t => t.memberId === memberId && t.status === 'validated')
      .reduce((sum, t) => sum + t.points, 0);
  };

  const leaderboard = teams.map(team => ({
    ...team,
    score: calculateTeamScore(team.id),
    completedTasks: tasks.filter(t => t.teamId === team.id && t.status === 'validated').length,
    totalTasks: tasks.filter(t => t.teamId === team.id).length
  })).sort((a, b) => b.score - a.score);

  // Données graphique
  const chartData = [
    { day: 'Lun', points: 110 },
    { day: 'Mar', points: 150 },
    { day: 'Mer', points: 180 },
    { day: 'Jeu', points: 200 },
    { day: 'Ven', points: 220 },
    { day: 'Sam', points: 240 },
    { day: 'Dim', points: 260 }
  ];

  // Validation de tâche
  const validateTask = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: 'validated', validatedAt: new Date().toISOString() } : task
      )
    );
  };

  // Changer statut tâche
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6" role="main" aria-label="Tableau de bord principal">
      <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" role="region" aria-label="Statistiques globales">
        <StatCard 
          icon={<Users className="w-6 h-6" aria-hidden="true" />}
          label="Équipes actives"
          value={teams.length}
          color="bg-blue-500"
        />
        <StatCard 
          icon={<CheckCircle className="w-6 h-6" aria-hidden="true" />}
          label="Tâches validées"
          value={tasks.filter(t => t.status === 'validated').length}
          color="bg-green-500"
        />
        <StatCard 
          icon={<Clock className="w-6 h-6" aria-hidden="true" />}
          label="Tâches en cours"
          value={tasks.filter(t => t.status === 'doing').length}
          color="bg-yellow-500"
        />
        <StatCard 
          icon={<Trophy className="w-6 h-6" aria-hidden="true" />}
          label="Points totaux"
          value={leaderboard.reduce((sum, t) => sum + t.score, 0)}
          color="bg-purple-500"
        />
      </div>

      {/* Graphique évolution */}
      <section className="bg-white rounded-lg shadow-md p-6" aria-labelledby="chart-title">
        <h2 id="chart-title" className="text-xl font-semibold mb-4 text-gray-900">Évolution des points cette semaine</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="points" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Top 3 */}
      <section className="bg-white rounded-lg shadow-md p-6" aria-labelledby="top3-title">
        <h2 id="top3-title" className="text-xl font-semibold mb-4 text-gray-900">Top 3 des équipes</h2>
        <div className="space-y-3">
          {leaderboard.slice(0, 3).map((team, idx) => (
            <div 
              key={team.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              role="listitem"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-600'
                }`} aria-label={`Position ${idx + 1}`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-600">{team.completedTasks}/{team.totalTasks} tâches</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: team.color }}>{team.score}</p>
                <p className="text-sm text-gray-600">points</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accès rapides */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Accès rapides">
        <QuickAction 
          label="Voir le classement"
          icon={<Trophy className="w-6 h-6" aria-hidden="true" />}
          onClick={() => setCurrentView('leaderboard')}
        />
        <QuickAction 
          label="Gérer les équipes"
          icon={<Users className="w-6 h-6" aria-hidden="true" />}
          onClick={() => setCurrentView('teams')}
        />
        <QuickAction 
          label="Gérer les tâches"
          icon={<CheckCircle className="w-6 h-6" aria-hidden="true" />}
          onClick={() => setCurrentView('tasks')}
        />
      </section>
    </div>
  );

  // Leaderboard View
  const LeaderboardView = () => (
    <div className="space-y-6" role="main" aria-label="Classement des équipes">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Classement</h1>
        <div className="flex gap-2" role="group" aria-label="Filtres temporels">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Aujourd'hui</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Semaine</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Total</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full" role="table" aria-label="Tableau du classement">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rang</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tâches</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((team, idx) => (
              <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                    idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full" style={{ backgroundColor: team.color }}></div>
                    <span className="font-semibold text-gray-900">{team.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-2xl font-bold" style={{ color: team.color }}>{team.score}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${team.totalTasks ? (team.completedTasks / team.totalTasks * 100) : 0}%`,
                        backgroundColor: team.color 
                      }}
                      role="progressbar"
                      aria-valuenow={team.totalTasks ? Math.round(team.completedTasks / team.totalTasks * 100) : 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`Progression de ${team.name}`}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">
                    {team.totalTasks ? Math.round(team.completedTasks / team.totalTasks * 100) : 0}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {team.completedTasks}/{team.totalTasks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Teams View
  const TeamsView = () => (
    <div className="space-y-6" role="main" aria-label="Gestion des équipes">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Équipes</h1>
        {isAdmin && (
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => { setModalType('team'); setShowModal(true); }}
            aria-label="Créer une nouvelle équipe"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            Créer une équipe
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaderboard.map(team => {
          const teamMembers = members.filter(m => m.teamId === team.id);
          return (
            <article 
              key={team.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => { setSelectedTeam(team.id); setCurrentView('teamDetail'); }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') { setSelectedTeam(team.id); setCurrentView('teamDetail'); }}}
              aria-label={`Voir détails de ${team.name}`}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: team.color }}>
                    {team.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{team.name}</h2>
                    <p className="text-gray-600">{teamMembers.length} membres</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{team.totalTasks ? Math.round(team.completedTasks / team.totalTasks * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${team.totalTasks ? (team.completedTasks / team.totalTasks * 100) : 0}%`,
                        backgroundColor: team.color 
                      }}
                      role="progressbar"
                      aria-valuenow={team.totalTasks ? Math.round(team.completedTasks / team.totalTasks * 100) : 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold" style={{ color: team.color }}>{team.score}</span>
                  <span className="text-gray-600">points</span>
                </div>

                <div className="mt-4 flex -space-x-2">
                  {teamMembers.slice(0, 4).map(member => (
                    <div 
                      key={member.id}
                      className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm"
                      title={member.name}
                    >
                      {member.avatarUrl}
                    </div>
                  ))}
                  {teamMembers.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs text-white font-semibold">
                      +{teamMembers.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );

  // Team Detail View
  const TeamDetailView = () => {
    const team = teams.find(t => t.id === selectedTeam);
    if (!team) return null;

    const teamMembers = members.filter(m => m.teamId === selectedTeam);
    const teamTasks = tasks.filter(t => t.teamId === selectedTeam);
    const teamScore = calculateTeamScore(selectedTeam);

    return (
      <div className="space-y-6" role="main" aria-label={`Détails de l'équipe ${team.name}`}>
        <button 
          onClick={() => setCurrentView('teams')}
          className="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
          aria-label="Retour aux équipes"
        >
          ← Retour aux équipes
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: team.color }}>
                {team.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                <p className="text-gray-600">{teamMembers.length} membres • {teamScore} points</p>
              </div>
            </div>
            {isAdmin && (
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => { setModalType('task'); setShowModal(true); }}
              >
                Attribuer une tâche
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tâches validées</p>
              <p className="text-2xl font-bold text-gray-900">{teamTasks.filter(t => t.status === 'validated').length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{teamTasks.filter(t => t.status === 'doing').length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Taux de complétion</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamTasks.length ? Math.round(teamTasks.filter(t => t.status === 'validated').length / teamTasks.length * 100) : 0}%
              </p>
            </div>
          </div>

          <section aria-labelledby="members-title">
            <h2 id="members-title" className="text-xl font-semibold mb-4 text-gray-900">Membres de l'équipe</h2>
            <div className="space-y-3">
              {teamMembers.map(member => {
                const memberTasks = tasks.filter(t => t.memberId === member.id);
                const memberScore = calculateMemberScore(member.id);
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{member.avatarUrl}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: team.color }}>{memberScore} pts</p>
                      <p className="text-sm text-gray-600">
                        {memberTasks.filter(t => t.status === 'validated').length}/{memberTasks.length} tâches
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  };

  // Tasks View
  const TasksView = () => {
    const filteredTasks = tasks.filter(task => {
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    return (
      <div className="space-y-6" role="main" aria-label="Gestion des tâches">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tâches</h1>
          {isAdmin && (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => { setModalType('task'); setShowModal(true); }}
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              Créer une tâche
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search-tasks" className="sr-only">Rechercher une tâche</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                id="search-tasks"
                type="text"
                placeholder="Rechercher une tâche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="filter-status" className="sr-only">Filtrer par statut</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="todo">À faire</option>
              <option value="doing">En cours</option>
              <option value="done">Terminé</option>
              <option value="validated">Validé</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map(task => {
            const member = members.find(m => m.id === task.memberId);
            const team = teams.find(t => t.id === task.teamId);
            
            const statusColors = {
              todo: 'bg-gray-200 text-gray-700',
              doing: 'bg-blue-100 text-blue-700',
              done: 'bg-yellow-100 text-yellow-700',
              validated: 'bg-green-100 text-green-700'
            };

            const statusLabels = {
              todo: 'À faire',
              doing: 'En cours',
              done: 'Terminé',
              validated: 'Validé'
            };

            const priorityColors = {
              'Haute': 'text-red-600',
              'Moyenne': 'text-yellow-600',
              'Basse': 'text-green-600'
            };

            return (
              <article key={task.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Assigné à:</span>
                    <div className="flex items-center gap-1">
                      <span>{member?.avatarUrl}</span>
                      <span className="font-medium text-gray-900">{member?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Équipe:</span>
                    <span className="font-medium" style={{ color: team?.color }}>{team?.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-semibold ${priorityColors[task.priority]}`}>
                      Priorité: {task.priority}
                    </span>
                    <span className="text-gray-600">Points: {task.points}</span>
                    <span className="text-gray-600">Difficulté: {task.difficulty}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    Deadline: {new Date(task.deadline).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="flex gap-2">
                  {task.status === 'todo' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'doing')}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Démarrer
                    </button>
                  )}
                  {task.status === 'doing' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'done')}
                      className="flex-1 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Marquer terminé
                    </button>
                  )}
                  {task.status === 'done' && isAdmin && (
                    <button
                      onClick={() => validateTask(task.id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      ✓ Valider et attribuer {task.points} points
                    </button>
                  )}
                  {task.status === 'validated' && (
                    <div className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg text-center font-semibold">
                      ✓ Validé - {task.points} points attribués
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  };

  // Components
  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6" role="region" aria-label={label}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ label, icon, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={label}
    >
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
          {icon}
        </div>
        <span className="text-lg font-semibold text-gray-900">{label}</span>
      </div>
    </button>
  );

  // Navigation
  const Navigation = () => (
    <nav className="bg-white shadow-md mb-6" role="navigation" aria-label="Navigation principale">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-blue-600" aria-hidden="true" />
            <h1 className="text-xl font-bold text-gray-900">GameChallenge</h1>
          </div>
          <div className="flex gap-1" role="menubar">
            <NavButton 
              label="Dashboard" 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')}
            />
            <NavButton 
              label="Classement" 
              active={currentView === 'leaderboard'} 
              onClick={() => setCurrentView('leaderboard')}
            />
            <NavButton 
              label="Équipes" 
              active={currentView === 'teams'} 
              onClick={() => setCurrentView('teams')}
            />
            <NavButton 
              label="Tâches" 
              active={currentView === 'tasks'} 
              onClick={() => setCurrentView('tasks')}
            />
          </div>
        </div>
      </div>
    </nav>
  );

  const NavButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      aria-current={active ? 'page' : undefined}
      role="menuitem"
    >
      {label}
    </button>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'leaderboard' && <LeaderboardView />}
        {currentView === 'teams' && <TeamsView />}
        {currentView === 'teamDetail' && <TeamDetailView />}
        {currentView === 'tasks' && <TasksView />}
      </main>
    </div>
  );
};

export default GameApp;
