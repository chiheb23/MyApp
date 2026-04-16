import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard, Check, Info } from 'lucide-react';
import { places } from '../data';

interface CreateMatchProps {
  onNavigate: (page: string) => void;
}

export default function CreateMatch({ onNavigate }: CreateMatchProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    type: '5v5',
    date: '',
    time: '',
    duration: 90,
    maxPlayers: 10,
    fee: 15,
    placeId: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const maxPlayersMap: Record<string, number> = { '5v5': 10, '7v7': 14, '11v11': 22 };

  const handleTypeChange = (type: string) => {
    setForm({ ...form, type, maxPlayers: maxPlayersMap[type] });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="glass rounded-3xl p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center animate-count-up">
            <Check size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Match créé ! 🎉</h2>
          <p className="text-slate-400 mb-6">Ton match "{form.title}" a été publié. Les joueurs peuvent maintenant le rejoindre.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate('matches')} className="btn-primary px-6 py-3 rounded-xl text-white font-semibold">
              Voir mes matchs
            </button>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm({ title: '', type: '5v5', date: '', time: '', duration: 90, maxPlayers: 10, fee: 15, placeId: '', description: '' }); }} className="px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors">
              Créer un autre
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Retour
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Créer un Match ⚽</h1>
        <p className="text-slate-400 mt-1">Organise ton prochain match en quelques étapes</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              step >= s ? 'bg-emerald-500 text-white' : 'bg-dark-lighter text-slate-500'
            }`}>{s}</div>
            <span className={`text-sm hidden md:inline ${step >= s ? 'text-white' : 'text-slate-500'}`}>
              {s === 1 ? 'Infos' : s === 2 ? 'Terrain' : 'Confirmer'}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-dark-lighter'}`} />}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <label className="text-sm font-medium mb-2 block">Nom du match *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="ex: Match du Vendredi Soir"
                className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type de match *</label>
              <div className="grid grid-cols-3 gap-3">
                {['5v5', '7v7', '11v11'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`py-3 rounded-xl font-semibold text-center transition-all ${
                      form.type === type
                        ? 'bg-emerald-500 text-white'
                        : 'bg-dark-card text-slate-400 border border-dark-border hover:border-emerald-500/50'
                    }`}
                  >
                    {type}
                    <p className="text-xs mt-1 opacity-70">{maxPlayersMap[type]} joueurs</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2"><Calendar size={14} /> Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2"><Clock size={14} /> Heure *</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2"><Clock size={14} /> Durée</label>
                <select
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>120 min</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2"><CreditCard size={14} /> Tarif (DT)</label>
                <input
                  type="number"
                  value={form.fee}
                  onChange={e => setForm({ ...form, fee: Number(e.target.value) })}
                  min={0}
                  className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description (optionnel)</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Détails supplémentaires..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500 resize-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.title || !form.date || !form.time}
              className="w-full py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant — Choisir le terrain
            </button>
          </div>
        )}

        {/* Step 2 — Place selection */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-up">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin size={18} className="text-emerald-400" /> Choisir le terrain
            </h3>

            <div className="space-y-3">
              {places.map(place => (
                <div
                  key={place.id}
                  onClick={() => setForm({ ...form, placeId: place.id })}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    form.placeId === place.id
                      ? 'bg-emerald-500/10 border-2 border-emerald-500'
                      : 'bg-dark/50 border-2 border-transparent hover:border-dark-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{place.image}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{place.name}</h4>
                        <p className="text-emerald-400 font-bold">{place.pricePerHour} DT/h</p>
                      </div>
                      <p className="text-sm text-slate-400">{place.address}, {place.city}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {place.amenities.slice(0, 4).map((a, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-dark-lighter text-slate-300">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors">
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.placeId}
                className="flex-1 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant — Confirmer
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Summary */}
        {step === 3 && (
          <div className="space-y-5 animate-slide-up">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Check size={18} className="text-emerald-400" /> Résumé du match
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Nom', value: form.title, icon: '⚽' },
                { label: 'Type', value: form.type, icon: '👥' },
                { label: 'Date', value: form.date, icon: '📅' },
                { label: 'Heure', value: form.time, icon: '🕐' },
                { label: 'Durée', value: `${form.duration} min`, icon: '⏱️' },
                { label: 'Joueurs max', value: form.maxPlayers, icon: '🏃' },
                { label: 'Tarif', value: `${form.fee} DT`, icon: '💰' },
                { label: 'Terrain', value: places.find(p => p.id === form.placeId)?.name || '—', icon: '🏟️' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span>{item.icon}</span> {item.label}
                  </span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            {form.description && (
              <div className="p-3 rounded-xl bg-dark/50">
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-sm">{form.description}</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-300">
                  Le coût de réservation du terrain ({places.find(p => p.id === form.placeId)?.pricePerHour} DT/h) sera réparti entre les joueurs inscrits.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors">
                Retour
              </button>
              <button
                onClick={() => setSubmitted(true)}
                className="flex-1 py-3 rounded-xl btn-primary text-white font-semibold"
              >
                🚀 Publier le Match
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
