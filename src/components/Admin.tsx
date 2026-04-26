import { useEffect, useMemo, useState } from 'react';
import { Calendar, Loader2, MapPin, Plus, Shield, Trash2, Trophy, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { matchService } from '../services/matchService';
import { placeService } from '../services/placeService';
import { tournamentService } from '../services/tournamentService';
import { Match, Place, Tournament } from '../types';

interface AdminProps {
  onNavigate: (page: string, id?: string) => void;
}

const emptyPlaceForm = {
  name: '',
  city: '',
  address: '',
  phone: '',
  pricePerHour: 120,
  rating: 4.5,
  image: '🏟️',
  amenities: 'Parking, Vestiaires, Eclairage',
  lat: 36.8065,
  lng: 10.1815,
};

export default function Admin({ onNavigate }: AdminProps) {
  const { userProfile, loading: authLoading } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [creatingPlace, setCreatingPlace] = useState(false);
  const [archivingTournamentId, setArchivingTournamentId] = useState<string | null>(null);
  const [placeForm, setPlaceForm] = useState(emptyPlaceForm);

  useEffect(() => {
    if (!userProfile) return;

    const unsubscribePlaces = placeService.subscribeToAdminPlaces(userProfile.id, (adminPlaces) => {
      setPlaces(adminPlaces);
      setLoadingPlaces(false);
    });

    const unsubscribeTournaments = tournamentService.subscribeToTournaments(setTournaments);

    return () => {
      unsubscribePlaces();
      unsubscribeTournaments();
    };
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile) return;

    const placeIds = places.map((place) => place.id);
    const unsubscribeMatches = matchService.subscribeToMatchesByPlaceIds(placeIds, setMatches);

    return () => unsubscribeMatches();
  }, [places, userProfile]);

  const totalRevenue = useMemo(
    () => matches.reduce((acc, match) => acc + match.fee * match.currentPlayers, 0),
    [matches],
  );

  const activePlaces = places.filter((place) => place.isActive !== false).length;

  const handleCreatePlace = async () => {
    if (!userProfile || !placeForm.name || !placeForm.address || !placeForm.city) return;

    setCreatingPlace(true);
    try {
      await placeService.createPlace({
        adminId: userProfile.id,
        adminName: userProfile.name,
        name: placeForm.name,
        city: placeForm.city,
        address: placeForm.address,
        phone: placeForm.phone,
        pricePerHour: Number(placeForm.pricePerHour),
        rating: Number(placeForm.rating),
        image: placeForm.image,
        amenities: placeForm.amenities.split(',').map((item) => item.trim()).filter(Boolean),
        lat: Number(placeForm.lat),
        lng: Number(placeForm.lng),
        isActive: true,
        createdAt: new Date().toISOString(),
      });

      setPlaceForm(emptyPlaceForm);
    } catch (error) {
      console.error('Erreur lors de la creation du terrain:', error);
      alert("Impossible d'ajouter le terrain pour le moment.");
    } finally {
      setCreatingPlace(false);
    }
  };

  const handleArchiveTournament = async (tournamentId: string) => {
    if (!userProfile) return;

    setArchivingTournamentId(tournamentId);
    try {
      await tournamentService.archiveTournament(tournamentId, userProfile.id);
    } catch (error) {
      console.error("Erreur lors de l'archivage du tournoi:", error);
      alert("Impossible d'archiver le tournoi pour le moment.");
    } finally {
      setArchivingTournamentId(null);
    }
  };

  if (authLoading || loadingPlaces) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Shield size={28} className="text-emerald-400" /> Espace Admin Terrain
          </h1>
          <p className="text-slate-400 mt-1">Consultez vos terrains, les matchs associes et archivez les tournois sans les supprimer.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
          Connecte en tant que {userProfile.name}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Mes terrains', value: activePlaces, icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Matchs sur mes terrains', value: matches.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Revenus estimes', value: `${totalRevenue.toLocaleString()} DT`, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Tournois actifs', value: tournaments.length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((item, index) => (
          <div key={index} className="glass rounded-2xl p-4 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                <item.icon size={20} />
              </div>
            </div>
            <p className="text-xl font-bold">{item.value}</p>
            <p className="text-xs text-slate-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-6">
        <div className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-emerald-400" />
            <h2 className="text-lg font-bold">Mes terrains</h2>
          </div>

          {places.length === 0 ? (
            <div className="rounded-xl bg-dark/40 p-5 text-slate-400 text-sm">
              Aucun terrain relie a cet admin pour le moment. Utilisez le formulaire a droite pour en ajouter un.
            </div>
          ) : (
            <div className="grid gap-4">
              {places.map((place) => (
                <div key={place.id} className="rounded-2xl border border-dark-border bg-dark/40 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">{place.image} {place.name}</p>
                      <p className="text-sm text-slate-400 mt-1">{place.address}, {place.city}</p>
                      <p className="text-xs text-slate-500 mt-2">Coordonnees: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">{place.pricePerHour} DT/h</p>
                      <p className="text-xs text-slate-500 mt-1">{place.rating.toFixed(1)} / 5</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {place.amenities.map((amenity) => (
                      <span key={amenity} className="px-2 py-1 rounded-full bg-dark-lighter text-xs text-slate-300">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-blue-400" />
              <h3 className="font-bold">Matchs sur mes terrains</h3>
            </div>

            {matches.length === 0 ? (
              <div className="rounded-xl bg-dark/40 p-4 text-sm text-slate-400">
                Aucun match n'est encore programme sur vos terrains.
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => onNavigate('match-detail', match.id)}
                    className="w-full text-left rounded-xl bg-dark/40 hover:bg-dark-lighter/40 transition-colors p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{match.title}</p>
                        <p className="text-sm text-slate-400 mt-1">{match.placeName} · {match.currentPlayers}/{match.maxPlayers} joueurs</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-emerald-400 font-semibold">{match.fee} DT</p>
                        <p className="text-slate-500 mt-1">{new Date(match.datetime).toLocaleDateString('fr-TN')}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Plus size={18} className="text-emerald-400" />
              <h2 className="text-lg font-bold">Ajouter un terrain</h2>
            </div>

            <div className="grid gap-3">
              <input
                type="text"
                value={placeForm.name}
                onChange={(e) => setPlaceForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du terrain"
                className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={placeForm.city}
                onChange={(e) => setPlaceForm((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Ville"
                className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={placeForm.address}
                onChange={(e) => setPlaceForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Adresse"
                className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={placeForm.lat}
                  onChange={(e) => setPlaceForm((prev) => ({ ...prev, lat: Number(e.target.value) }))}
                  placeholder="Latitude"
                  className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  value={placeForm.lng}
                  onChange={(e) => setPlaceForm((prev) => ({ ...prev, lng: Number(e.target.value) }))}
                  placeholder="Longitude"
                  className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={placeForm.pricePerHour}
                  onChange={(e) => setPlaceForm((prev) => ({ ...prev, pricePerHour: Number(e.target.value) }))}
                  placeholder="Tarif / heure"
                  className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  step="0.1"
                  value={placeForm.rating}
                  onChange={(e) => setPlaceForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  placeholder="Note"
                  className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
                />
              </div>
              <input
                type="text"
                value={placeForm.phone}
                onChange={(e) => setPlaceForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Telephone"
                className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={placeForm.amenities}
                onChange={(e) => setPlaceForm((prev) => ({ ...prev, amenities: e.target.value }))}
                placeholder="Equipements separes par des virgules"
                className="px-4 py-3 rounded-xl bg-dark-card border border-dark-border outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleCreatePlace}
                disabled={creatingPlace}
                className="btn-primary py-3 rounded-xl text-white font-semibold disabled:opacity-60"
              >
                {creatingPlace ? 'Creation...' : 'Ajouter ce terrain'}
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 size={18} className="text-amber-400" />
              <h2 className="text-lg font-bold">Archiver un tournoi</h2>
            </div>

            {tournaments.length === 0 ? (
              <div className="rounded-xl bg-dark/40 p-4 text-sm text-slate-400">
                Aucun tournoi actif a archiver.
              </div>
            ) : (
              <div className="space-y-3">
                {tournaments.map((tournament) => (
                  <div key={tournament.id} className="rounded-xl bg-dark/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{tournament.name}</p>
                        <p className="text-sm text-slate-400 mt-1">{tournament.city} · {tournament.currentTeams}/{tournament.maxTeams} equipes</p>
                      </div>
                      <button
                        onClick={() => handleArchiveTournament(tournament.id)}
                        disabled={archivingTournamentId === tournament.id}
                        className="px-3 py-2 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors disabled:opacity-60"
                      >
                        {archivingTournamentId === tournament.id ? 'Archivage...' : 'Archiver'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
