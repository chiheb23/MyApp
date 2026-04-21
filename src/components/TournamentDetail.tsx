import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, MapPin, Calendar, Users, Play, Loader2 } from 'lucide-react';
import { tournamentService } from '../services/tournamentService';
import { Tournament, BracketMatch } from '../types';
import { useAuth } from '../hooks/useAuth';

interface TournamentDetailProps {
  tournamentId: string;
  onNavigate: (page: string) => void;
}

function BracketMatchCard({ match }: { match: BracketMatch }) {
  return (
    <div className={`glass rounded-xl p-3 w-56 shrink-0 ${match.isLive ? 'border border-red-500/50 animate-pulse-glow' : ''}`}>
      {match.isLive && (
        <div className="flex items-center gap-1 mb-2">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
          <span className="text-xs text-red-400 font-semibold">EN DIRECT</span>
        </div>
      )}
      <div className={`flex items-center justify-between p-2 rounded-lg mb-1 ${match.winner === match.team1?.name ? 'bg-emerald-500/10' : 'bg-dark/50'}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{match.team1?.logo || '❓'}</span>
          <span className={`text-sm font-medium ${match.winner === match.team1?.name ? 'text-emerald-400' : ''}`}>
            {match.team1?.name || 'TBD'}
          </span>
        </div>
        <span className={`text-lg font-bold ${match.winner === match.team1?.name ? 'text-emerald-400' : 'text-slate-400'}`}>
          {match.team1?.score ?? '—'}
        </span>
      </div>
      <div className={`flex items-center justify-between p-2 rounded-lg ${match.winner === match.team2?.name ? 'bg-emerald-500/10' : 'bg-dark/50'}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{match.team2?.logo || '❓'}</span>
          <span className={`text-sm font-medium ${match.winner === match.team2?.name ? 'text-emerald-400' : ''}`}>
            {match.team2?.name || 'TBD'}
          </span>
        </div>
        <span className={`text-lg font-bold ${match.winner === match.team2?.name ? 'text-emerald-400' : 'text-slate-400'}`}>
          {match.team2?.score ?? '—'}
        </span>
      </div>
    </div>
  );
}

export default function TournamentDetail({ tournamentId, onNavigate }: TournamentDetailProps) {
  const { userProfile, loading: authLoading } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) return;
    const unsubscribe = tournamentService.subscribeToTournament(tournamentId, (data) => {
      setTournament(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [tournamentId]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-slate-400">Tournoi non trouvé.</p>
        <button onClick={() => onNavigate('tournaments')} className="mt-4 btn-primary px-6 py-2 rounded-xl text-white">
          Retour aux tournois
        </button>
      </div>
    );
  }

  const rounds = tournament.bracket.length > 0 ? Math.max(...tournament.bracket.map(b => b.round), 0) : 0;
  const roundNames = ['', 'Quarts de finale', 'Demi-finales', 'Finale'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <button onClick={() => onNavigate('tournaments')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Retour aux tournois
      </button>

      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold">{tournament.name}</h1>
              {tournament.isLive && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" /> LIVE
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                tournament.status === 'registration' ? 'bg-blue-500/20 text-blue-400' :
                tournament.status === 'in_progress' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {tournament.status === 'registration' ? 'Inscriptions' :
                 tournament.status === 'in_progress' ? 'En cours' : 'Terminé'}
              </span>
            </div>
            <p className="text-slate-400">Organisé par <span className="text-white font-medium">{tournament.organizerName}</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Trophy size={24} className="text-amber-400" />
              <span className="text-3xl font-bold text-amber-400">{tournament.prizePool} DT</span>
            </div>
            <p className="text-sm text-slate-400">Prize Pool</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <Users size={16} className="text-blue-400 mx-auto mb-1" />
            <p className="font-bold">{tournament.currentTeams}/{tournament.maxTeams}</p>
            <p className="text-xs text-slate-400">Équipes</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <MapPin size={16} className="text-emerald-400 mx-auto mb-1" />
            <p className="font-bold">{tournament.city}</p>
            <p className="text-xs text-slate-400">Ville</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <Calendar size={16} className="text-amber-400 mx-auto mb-1" />
            <p className="font-bold text-sm">{new Date(tournament.startDate).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })}</p>
            <p className="text-xs text-slate-400">Début</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <span className="text-amber-400 block mb-1">💰</span>
            <p className="font-bold">{tournament.entryFee} DT</p>
            <p className="text-xs text-slate-400">Inscription</p>
          </div>
        </div>
      </div>

      {tournament.bracket.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            Bracket
          </h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-8 min-w-max">
              {Array.from({ length: rounds }, (_, r) => r + 1).map(round => {
                const roundMatches = tournament.bracket.filter(b => b.round === round);
                return (
                  <div key={round} className="space-y-4">
                    <h3 className="text-sm font-semibold text-center text-slate-400 mb-4">
                      {roundNames[round] || `Round ${round}`}
                    </h3>
                    <div className="flex flex-col gap-4 justify-around">
                      {roundMatches.map(match => (
                        <BracketMatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users size={20} className="text-blue-400" />
          Équipes ({tournament.currentTeams})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tournament.teams.map((team, i) => (
            <div key={i} className="bg-dark/50 rounded-xl p-4 text-center card-hover cursor-pointer">
              <div className="text-3xl mb-2">{team.logo}</div>
              <p className="font-semibold text-sm">{team.name}</p>
              <p className="text-xs text-slate-400 mt-1">Seed #{team.seed}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
