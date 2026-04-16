import { ArrowLeft, Trophy, MapPin, Calendar, Users, Play } from 'lucide-react';
import { tournaments } from '../data';
import type { BracketMatch } from '../types';

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
  const tournament = tournaments.find(t => t.id === tournamentId) || tournaments[0];
  const rounds = Math.max(...tournament.bracket.map(b => b.round), 0);
  const roundNames = ['', 'Quarts de finale', 'Demi-finales', 'Finale'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <button onClick={() => onNavigate('tournaments')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Retour aux tournois
      </button>

      {/* Header */}
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

      {/* Bracket */}
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
                    <div className="flex flex-col gap-4 justify-around" style={{ minHeight: round === 1 ? 'auto' : '100%' }}>
                      {roundMatches.map(match => (
                        <BracketMatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Champion slot */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-sm font-semibold text-amber-400 mb-4">🏆 Champion</h3>
                <div className="glass rounded-xl p-6 w-48 text-center">
                  <Trophy size={32} className="text-amber-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">À déterminer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Stream CTA */}
      {tournament.isLive && (
        <div className="glass rounded-2xl p-6 border border-red-500/30 bg-gradient-to-r from-red-500/5 to-amber-500/5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-red-400 font-semibold text-sm">FINALE EN DIRECT</span>
              </div>
              <h3 className="text-xl font-bold mb-1">FC Menzah 🔴 vs CO Manar 🟡</h3>
              <p className="text-slate-400 text-sm">La finale de la Coupe Ramadan 2026 est en cours ! Regarde le match en live.</p>
            </div>
            <button className="px-6 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2 transition-colors shrink-0">
              <Play size={20} /> Regarder le Live
            </button>
          </div>

          {/* Simulated live feed */}
          <div className="mt-4 p-4 rounded-xl bg-dark/70">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="text-2xl">🔴</span>
                  <p className="text-sm font-semibold mt-1">FC Menzah</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-3xl font-bold">1 — 1</p>
                  <p className="text-xs text-red-400 font-medium">⏱️ 67'</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl">🟡</span>
                  <p className="text-sm font-semibold mt-1">CO Manar</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                <span className="text-xs text-red-400 font-medium">LIVE</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2"><span className="text-slate-500">67'</span> ⚽ But de Ahmed (FC Menzah) — 1-1</div>
              <div className="flex items-center gap-2"><span className="text-slate-500">42'</span> ⚽ But de Firas (CO Manar) — 0-1</div>
              <div className="flex items-center gap-2"><span className="text-slate-500">35'</span> 🟨 Carton jaune — Karim (FC Menzah)</div>
              <div className="flex items-center gap-2"><span className="text-slate-500">0'</span> 🏁 Coup d'envoi</div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span>👁️ 234 spectateurs</span>
              <span>·</span>
              <span>💬 128 messages</span>
            </div>
          </div>
        </div>
      )}

      {/* Teams Grid */}
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
          {Array.from({ length: tournament.maxTeams - tournament.currentTeams }).map((_, i) => (
            <div key={`empty-${i}`} className="border-2 border-dashed border-dark-border rounded-xl p-4 text-center">
              <div className="text-2xl mb-2 text-slate-600">❓</div>
              <p className="text-sm text-slate-500">Place disponible</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
