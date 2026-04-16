import { useState } from 'react';
import { MapPin, Clock, Users, ArrowLeft, Star, CreditCard, MessageCircle, Share2, Check, X } from 'lucide-react';
import { matches } from '../data';

interface MatchDetailProps {
  matchId: string;
  onNavigate: (page: string, id?: string) => void;
}

export default function MatchDetail({ matchId, onNavigate }: MatchDetailProps) {
  const match = matches.find(m => m.id === matchId) || matches[0];
  const [joined, setJoined] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-TN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' });

  const spotsLeft = match.maxPlayers - match.currentPlayers;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <button onClick={() => onNavigate('matches')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Retour aux matchs
      </button>

      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{match.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                match.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                match.status === 'full' ? 'bg-amber-500/20 text-amber-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {match.status === 'open' ? '🟢 Ouvert' : match.status === 'full' ? '🟡 Complet' : match.status}
              </span>
              <span className="px-3 py-1 rounded-full bg-dark-lighter text-sm font-semibold">{match.type}</span>
            </div>
            <p className="text-slate-400">Organisé par <span className="text-white font-medium">{match.ownerName}</span></p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"><Share2 size={18} className="text-slate-400" /></button>
            <button onClick={() => onNavigate('chat')} className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"><MessageCircle size={18} className="text-slate-400" /></button>
          </div>
        </div>

        {match.description && <p className="text-slate-300 mt-4">{match.description}</p>}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="md:col-span-2 space-y-6">
          {/* Details cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Clock size={16} className="text-amber-400" />
                <span className="text-sm">Date & Heure</span>
              </div>
              <p className="font-semibold">{formatDate(match.datetime)}</p>
              <p className="text-emerald-400 font-semibold">{formatTime(match.datetime)} — {match.duration} min</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <MapPin size={16} className="text-emerald-400" />
                <span className="text-sm">Lieu</span>
              </div>
              <p className="font-semibold">{match.placeName}</p>
              <p className="text-sm text-slate-400">{match.placeAddress}, {match.placeCity}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Users size={16} className="text-blue-400" />
                <span className="text-sm">Joueurs</span>
              </div>
              <p className="font-semibold">{match.currentPlayers} / {match.maxPlayers}</p>
              <p className="text-sm text-slate-400">{spotsLeft > 0 ? `${spotsLeft} places restantes` : 'Complet'}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <CreditCard size={16} className="text-purple-400" />
                <span className="text-sm">Tarif</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{match.fee} <span className="text-sm">DT</span></p>
              <p className="text-sm text-slate-400">par joueur</p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="h-48 bg-dark-card relative flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-slate-400 text-sm">{match.placeName}</p>
                <p className="text-xs text-slate-500">{match.lat.toFixed(4)}°N, {match.lng.toFixed(4)}°E</p>
              </div>
              {/* Simulated map grid */}
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center animate-pulse">
                <MapPin size={16} className="text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Players list */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users size={18} className="text-emerald-400" />
              Joueurs ({match.currentPlayers}/{match.maxPlayers})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {match.players.map((player, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark/50 hover:bg-dark-lighter/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-lg">
                    {player.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{player.name}</p>
                    <p className="text-xs text-slate-400">{player.position}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-300">{player.rating.toFixed(1)}</span>
                    </div>
                    {player.paid ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check size={12} className="text-emerald-400" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Clock size={12} className="text-amber-400" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {/* Empty spots */}
              {Array.from({ length: spotsLeft }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-dark-border">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-dark-border flex items-center justify-center text-slate-500">
                    ?
                  </div>
                  <p className="text-sm text-slate-500">Place disponible</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — Join / Payment */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-emerald-400">{match.fee} <span className="text-lg">DT</span></p>
              <p className="text-sm text-slate-400">par joueur</p>
            </div>

            {!joined ? (
              <button
                onClick={() => setShowPayment(true)}
                disabled={match.status === 'full'}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  match.status === 'full'
                    ? 'bg-dark-lighter text-slate-500 cursor-not-allowed'
                    : 'btn-primary text-white'
                }`}
              >
                {match.status === 'full' ? 'Match Complet' : 'Rejoindre le Match'}
              </button>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check size={32} className="text-emerald-400" />
                </div>
                <p className="font-semibold text-emerald-400">Tu es inscrit ! ✅</p>
                <p className="text-sm text-slate-400 mt-1">RDV le jour du match</p>
              </div>
            )}

            {showPayment && !joined && (
              <div className="mt-4 space-y-3 animate-slide-up">
                <div className="glass rounded-xl p-4">
                  <p className="text-sm font-semibold mb-3">Paiement</p>
                  <div className="space-y-2">
                    {['💳 Carte bancaire', '📱 D17 / Flouci', '💰 Espèces sur place'].map((method, i) => (
                      <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark/50 cursor-pointer">
                        <input type="radio" name="payment" defaultChecked={i === 0} className="accent-emerald-500" />
                        <span className="text-sm">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setJoined(true); setShowPayment(false); }}
                    className="flex-1 py-3 rounded-xl btn-primary text-white font-semibold"
                  >
                    Confirmer ({match.fee} DT)
                  </button>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="px-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Total collecté</span>
                <span className="text-white font-medium">{match.players.filter(p => p.paid).length * match.fee} DT</span>
              </div>
              <div className="flex justify-between">
                <span>Joueurs payés</span>
                <span className="text-emerald-400 font-medium">{match.players.filter(p => p.paid).length}/{match.currentPlayers}</span>
              </div>
              <div className="flex justify-between">
                <span>Durée</span>
                <span className="text-white font-medium">{match.duration} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
