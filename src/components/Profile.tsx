import { useEffect, useState } from 'react';
import { Calendar, Check, Edit2, Loader2, LogOut, MapPin, Settings, Star, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { User } from '../types';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { userProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<User>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditedProfile(userProfile);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) return;

    setSaving(true);
    try {
      await userService.updateUserProfile(userProfile.id, editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      onNavigate('landing');
    } catch (error) {
      console.error('Erreur deconnexion:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (!userProfile) return null;

  const badges = [
    { name: 'Top Scorer', icon: '🏆', desc: '10+ buts marques', earned: userProfile.goals >= 10 },
    { name: 'Fidele', icon: '💎', desc: '50+ matchs joues', earned: userProfile.matchesPlayed >= 50 },
    { name: 'Leader', icon: '👑', desc: 'Organise 10+ matchs', earned: false },
    { name: 'Social', icon: '🤝', desc: 'Invite 20+ amis', earned: false },
    { name: 'Marathonien', icon: '🏃', desc: '5 matchs / semaine', earned: false },
    { name: 'Fair-play', icon: '✨', desc: 'Note > 4.5', earned: userProfile.rating >= 4.5 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-amber-500/5" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-dark-lighter flex items-center justify-center text-4xl md:text-5xl border-4 border-emerald-500/20 shadow-xl">
              {userProfile.avatar}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-dark shadow-lg">
              <Edit2 size={14} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="bg-dark-card border border-emerald-500/50 rounded-lg px-3 py-1 text-2xl font-bold text-white outline-none"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold">{userProfile.name}</h1>
              )}
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider w-fit mx-auto md:mx-0">
                {userProfile.level}
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-emerald-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.city || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                    className="bg-dark-card border border-dark-border rounded px-2 py-0.5 outline-none focus:border-emerald-500"
                  />
                ) : (
                  userProfile.city
                )}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-amber-400" />
                Membre depuis {userProfile.joined}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.floor(userProfile.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : i < userProfile.rating
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-dark-border'}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-3 rounded-xl glass text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 rounded-xl glass text-slate-400 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Matchs', value: userProfile.matchesPlayed, icon: Calendar, color: 'text-emerald-400' },
          { label: 'Buts', value: userProfile.goals, icon: Star, color: 'text-amber-400' },
          { label: 'Passes', value: userProfile.assists, icon: Star, color: 'text-blue-400' },
          { label: 'Note', value: userProfile.rating.toFixed(1), icon: Star, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 text-center card-hover">
            <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full" />
              Informations
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Position</p>
                {isEditing ? (
                  <select
                    value={editedProfile.position || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, position: e.target.value })}
                    className="w-full mt-1 bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  >
                    {['Gardien', 'Defenseur', 'Milieu', 'Attaquant'].map((position) => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-medium">{userProfile.position}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Niveau</p>
                {isEditing ? (
                  <select
                    value={editedProfile.level || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, level: e.target.value as User['level'] })}
                    className="w-full mt-1 bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  >
                    {['Debutant', 'Intermediaire', 'Avance', 'Pro'].map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-medium">{userProfile.level}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Email</p>
                <p className="text-sm font-medium">{userProfile.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full p-4 rounded-2xl glass text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} /> Deconnexion
          </button>
        </div>

        <div className="md:col-span-2 glass rounded-2xl p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
            Badges & Succes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  badge.earned ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-dark/20 border-dark-border/30 grayscale opacity-50'
                }`}
              >
                <span className="text-3xl mb-2 block">{badge.icon}</span>
                <p className="text-sm font-bold">{badge.name}</p>
                <p className="text-[10px] text-slate-500 mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
