import { useState } from 'react';
import { MapPin, Clock, Users, Search, SlidersHorizontal } from 'lucide-react';
import { matches } from '../data';

interface MatchesProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function Matches({ onNavigate }: MatchesProps) {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const cities = ['all', ...new Set(matches.map(m => m.placeCity))];
  const types = ['all', '5v5', '7v7', '11v11'];

  const filtered = matches.filter(m => {
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.placeName.toLowerCase().includes(search.toLowerCase())) return false;
    if (cityFilter !== 'all' && m.placeCity !== cityFilter) return false;
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('fr-TN', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  const formatTime = (d: string) => new Date(d).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Matchs ⚽</h1>
          <p className="text-slate-400 mt-1">{filtered.length} matchs disponibles</p>
        </div>
        <button
          onClick={() => onNavigate('create-match')}
          className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 w-fit"
        >
          + Créer un Match
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un match, terrain..."
              value={search}
              onChange={e => setSearch(e.target.value)}
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

        {showFilters && (
          <div className="glass rounded-xl p-4 flex flex-wrap gap-4 animate-slide-up">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Ville</label>
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-dark-card text-white rounded-lg px-3 py-2 text-sm border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50">
                {cities.map(c => <option key={c} value={c}>{c === 'all' ? 'Toutes les villes' : c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-dark-card text-white rounded-lg px-3 py-2 text-sm border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50">
                {types.map(t => <option key={t} value={t}>{t === 'all' ? 'Tous les types' : t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Statut</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-dark-card text-white rounded-lg px-3 py-2 text-sm border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50">
                <option value="all">Tous</option>
                <option value="open">Ouvert</option>
                <option value="full">Complet</option>
              </select>
            </div>
            <button onClick={() => { setCityFilter('all'); setTypeFilter('all'); setStatusFilter('all'); setSearch(''); }} className="text-sm text-slate-400 hover:text-white self-end py-2">
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* Quick type filters */}
      <div className="flex gap-2 flex-wrap">
        {['Tous', '5v5', '7v7', '11v11'].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t === 'Tous' ? 'all' : t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              (t === 'Tous' && typeFilter === 'all') || typeFilter === t
                ? 'bg-emerald-500 text-white'
                : 'glass text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Match Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(match => (
          <div
            key={match.id}
            onClick={() => onNavigate('match-detail', match.id)}
            className="glass rounded-2xl p-5 card-hover cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
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
                <span className="px-3 py-1 rounded-lg bg-dark-lighter text-sm font-semibold">{match.type}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400 shrink-0" />
                <span className="truncate">{match.placeName}, {match.placeCity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-400 shrink-0" />
                <span>{formatDate(match.datetime)} · {formatTime(match.datetime)} · {match.duration}min</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-blue-400 shrink-0" />
                <span>{match.currentPlayers}/{match.maxPlayers} joueurs</span>
                <div className="flex-1 bg-dark rounded-full h-1.5 ml-2">
                  <div
                    className={`h-1.5 rounded-full transition-all ${match.currentPlayers >= match.maxPlayers ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(match.currentPlayers / match.maxPlayers) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-border">
              <div className="flex -space-x-2">
                {match.players.slice(0, 5).map((p, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-sm border-2 border-dark-card">
                    {p.avatar}
                  </div>
                ))}
                {match.currentPlayers > 5 && (
                  <div className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-xs border-2 border-dark-card text-slate-400">
                    +{match.currentPlayers - 5}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-emerald-400">{match.fee} <span className="text-sm">DT</span></p>
                {match.status === 'open' && (
                  <button className="px-4 py-2 rounded-lg btn-primary text-white text-sm font-semibold">
                    Rejoindre
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-semibold">Aucun match trouvé</p>
          <p className="text-slate-400 mt-1">Essaie de modifier tes filtres ou crée ton propre match !</p>
        </div>
      )}
    </div>
  );
}
