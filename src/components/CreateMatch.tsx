import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard, Check, Loader2, Sparkles, SlidersHorizontal, CircleAlert } from 'lucide-react';
import PlaceMapPicker from './PlaceMapPicker';
import { useAuth } from '../hooks/useAuth';
import { matchService } from '../services/matchService';
import { placeService } from '../services/placeService';
import { Place } from '../types';

interface CreateMatchProps {
  onNavigate: (page: string) => void;
}

export default function CreateMatch({ onNavigate }: CreateMatchProps) {
  const { userProfile, loading: authLoading } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
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
    lat: 36.8355,
    lng: 10.1656,
  });

  const maxPlayersMap: Record<string, number> = { '5v5': 10, '7v7': 14, '11v11': 22 };

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
        setLocating(false);
      },
      (error) => {
        console.error('Erreur de geolocalisation:', error);
        setLocating(false);
      }
    );
  }, []);

  useEffect(() => {
    const unsubscribe = placeService.subscribeToPlaces(setPlaces);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === form.placeId) || null,
    [form.placeId, places]
  );

  const isQuickReady = Boolean(form.placeId && form.date && form.time);
  const isStepOneReady = Boolean(form.title && form.date && form.time);

  const handleTypeChange = (type: string) => {
    setForm((prev) => ({ ...prev, type, maxPlayers: maxPlayersMap[type] }));
  };

  const handlePlaceSelect = (place: Place) => {
    setForm((prev) => ({
      ...prev,
      placeId: place.id,
      lat: place.lat,
      lng: place.lng,
      title: prev.title || `Match ${place.city} ${prev.time || ''}`.trim(),
    }));
  };

  const handleSubmit = async () => {
    if (!userProfile) return;

    setIsSubmitting(true);
    try {
      if (!places.some((place) => place.id === form.placeId)) {
        throw new Error('Terrain introuvable');
      }

      const matchData = {
        title: form.title || `Match ${selectedPlace?.city || ''} ${form.time}`.trim(),
        placeId: form.placeId,
        datetime: `${form.date}T${form.time}:00`,
        duration: form.duration,
        maxPlayers: form.maxPlayers,
        fee: form.fee,
        type: form.type as '5v5' | '7v7' | '11v11',
        description: form.description
      };

      await matchService.createMatch(matchData);
      setSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de la creation du match:', error);
      setFeedback('Impossible de creer le match pour le moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (!userProfile) return null;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="glass rounded-3xl p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center animate-count-up">
            <Check size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Match cree</h2>
          <p className="text-slate-400 mb-6">Ton match est en ligne. Les joueurs peuvent le rejoindre maintenant.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate('matches')} className="btn-primary px-6 py-3 rounded-xl text-white font-semibold">
              Voir les matchs
            </button>
            <button onClick={() => { setSubmitted(false); setStep(1); }} className="px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors">
              En creer un autre
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Retour
      </button>

      {feedback ? (
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3 border bg-red-500/10 border-red-500/20 text-red-300">
          <CircleAlert size={18} />
          <p className="text-sm font-medium">{feedback}</p>
        </div>
      ) : null}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Creer un match</h1>
          <p className="text-slate-400 mt-1">Mode rapide pour publier en moins de 30 secondes, mode avance si tu veux affiner.</p>
        </div>
        <div className="inline-flex rounded-2xl bg-dark-card border border-dark-border p-1">
          <button
            onClick={() => setMode('quick')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === 'quick' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
          >
            <span className="inline-flex items-center gap-2"><Sparkles size={14} /> Rapide</span>
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === 'advanced' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
          >
            <span className="inline-flex items-center gap-2"><SlidersHorizontal size={14} /> Avance</span>
          </button>
        </div>
      </div>

      {locating ? (
        <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
          <Loader2 size={12} className="animate-spin" /> Localisation...
        </div>
      ) : null}

      {mode === 'quick' ? (
        <div className="glass rounded-3xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><Calendar size={14} /> Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><Clock size={14} /> Heure</label>
              <input
                type="time"
                value={form.time}
                onChange={(event) => setForm({ ...form, time: event.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {['5v5', '7v7', '11v11'].map((type) => (
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
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><Clock size={14} /> Duree</label>
              <select
                value={form.duration}
                onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><CreditCard size={14} /> Tarif</label>
              <input
                type="number"
                value={form.fee}
                onChange={(event) => setForm({ ...form, fee: Number(event.target.value) })}
                min={0}
                className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold flex items-center gap-2"><MapPin size={18} className="text-emerald-400" /> Choisir un terrain</h2>
                <p className="text-sm text-slate-400 mt-1">Selectionne juste un terrain pour publier rapidement.</p>
              </div>
              {selectedPlace ? (
                <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                  {selectedPlace.name}
                </div>
              ) : null}
            </div>

            <PlaceMapPicker
              places={places}
              selectedPlaceId={form.placeId}
              center={{ lat: form.lat, lng: form.lng }}
              onSelectPlace={handlePlaceSelect}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isQuickReady || isSubmitting}
            className="w-full py-4 rounded-2xl btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
            {isSubmitting ? 'Publication...' : 'Publier ce match rapidement'}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((currentStep) => (
              <div key={currentStep} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step >= currentStep ? 'bg-emerald-500 text-white' : 'bg-dark-lighter text-slate-500'
                }`}>{currentStep}</div>
                <span className={`text-sm hidden md:inline ${step >= currentStep ? 'text-white' : 'text-slate-500'}`}>
                  {currentStep === 1 ? 'Infos' : currentStep === 2 ? 'Terrain' : 'Confirmer'}
                </span>
                {currentStep < 3 ? <div className={`flex-1 h-0.5 ${step > currentStep ? 'bg-emerald-500' : 'bg-dark-lighter'}`} /> : null}
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            {step === 1 ? (
              <div className="space-y-5 animate-slide-up">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nom du match</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    placeholder="ex: Match du vendredi soir"
                    className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type de match</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['5v5', '7v7', '11v11'].map((type) => (
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
                    <label className="text-sm font-medium mb-2 flex items-center gap-2"><Calendar size={14} /> Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(event) => setForm({ ...form, date: event.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2"><Clock size={14} /> Heure</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(event) => setForm({ ...form, time: event.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2"><Clock size={14} /> Duree</label>
                    <select
                      value={form.duration}
                      onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value={60}>60 min</option>
                      <option value={90}>90 min</option>
                      <option value={120}>120 min</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2"><CreditCard size={14} /> Tarif</label>
                    <input
                      type="number"
                      value={form.fee}
                      onChange={(event) => setForm({ ...form, fee: Number(event.target.value) })}
                      min={0}
                      className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="Details supplementaires..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-dark-card text-white border border-dark-border outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500 resize-none"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!isStepOneReady}
                  className="w-full py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant - Choisir le terrain
                </button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5 animate-slide-up">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-400" /> Choisir le terrain
                </h3>

                <PlaceMapPicker
                  places={places}
                  selectedPlaceId={form.placeId}
                  center={{ lat: form.lat, lng: form.lng }}
                  onSelectPlace={handlePlaceSelect}
                />

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors">
                    Retour
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.placeId}
                    className="flex-1 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant - Confirmer
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5 animate-slide-up">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Check size={18} className="text-emerald-400" /> Resume du match
                </h3>

                <div className="space-y-3">
                  {[
                    { label: 'Nom', value: form.title, icon: '⚽' },
                    { label: 'Type', value: form.type, icon: '👥' },
                    { label: 'Date', value: form.date, icon: '📅' },
                    { label: 'Heure', value: form.time, icon: '🕐' },
                    { label: 'Duree', value: `${form.duration} min`, icon: '⏱' },
                    { label: 'Joueurs max', value: form.maxPlayers, icon: '🏃' },
                    { label: 'Tarif', value: `${form.fee} DT`, icon: '💰' },
                    { label: 'Terrain', value: selectedPlace?.name || '-', icon: '🏟' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-slate-400 text-sm">{item.label}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors">
                    Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : null}
                    {isSubmitting ? 'Creation...' : 'Confirmer et publier'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
