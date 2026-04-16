import { Users, Calendar, Trophy, MapPin, ArrowUp, DollarSign, Activity, BarChart3, Shield } from 'lucide-react';
import { adminStats, matches, tournaments, users } from '../data';

interface AdminProps {
  onNavigate: (page: string) => void;
}

export default function Admin(_props: AdminProps) {
  const revenueData = adminStats.revenueByMonth;
  const maxRevenue = Math.max(...revenueData.map(r => r.revenue));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Shield size={28} className="text-emerald-400" /> Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Vue d'ensemble de la plateforme KooraTime</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Dernière mise à jour :</span>
          <span className="text-xs text-emerald-400">Aujourd'hui, 14:30</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Utilisateurs', value: adminStats.totalUsers.toLocaleString(), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: `+${adminStats.weeklyGrowth}%` },
          { label: 'Matchs actifs', value: adminStats.activeMatches, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10', change: `${adminStats.matchesThisWeek} cette semaine` },
          { label: 'Revenus (DT)', value: adminStats.totalRevenue.toLocaleString(), icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10', change: '+18% vs mois dernier' },
          { label: 'Tournois', value: adminStats.activeTournaments, icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10', change: '2 en cours' },
        ].map((kpi, i) => (
          <div key={i} className="glass rounded-xl p-4 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ArrowUp size={12} /> {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="font-bold mb-1 flex items-center gap-2">
            <BarChart3 size={18} className="text-emerald-400" /> Revenus mensuels
          </h3>
          <p className="text-xs text-slate-400 mb-6">Évolution sur les 6 derniers mois</p>

          <div className="flex items-end gap-3 h-48">
            {revenueData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400">{d.revenue}</span>
                <div className="w-full relative group">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500/80 to-emerald-400/80 transition-all duration-500 group-hover:from-emerald-400 group-hover:to-emerald-300"
                    style={{ height: `${(d.revenue / maxRevenue) * 150}px` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-1 flex items-center gap-2">
            <MapPin size={18} className="text-amber-400" /> Top Villes
          </h3>
          <p className="text-xs text-slate-400 mb-4">Par nombre d'utilisateurs</p>

          <div className="space-y-3">
            {adminStats.topCities.map((city, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <span className="text-lg">{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
                    {city.city}
                  </span>
                  <span className="text-slate-400">{city.users} users</span>
                </div>
                <div className="w-full bg-dark rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                    style={{ width: `${(city.users / adminStats.topCities[0].users) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Activity size={18} className="text-blue-400" /> Matchs récents
          </h3>
          <div className="space-y-3">
            {matches.slice(0, 5).map(match => (
              <div key={match.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark/50 hover:bg-dark-lighter/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-lg">⚽</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{match.title}</p>
                  <p className="text-xs text-slate-400">{match.placeCity} · {match.type} · {match.currentPlayers}/{match.maxPlayers}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  match.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                  match.status === 'full' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {match.status === 'open' ? 'Ouvert' : match.status === 'full' ? 'Complet' : match.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Users size={18} className="text-purple-400" /> Utilisateurs récents
          </h3>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark/50 hover:bg-dark-lighter/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-lg">{user.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.city} · {user.level} · {user.position}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-amber-400">★</span>
                    <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{user.matchesPlayed} matchs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Tournaments */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" /> Tournois
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-dark-border">
                <th className="pb-3 font-medium">Nom</th>
                <th className="pb-3 font-medium">Ville</th>
                <th className="pb-3 font-medium">Équipes</th>
                <th className="pb-3 font-medium">Prize Pool</th>
                <th className="pb-3 font-medium">Statut</th>
                <th className="pb-3 font-medium">Dates</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map(t => (
                <tr key={t.id} className="border-b border-dark-border/50 hover:bg-dark/30">
                  <td className="py-3 font-medium">{t.name}</td>
                  <td className="py-3 text-slate-400">{t.city}</td>
                  <td className="py-3">{t.currentTeams}/{t.maxTeams}</td>
                  <td className="py-3 text-amber-400 font-semibold">{t.prizePool} DT</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'registration' ? 'bg-blue-500/20 text-blue-400' :
                      t.status === 'in_progress' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {t.status === 'registration' ? 'Inscriptions' : t.status === 'in_progress' ? 'En cours' : 'Terminé'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">
                    {new Date(t.startDate).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })} — {new Date(t.endDate).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
