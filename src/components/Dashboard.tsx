import { useEffect, useMemo, useState } from 'react';
import { MapPin, Clock, Users, ChevronRight, Trophy, TrendingUp, Calendar, Bell, Loader2, Navigation, CheckCircle2, Plus, CircleAlert } from 'lucide-react';
import { matchService, calculateDistance } from '../services/matchService';
import { notificationService } from '../services/notificationService';
import { tournamentService } from '../services/tournamentService';
import { Match, Tournament, Notification as AppNotification } from '../types';
import { useAuth } from '../hooks/useAuth';
import InitDataButton from './InitDataButton';

interface DashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { userProfile } = useAuth();
  const [nearbyMatches, setNearbyMatches] = useState<(Match & { distance?: number })[]>([]);
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Erreur de geolocalisation:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    if (!userProfile) return;

    const unsubscribeMatches = matchService.subscribeToMatches((allMatches) => {
      const matchesWithDistance: (Match & { distance?: number })[] = allMatches
        .filter((match) => match.status === 'open' || match.status === 'full')
        .map((match) => {
          if (!userLocation) return { ...match, distance: undefined };
          return {
            ...match,
            distance: calculateDistance(userLocation.lat, userLocation.lng, match.lat, match.lng)
          };
        })
        .sort((a, b) => (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER))
        .slice(0, 4);

      setNearbyMatches(matchesWithDistance);
      setLoading(false);
    });

    const unsubscribeTournaments = tournamentService.subscribeToTournaments((allTournaments) => {
      setActiveTournaments(allTournaments.filter((tournament) => tournament.status !== 'completed').slice(0, 2));
    });

    const unsubscribeNotifications = notificationService.subscribeToNotifications(userProfile.id, (allNotifications) => {
      setNotifications(allNotifications);
    });

    return () => {
      unsubscribeMatches();
      unsubscribeTournaments();
      unsubscribeNotifications();
    };
  }, [userLocation, userProfile]);

  const unreadNotifications = notifications.filter((notification) => !notification.read);
  const nextOpenMatch = nearbyMatches.find((match) => match.status === 'open');

  const stats = useMemo(() => ([
    { label: 'Matchs joues', value: userProfile?.matchesPlayed ?? 0, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Buts', value: userProfile?.goals ?? 0, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Passes', value: userProfile?.assists ?? 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Note', value: userProfile?.rating?.toFixed(1) ?? '0.0', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]), [userProfile]);

  const handleQuickJoin = async (event: React.MouseEvent, match: Match) => {
    event.stopPropagation();
    if (!userProfile || match.status !== 'open') return;

    setJoiningId(match.id);
    try {
      await matchService.joinMatch(match.id);
      setFeedback({ type: 'success', message: `Inscription confirmee pour "${match.title}".` });
    } catch (error) {
      console.error("Erreur lors du join rapide:", error);
      setFeedback({ type: 'error', message: "Impossible de rejoindre ce match maintenant." });
    } finally {
      setJoiningId(null);
    }
  };

  const formatDate = (dateValue: string) =>
    new Date(dateValue).toLocaleDateString('fr-TN', { weekday: 'short', day: 'numeric', month: 'short' });
  const formatTime = (dateValue: string) =>
    new Date(dateValue).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' });

  if (!userProfile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <InitDataButton />

      {feedback ? (
        <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 border ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            : 'bg-red-500/10 border-red-500/20 text-red-300'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      ) : null}

      <section className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Navigation size={12} />
              {userLocation ? 'Matchs tries par distance' : 'Active le GPS pour des matchs proches'}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Trouve ton prochain match vite.</h1>
              <p className="text-slate-400 mt-2 max-w-2xl">
                L’objectif est simple: voir les matchs proches et rejoindre en quelques secondes.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 min-w-0 lg:min-w-[360px]">
            <button
              onClick={() => onNavigate('matches')}
              className="rounded-2xl bg-dark-card border border-dark-border px-4 py-4 text-left hover:border-emerald-500/40 transition-colors"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">Le plus rapide</p>
              <p className="font-semibold mt-1">Voir les matchs proches</p>
              <p className="text-sm text-slate-400 mt-1">{nearbyMatches.length} options disponibles</p>
            </button>
            <button
              onClick={() => onNavigate('create-match')}
              className="rounded-2xl bg-emerald-500 text-white px-4 py-4 text-left hover:bg-emerald-600 transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <Plus size={18} />
                <p className="font-semibold">Creer un match rapide</p>
              </div>
              <p className="text-sm text-emerald-50/90 mt-2">Lieu, heure, joueurs. Le reste est optionnel.</p>
            </button>
          </div>
        </div>

        {nextOpenMatch ? (
          <button
            onClick={() => onNavigate('match-detail', nextOpenMatch.id)}
            className="mt-6 w-full rounded-2xl bg-dark-card border border-dark-border px-5 py-4 text-left hover:border-emerald-500/30 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-300">A rejoindre maintenant</p>
                <h2 className="text-xl font-bold mt-1">{nextOpenMatch.title}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-emerald-400" /> {nextOpenMatch.placeName}</span>
                  <span className="flex items-center gap-1"><Clock size={14} className="text-amber-400" /> {formatDate(nextOpenMatch.datetime)} · {formatTime(nextOpenMatch.datetime)}</span>
                  <span className="flex items-center gap-1"><Users size={14} className="text-blue-400" /> {nextOpenMatch.currentPlayers}/{nextOpenMatch.maxPlayers}</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-slate-500">{nextOpenMatch.distance !== undefined ? `${nextOpenMatch.distance.toFixed(1)} km` : 'A proximite'}</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{nextOpenMatch.fee} DT</p>
              </div>
            </div>
          </button>
        ) : null}
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass rounded-xl p-4 card-hover">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-emerald-500 rounded-full" />
                {userLocation ? 'Matchs pres de toi' : 'Matchs a rejoindre'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">Action directe, sans passer par un parcours long.</p>
            </div>
            <button onClick={() => onNavigate('matches')} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : nearbyMatches.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center text-slate-400">
              Aucun match disponible pour le moment.
            </div>
          ) : nearbyMatches.map((match) => {
            const isFull = match.currentPlayers >= match.maxPlayers;
            const isJoined = match.players.some((player) => player.userId === userProfile.id);
            const placesLeft = match.maxPlayers - match.currentPlayers;

            return (
              <div
                key={match.id}
                onClick={() => onNavigate('match-detail', match.id)}
                className="glass rounded-2xl p-4 cursor-pointer relative overflow-hidden group border border-transparent hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate group-hover:text-emerald-400 transition-colors">{match.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                        isFull ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {isFull ? 'Complet' : `${placesLeft} places`}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-2 text-sm text-slate-400 mt-3">
                      <span className="flex items-center gap-1"><MapPin size={14} className="text-emerald-400" /> {match.placeName}</span>
                      <span className="flex items-center gap-1"><Clock size={14} className="text-amber-400" /> {formatDate(match.datetime)} · {formatTime(match.datetime)}</span>
                      <span className="flex items-center gap-1"><Users size={14} className="text-blue-400" /> {match.currentPlayers}/{match.maxPlayers}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500">{match.distance !== undefined ? `${match.distance.toFixed(1)} km` : 'A proximite'}</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{match.fee} DT</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex -space-x-2">
                    {match.players.slice(0, 4).map((player, index) => (
                      <div key={`${player.userId}-${index}`} className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-sm border-2 border-dark-card">
                        {player.avatar}
                      </div>
                    ))}
                  </div>

                  {isJoined ? (
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 size={16} /> Inscrit
                    </div>
                  ) : (
                    <button
                      onClick={(event) => handleQuickJoin(event, match)}
                      disabled={isFull || joiningId === match.id}
                      className={`min-w-[150px] px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                        isFull
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                      }`}
                    >
                      {joiningId === match.id ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Rejoindre'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bell size={18} className="text-amber-400" />
                Notifications
              </h2>
              {unreadNotifications.length > 0 ? (
                <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                  {unreadNotifications.length}
                </span>
              ) : null}
            </div>

            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune notification pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 4).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => notificationService.markAsRead(notification.id)}
                    className={`w-full text-left rounded-xl p-3 transition-colors ${
                      !notification.read ? 'bg-emerald-500/8 border border-emerald-500/15' : 'bg-dark/40 hover:bg-dark-lighter/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-lg">
                        {notification.type === 'match_invite' ? '📩' :
                          notification.type === 'payment' ? '💳' :
                            notification.type === 'tournament' ? '🏆' :
                              notification.type === 'match_confirmed' ? '✅' :
                                notification.type === 'chat' ? '💬' : '🔔'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
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
              {activeTournaments.map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() => onNavigate('tournament-detail', tournament.id)}
                  className="w-full text-left glass rounded-xl p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{tournament.name}</h3>
                    {tournament.isLive ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" /> LIVE
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {tournament.city}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {tournament.currentTeams}/{tournament.maxTeams}</span>
                    <span className="text-amber-400 font-semibold">{tournament.prizePool} DT</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
