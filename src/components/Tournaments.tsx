import { useState, useEffect } from 'react';
import { MapPin, Calendar, Trophy, ArrowRight, Loader2 } from 'lucide-react';
import { tournamentService } from '../services/tournamentService';
import { Tournament } from '../types';

interface TournamentsProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function Tournaments({ onNavigate }: TournamentsProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = tournamentService.subscribeToTournaments((data) => {
      setTournaments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tournois 🏆</h1>
          <p className="text-slate-400 mt-1">{tournaments.length} tournois disponibles</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 w-fit">
          + Organiser un Tournoi
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tournaments.map(t => (
          <div
            key={t.id}
            onClick={() => onNavigate('tournament-detail', t.id)}
            className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
          >
            {/* Header */}
            <div className={`p-6 relative ${
              t.status === 'in_progress'
                ? 'bg-gradient-to-r from-emerald-500/20 to-amber-500/20'
                : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {t.isLive && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/30 text-red-400 text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" /> LIVE
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'registration' ? 'bg-blue-500/20 text-blue-400' :
                      t.status === 'in_progress' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {t.status === 'registration' ? 'Inscriptions ouvertes' :
                       t.status === 'in_progress' ? 'En cours' : 'Terminé'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{t.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">par {t.organizerName}</p>
                </div>
                <div className="text-right">
                  <Trophy size={32} className="text-amber-400 mb-1" />
                  <p className="text-lg font-bold text-amber-400">{t.prizePool} DT</p>
                  <p className="text-xs text-slate-400">Prize Pool</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold">{t.type}</p>
                  <p className="text-xs text-slate-400">Format</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{t.currentTeams}/{t.maxTeams}</p>
                  <p className="text-xs text-slate-400">Équipes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-400">{t.entryFee} DT</p>
                  <p className="text-xs text-slate-400">Inscription</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-emerald-400" /> {t.city}</span>
                <span className="flex items-center gap-1"><Calendar size={14} className="text-amber-400" /> {new Date(t.startDate).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })} — {new Date(t.endDate).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })}</span>
              </div>

              {/* Teams preview */}
              <div className="flex items-center gap-2">
                {t.teams.slice(0, 8).map((team, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-sm" title={team.name}>
                    {team.logo}
                  </div>
                ))}
                {t.currentTeams > 8 && (
                  <span className="text-xs text-slate-400">+{t.currentTeams - 8}</span>
                )}
              </div>

              <div className="w-full bg-dark rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                  style={{ width: `${(t.currentTeams / t.maxTeams) * 100}%` }}
                />
              </div>

              <button className="w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2">
                {t.status === 'registration' ? "S'inscrire" : 'Voir le bracket'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
