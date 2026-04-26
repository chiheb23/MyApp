import { useEffect, useState } from 'react';
import { MapPin, Clock, Users, Search, SlidersHorizontal, Loader2, CheckCircle2, CircleAlert, Navigation } from 'lucide-react';
import { matchService, calculateDistance } from '../services/matchService';
import { Match } from '../types';
import { useAuth } from '../hooks/useAuth';

interface MatchesProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function Matches({ onNavigate }: MatchesProps) {
  const { userProfile, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
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
    const unsubscribe = matchService.subscribeToMatches((allMatches) => {
      setMatches(allMatches);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const cities = ['all', ...new Set(matches.map((match) => match.placeCity))];
  const types = ['all', '5v5', '7v7', '11v11'];

  const filtered = matches
    .map((match) => ({
      ...match,
      distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, match.lat, match.lng) : undefined
    }))
    .filter((match) => {
      if (search && !match.title.toLowerCase().includes(search.toLowerCase()) && !match.placeName.toLowerCase().includes(search.toLowerCase())) return false;
      if (cityFilter !== 'all' && match.placeCity !== cityFilter) return false;
      if (typeFilter !== 'all' && match.type !== typeFilter) return false;
      if (statusFilter !== 'all' && match.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER));

  const formatDate = (dateValue: string) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString('fr-TN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatTime = (dateValue: string) =>
    new Date(dateValue).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' });

  const handleJoin = async (event: React.MouseEvent, match: Match) => {
    event.stopPropagation();
    if (!userProfile || match.status !== 'open') return;

    setJoiningId(match.id);
    try {
      await matchService.joinMatch(match.id);
      setFeedback({ type: 'success', message: `Tu as rejoint "${match.title}".` });
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setFeedback({ type: 'error', message: "Impossible de rejoindre ce match." });
    } finally {
      setJoiningId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Matchs</h1>
          <p className="text-slate-400 mt-1">{filtered.length} matchs disponibles</p>
        </div>
        <button
          onClick={() => onNavigate('create-match')}
          className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 w-fit"
        >
          + Creer un Match
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un match ou un terrain"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass bg-dark-card text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl glass flex items-center gap-2 transition-colors ${showFilters ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            <SlidersHorizontal size={18} />
            <span className="hidden md:inline">Filtres</span>
          </button>
        </div>

        {showFilters ? (
          <div className="glass rounded-xl p-4 flex flex-wrap gap-4 animate-slide-up">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Ville</label>
              <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)} className="bg-dark-card text-white rounded-lg px-3 py-2 text-sm border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50">
                {cities.map((city) => <option key={city} value={city}>{city === 'all' ? 'Toutes les villes' : city}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Type</label>
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="bg-dark-card text-white rounded-lg px-3 py-2 text-sm border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50">
                {types.map((type) => <option key={type} value={type}>{type === 'all' ? 'Tous les types' : type}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Statut</label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="bg-dark-card text-white rounded-lg px-3 py-2 text-sm border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50">
                <option value="all">Tous</option>
                <option value="open">Ouvert</option>
                <option value="full">Complet</option>
              </select>
            </div>
            <button onClick={() => { setCityFilter('all'); setTypeFilter('all'); setStatusFilter('all'); setSearch(''); }} className="text-sm text-slate-400 hover:text-white self-end py-2">
              Reinitialiser
            </button>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((match) => {
            const isJoined = Boolean(userProfile && match.players.some((player) => player.userId === userProfile.id));
            const isOpen = match.status === 'open';
            const isFull = match.status === 'full' || match.currentPlayers >= match.maxPlayers;

            return (
              <div
                key={match.id}
                onClick={() => onNavigate('match-detail', match.id)}
                className="glass rounded-2xl p-5 cursor-pointer group border border-transparent hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{match.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        match.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                        match.status === 'full' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {match.status === 'open' ? 'Ouvert' : match.status === 'full' ? 'Complet' : match.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">par {match.ownerName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {match.distance !== undefined ? (
                      <p className="text-xs text-emerald-300 flex items-center gap-1 justify-end">
                        <Navigation size={12} /> {match.distance.toFixed(1)} km
                      </p>
                    ) : null}
                    <span className="mt-2 inline-flex px-3 py-1 rounded-lg bg-dark-lighter text-sm font-semibold">{match.type}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{match.placeName}, {match.placeCity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-amber-400 shrink-0" />
                    <span>{formatDate(match.datetime)} · {formatTime(match.datetime)} · {match.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-blue-400 shrink-0" />
                    <span>{match.currentPlayers}/{match.maxPlayers} joueurs</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-border gap-3">
                  <div className="flex -space-x-2">
                    {match.players.slice(0, 5).map((player, index) => (
                      <div key={`${player.userId}-${index}`} className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-sm border-2 border-dark-card">
                        {player.avatar}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-emerald-400">{match.fee} DT</p>
                    {isJoined ? (
                      <div className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
                        Inscrit
                      </div>
                    ) : (
                      <button
                        onClick={(event) => handleJoin(event, match)}
                        disabled={!isOpen || isFull || joiningId === match.id}
                        className="px-4 py-2 rounded-lg btn-primary text-white text-sm font-semibold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {joiningId === match.id ? <Loader2 className="animate-spin" size={16} /> : 'Rejoindre'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-semibold">Aucun match trouve</p>
          <p className="text-slate-400 mt-1">Essaie de modifier tes filtres ou cree ton propre match.</p>
        </div>
      ) : null}
    </div>
  );
}
