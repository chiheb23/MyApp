import { MapPin, Clock, Users, ChevronRight, Trophy, TrendingUp, Calendar, Bell, Loader2, Navigation, CheckCircle2 } from 'lucide-react';
import { tournaments, notifications, currentUser } from '../data';
import { matchService, calculateDistance } from '../services/matchService';
import { Match } from '../types';
import { useState, useEffect } from 'react';
import InitDataButton from './InitDataButton';

interface DashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [upcomingMatches, setUpcomingMatches] = useState<(Match & { distance?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Récupérer la position de l'utilisateur
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const unsubscribe = matchService.subscribeToMatches((allMatches) => {
      let matchesWithDistance = allMatches.map(m => {
        if (userLocation) {
          return { ...m, distance: calculateDistance(userLocation.lat, userLocation.lng, m.lat, m.lng) };
        }
        return m;
      });

      if (userLocation) {
        matchesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      const filtered = matchesWithDistance
        .filter(m => m.status === 'open' || m.status === 'full')
        .slice(0, 3);
        
      setUpcomingMatches(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userLocation]);

  const handleQuickJoin = async (e: React.MouseEvent, match: Match) => {
    e.stopPropagation(); // Empêcher la navigation vers le détail
    if (match.status !== 'open') return;
    
    setJoiningId(match.id);
    try {
      await matchService.joinMatch(match.id, {
        userId: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        position: currentUser.position,
        rating: currentUser.rating,
        paid: false
      });
      // Succès : le listener temps réel mettra à jour l'UI
    } catch (error) {
      console.error("Erreur lors du join rapide:", error);
      alert("Erreur lors de l'inscription.");
    } finally {
      setJoiningId(null);
    }
  };

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
          className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 w-fit shadow-lg shadow-emerald-500/20"
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
              {userLocation ? 'Matchs à proximité' : 'Prochains Matchs'}
            </h2>
            <button onClick={() => onNavigate('matches')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : upcomingMatches.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center text-slate-400">
              Aucun match prévu pour le moment.
            </div>
          ) : upcomingMatches.map(match => {
            const isFull = match.currentPlayers >= match.maxPlayers;
            const isJoined = match.players.some(p => p.userId === currentUser.id);
            const placesLeft = match.maxPlayers - match.currentPlayers;

            return (
              <div
                key={match.id}
                onClick={() => onNavigate('match-detail', match.id)}
                className="glass rounded-xl p-4 card-hover cursor-pointer relative overflow-hidden group border border-transparent hover:border-emerald-500/30"
              >
                {match.distance !== undefined && (
                  <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-bl-xl text-[10px] font-bold flex items-center gap-1">
                    <Navigation size={10} /> {match.distance.toFixed(1)} km
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate group-hover:text-emerald-400 transition-colors">{match.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isFull ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {isFull ? 'Complet' : `${placesLeft} places`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-emerald-400" />
                        {match.placeName}
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
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-emerald-400">{match.fee} <span className="text-sm">DT</span></p>
                    </div>
                    
                    {isJoined ? (
                      <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                        <CheckCircle2 size={16} /> Inscrit
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleQuickJoin(e, match)}
                        disabled={isFull || joiningId === match.id}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                          isFull 
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'
                        }`}
                      >
                        {joiningId === match.id ? <Loader2 className="animate-spin" size={16} /> : 'REJOINDRE'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
