import { useState, useEffect } from 'react';
import { Users, Calendar, Trophy, MapPin, ArrowUp, DollarSign, Activity, BarChart3, Shield, Loader2 } from 'lucide-react';
import { matchService } from '../services/matchService';
import { tournamentService } from '../services/tournamentService';
import { userService } from '../services/userService';
import { Match, Tournament, User } from '../types';

interface AdminProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function Admin({ onNavigate }: AdminProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Note: En production, ces données devraient être agrégées via Cloud Functions
        // Pour le MVP Admin, on s'abonne aux collections principales
        const unsubMatches = matchService.subscribeToMatches(setMatches);
        const unsubTournaments = tournamentService.subscribeToTournaments(setTournaments);
        const unsubUsers = userService.subscribeToUsers(setUsers);

        return () => {
          unsubMatches();
          unsubTournaments();
          unsubUsers();
        };
      } catch (error) {
        console.error("Erreur Admin Fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = matches.reduce((acc, m) => acc + (m.fee * m.currentPlayers), 0);
  const activeMatches = matches.filter(m => m.status === 'open' || m.status === 'full').length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Shield size={28} className="text-emerald-400" /> Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Gestion réelle de la plateforme KooraTime</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Statut :</span>
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">Live</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Utilisateurs', value: users.length, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: 'Réel' },
          { label: 'Matchs actifs', value: activeMatches, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10', change: 'Firestore' },
          { label: 'Revenus (DT)', value: totalRevenue.toLocaleString(), icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10', change: 'Estimé' },
          { label: 'Tournois', value: tournaments.length, icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10', change: 'Actifs' },
        ].map((kpi, i) => (
          <div key={i} className="glass rounded-xl p-4 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Activity size={18} className="text-blue-400" /> Matchs récents
          </h3>
          <div className="space-y-3">
            {matches.slice(0, 5).map(match => (
              <div 
                key={match.id} 
                onClick={() => onNavigate('match', match.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark/50 hover:bg-dark-lighter/50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-lg">⚽</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{match.title}</p>
                  <p className="text-xs text-slate-400">{match.placeCity} · {match.type} · {match.currentPlayers}/{match.maxPlayers}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  match.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                  match.status === 'full' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {match.status === 'open' ? 'Ouvert' : match.status === 'full' ? 'Complet' : match.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Users size={18} className="text-purple-400" /> Utilisateurs récents
          </h3>
          <div className="space-y-3">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark/50 hover:bg-dark-lighter/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-lg">{user.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.city} · {user.level} · {user.position}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-xs text-amber-400">★</span>
                    <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{user.matchesPlayed} matchs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Tournaments */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" /> Tournois
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-dark-border">
                <th className="pb-3 font-medium">Nom</th>
                <th className="pb-3 font-medium">Ville</th>
                <th className="pb-3 font-medium">Équipes</th>
                <th className="pb-3 font-medium">Prize Pool</th>
                <th className="pb-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map(t => (
                <tr key={t.id} className="border-b border-dark-border/50 hover:bg-dark/30 cursor-pointer" onClick={() => onNavigate('tournament', t.id)}>
                  <td className="py-3 font-medium">{t.name}</td>
                  <td className="py-3 text-slate-400">{t.city}</td>
                  <td className="py-3">{t.currentTeams}/{t.maxTeams}</td>
                  <td className="py-3 text-amber-400 font-semibold">{t.prizePool} DT</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'registration' ? 'bg-blue-500/20 text-blue-400' :
                      t.status === 'in_progress' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {t.status === 'registration' ? 'Inscriptions' : t.status === 'in_progress' ? 'En cours' : 'Terminé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
