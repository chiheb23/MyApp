import { Star, MapPin, Calendar, TrendingUp, Award, Edit, Shield, ChevronRight } from 'lucide-react';
import { currentUser } from '../data';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile(_props: ProfileProps) {

  const statsData = [
    { label: 'Matchs', value: currentUser.matchesPlayed, icon: '⚽', trend: '+5 ce mois' },
    { label: 'Buts', value: currentUser.goals, icon: '🥅', trend: '+3 ce mois' },
    { label: 'Passes D.', value: currentUser.assists, icon: '🎯', trend: '+2 ce mois' },
    { label: 'Note', value: currentUser.rating.toFixed(1), icon: '⭐', trend: '+0.1' },
  ];

  const badges = [
    { name: 'Top Scorer', icon: '🏆', desc: '10+ buts en un mois', earned: true },
    { name: 'Fidèle', icon: '💎', desc: '50+ matchs joués', earned: true },
    { name: 'Leader', icon: '👑', desc: 'Organisé 10+ matchs', earned: true },
    { name: 'Social', icon: '🤝', desc: 'Invité 20+ amis', earned: false },
    { name: 'Marathonien', icon: '🏃', desc: '5 matchs en une semaine', earned: false },
    { name: 'Streak', icon: '🔥', desc: '10 matchs d\'affilée', earned: false },
  ];

  const recentActivity = [
    { text: 'A rejoint "Match du Vendredi Soir"', time: 'Il y a 2h', icon: '⚽' },
    { text: 'A marqué 2 buts vs FC Lac', time: 'Hier', icon: '🥅' },
    { text: 'A créé un match à El Menzah', time: 'Il y a 3 jours', icon: '➕' },
    { text: 'A reçu le badge "Top Scorer" 🏆', time: 'Il y a 1 semaine', icon: '🏆' },
    { text: 'Note mise à jour : 4.5 ⭐', time: 'Il y a 2 semaines', icon: '⭐' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-amber-500/10" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-dark-lighter flex items-center justify-center text-5xl border-4 border-emerald-500/30">
                {currentUser.avatar}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <Edit size={14} className="text-white" />
              </button>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-dark-card">
                <span className="text-xs">✓</span>
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <div className="flex items-center gap-3 justify-center sm:justify-start mt-2 text-sm text-slate-400 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-emerald-400" /> {currentUser.city}</span>
                <span className="flex items-center gap-1"><Shield size={14} className="text-blue-400" /> {currentUser.level}</span>
                <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {currentUser.rating}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start mt-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">{currentUser.position}</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">{currentUser.level}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(currentUser.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : i < currentUser.rating
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-dark-border'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center card-hover">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="text-xs text-emerald-400 mt-1">{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Performance chart placeholder */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" /> Performance
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Buts / match', value: (currentUser.goals / currentUser.matchesPlayed).toFixed(2), pct: 65, color: 'bg-emerald-500' },
              { label: 'Passes / match', value: (currentUser.assists / currentUser.matchesPlayed).toFixed(2), pct: 52, color: 'bg-blue-500' },
              { label: 'Victoires', value: '62%', pct: 62, color: 'bg-amber-500' },
              { label: 'Présence', value: '95%', pct: 95, color: 'bg-purple-500' },
              { label: 'Fair-play', value: '4.8/5', pct: 96, color: 'bg-cyan-500' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{stat.label}</span>
                  <span className="font-medium">{stat.value}</span>
                </div>
                <div className="w-full bg-dark rounded-full h-2">
                  <div className={`h-2 rounded-full ${stat.color} transition-all`} style={{ width: `${stat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Award size={18} className="text-amber-400" /> Badges
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, i) => (
              <div
                key={i}
                className={`rounded-xl p-3 text-center transition-all ${
                  badge.earned
                    ? 'bg-dark/50 card-hover cursor-pointer'
                    : 'bg-dark/20 opacity-40'
                }`}
              >
                <p className="text-2xl mb-1">{badge.icon}</p>
                <p className="text-xs font-semibold">{badge.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-blue-400" /> Activité récente
        </h3>
        <div className="space-y-3">
          {recentActivity.map((act, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark/50 transition-colors">
              <span className="text-lg">{act.icon}</span>
              <div className="flex-1">
                <p className="text-sm">{act.text}</p>
                <p className="text-xs text-slate-500">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings links */}
      <div className="glass rounded-2xl overflow-hidden">
        {[
          { label: 'Modifier le profil', icon: Edit, color: 'text-emerald-400' },
          { label: 'Paramètres de notification', icon: Calendar, color: 'text-amber-400' },
          { label: 'Méthodes de paiement', icon: Shield, color: 'text-blue-400' },
          { label: 'Confidentialité & sécurité', icon: Shield, color: 'text-purple-400' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-4 hover:bg-dark/50 cursor-pointer transition-colors border-b border-dark-border last:border-0">
            <item.icon size={18} className={item.color} />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <ChevronRight size={16} className="text-slate-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
