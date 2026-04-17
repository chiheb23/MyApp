import { MapPin, Clock, Users, ChevronRight, Trophy, TrendingUp, Calendar, Bell } from 'lucide-react';
import { tournaments, notifications, currentUser } from '../data';
import { matchService } from '../services/matchService';
import InitDataButton from './InitDataButton';
import { Match } from '../types';
import { useState, useEffect } from 'react';

interface DashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = matchService.subscribeToMatches((allMatches) => {
      const filtered = allMatches
        .filter(m => m.status === 'open' || m.status === 'full')
        .slice(0, 3);
      setUpcomingMatches(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeTournaments = tournaments.filter(t => t.status !== 'completed').slice(0, 2);
  const unreadNotifications = notifications.filter(n => !n.read);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('fr-TN', { weekday: 'short', day: 'numeric', month: 'short' });
  };
  const formatTime = (d: string) => {
    const date = new Date(d);
    return date.toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <InitDataButton />
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Salut {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Prêt pour ton prochain match ?</p>
        </div>
        <button
          onClick={() => onNavigate('create-match')}
          className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 w-fit"
        >
          <span className="text-xl">+</span> Créer un Match
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Matchs joués', value: currentUser.matchesPlayed, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Buts marqués', value: currentUser.goals, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Passes décisives', value: currentUser.assists, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Note', value: currentUser.rating.toFixed(1), icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 card-hover">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full" />
              Prochains Matchs
            </h2>
            <button onClick={() => onNavigate('matches')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : upcomingMatches.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center text-slate-400">
              Aucun match prévu pour le moment.
            </div>
          ) : upcomingMatches.map(match => (
            <div
              key={match.id}
              onClick={() => onNavigate('match-detail', match.id)}
              className="glass rounded-xl p-4 card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{match.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      match.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                      match.status === 'full' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {match.status === 'open' ? 'Ouvert' : match.status === 'full' ? 'Complet' : match.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-dark-lighter text-slate-300">
                      {match.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-emerald-400" />
                      {match.placeName}, {match.placeCity}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-amber-400" />
                      {formatDate(match.datetime)} · {formatTime(match.datetime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-blue-400" />
                      {match.currentPlayers}/{match.maxPlayers}
                    </span>
                  </div>

                  {/* Player avatars */}
                  <div className="flex items-center gap-1 mt-3">
                    {match.players.slice(0, 6).map((p, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-dark-lighter flex items-center justify-center text-xs border-2 border-dark-card -ml-1 first:ml-0">
                        {p.avatar}
                      </div>
                    ))}
                    {match.currentPlayers > 6 && (
                      <div className="w-7 h-7 rounded-full bg-dark-lighter flex items-center justify-center text-xs border-2 border-dark-card -ml-1 text-slate-400">
                        +{match.currentPlayers - 6}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-emerald-400">{match.fee} <span className="text-sm">DT</span></p>
                  <p className="text-xs text-slate-400">par joueur</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bell size={18} className="text-amber-400" />
                Notifications
                {unreadNotifications.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </h2>
            </div>

            <div className="space-y-2">
              {notifications.slice(0, 4).map(notif => (
                <div key={notif.id} className={`glass rounded-xl p-3 card-hover cursor-pointer ${!notif.read ? 'border-l-2 border-l-emerald-400' : ''}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">
                      {notif.type === 'match_invite' ? '📩' :
                       notif.type === 'payment' ? '💳' :
                       notif.type === 'tournament' ? '🏆' :
                       notif.type === 'match_confirmed' ? '✅' :
                       notif.type === 'chat' ? '💬' : '🔔'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-slate-400 truncate">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tournaments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                Tournois
              </h2>
              <button onClick={() => onNavigate('tournaments')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Voir tout <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {activeTournaments.map(t => (
                <div
                  key={t.id}
                  onClick={() => onNavigate('tournament-detail', t.id)}
                  className="glass rounded-xl p-4 card-hover cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{t.name}</h3>
                    {t.isLive && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" /> LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {t.city}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {t.currentTeams}/{t.maxTeams}</span>
                    <span className="text-amber-400 font-semibold">{t.prizePool} DT</span>
                  </div>
                  <div className="mt-3 w-full bg-dark rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${(t.currentTeams / t.maxTeams) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
