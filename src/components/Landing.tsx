import { useState, useEffect } from 'react';
import {
  MapPin, Users, Trophy, MessageCircle, Shield, Zap, ChevronRight,
  Star, Clock, CreditCard, Smartphone, Globe, ArrowRight, Play
} from 'lucide-react';

interface LandingProps {
  onNavigate: (page: string) => void;
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Landing({ onNavigate }: LandingProps) {
  const features = [
    { icon: MapPin, title: 'Matchs Géolocalisés', desc: 'Trouve des matchs près de chez toi en temps réel grâce au GPS', color: 'text-emerald-400' },
    { icon: CreditCard, title: 'Paiement Intégré', desc: 'Réserve ton terrain et paie ta place directement dans l\'app', color: 'text-amber-400' },
    { icon: Trophy, title: 'Tournois & Brackets', desc: 'Organise des tournois avec brackets, prize pool et classements', color: 'text-purple-400' },
    { icon: MessageCircle, title: 'Chat & Groupes', desc: 'Discute avec ton équipe, coordonne les matchs en direct', color: 'text-blue-400' },
    { icon: Play, title: 'Live Streaming', desc: 'Diffuse la finale en live avec commentaires et réactions', color: 'text-red-400' },
    { icon: Shield, title: 'Profils & Réputation', desc: 'Notes, stats et réputation pour chaque joueur', color: 'text-cyan-400' },
  ];

  const steps = [
    { num: '01', title: 'Crée ton profil', desc: 'Inscris-toi, choisis ta position et ton niveau', icon: '👤' },
    { num: '02', title: 'Trouve un match', desc: 'Recherche par ville, date, type (5v5, 7v7, 11v11)', icon: '🔍' },
    { num: '03', title: 'Rejoins & Paie', desc: 'Réserve ta place et paie en un clic', icon: '💳' },
    { num: '04', title: 'Joue ! ⚽', desc: 'Retrouve tes coéquipiers sur le terrain', icon: '🏟️' },
  ];

  const testimonials = [
    { name: 'Youssef K.', city: 'Sfax', text: 'Enfin une app qui rend l\'organisation de matchs super facile ! Plus besoin de 50 messages WhatsApp.', rating: 5 },
    { name: 'Mehdi T.', city: 'Tunis', text: 'Les tournois avec brackets c\'est incroyable. On a organisé notre premier tournoi Ramadan en 10 minutes.', rating: 5 },
    { name: 'Karim G.', city: 'Sousse', text: 'Le paiement intégré a tout changé. Plus de "j\'ai pas la monnaie". Tout est réglé avant le match.', rating: 4 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pitch-pattern">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-slide-up">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-300 font-medium">🇹🇳 Disponible en Tunisie — Android, iOS, Web & Desktop</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display mb-6 animate-slide-up delay-100 leading-tight">
            <span className="gradient-text">KooraTime</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-4 animate-slide-up delay-200">
            Organise ton match de foot entre amis en <span className="text-emerald-400 font-semibold">30 secondes</span>
          </p>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up delay-300">
            Matchs géolocalisés • Réservation terrain • Paiement intégré • Tournois • Live streaming
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-400">
            <button onClick={() => onNavigate('dashboard')} className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg flex items-center gap-2 justify-center">
              Explorer l'App <ArrowRight size={20} />
            </button>
            <button onClick={() => onNavigate('matches')} className="px-8 py-4 rounded-xl glass text-white font-semibold text-lg flex items-center gap-2 justify-center hover:bg-white/10 transition-all">
              <Play size={20} /> Voir les Matchs
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto animate-slide-up delay-500">
            {[
              { label: 'Joueurs', value: 1247 },
              { label: 'Matchs joués', value: 3420 },
              { label: 'Terrains', value: 85 },
              { label: 'Tournois', value: 24 },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                  <AnimatedCounter end={stat.value} />
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight size={24} className="text-slate-500 rotate-90" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Fonctionnalités</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Tout ce qu'il faut pour jouer</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Une plateforme complète pour organiser, jouer et suivre tes matchs de foot</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-dark-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${f.color}`}>
                  <f.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Comment ça marche</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">4 étapes simples</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="text-5xl mb-4">{s.icon}</div>
                <div className="text-emerald-400 font-display text-lg mb-2">{s.num}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8">
                    <ChevronRight className="text-dark-border" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phone mockup / app preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">App Preview</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6">Disponible partout</h2>
              <p className="text-slate-400 mb-8">KooraTime fonctionne sur tous tes appareils : Android, iOS, navigateur web et même desktop. Ton compte se synchronise en temps réel.</p>

              <div className="space-y-4">
                {[
                  { icon: Smartphone, label: 'Android & iOS', desc: 'App native avec Flutter pour des performances optimales' },
                  { icon: Globe, label: 'Application Web', desc: 'Accède depuis n\'importe quel navigateur, rien à installer' },
                  { icon: Zap, label: 'Temps réel', desc: 'Chat, notifications et mises à jour instantanées' },
                  { icon: Clock, label: 'Hors ligne', desc: 'Consulte tes matchs même sans connexion' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-dark-card/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.label}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-72 h-[580px] rounded-[3rem] bg-dark-card border-4 border-dark-border shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-dark rounded-b-2xl z-10" />
                  <div className="p-4 pt-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-slate-400">Salut 👋</p>
                        <p className="font-semibold text-sm">Ahmed</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">👤</div>
                    </div>

                    <div className="bg-emerald-500/10 rounded-xl p-3 mb-3">
                      <p className="text-xs text-emerald-400 font-semibold mb-1">Prochain match</p>
                      <p className="text-sm font-semibold">Vendredi Soir — 20:00</p>
                      <p className="text-xs text-slate-400">Stade El Menzah Mini</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Users size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400">8/10 joueurs</span>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1">
                      <p className="text-xs font-semibold text-slate-300">Matchs à proximité</p>
                      {['Match Sfax — Soirée', 'Sousse Weekend', 'Ennasr Rapide'].map((m, i) => (
                        <div key={i} className="bg-dark/50 rounded-lg p-2.5 flex items-center gap-2">
                          <span className="text-lg">⚽</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{m}</p>
                            <p className="text-[10px] text-slate-400">5v5 • {10 + i * 2} DT</p>
                          </div>
                          <div className="px-2 py-1 bg-emerald-500/20 rounded text-[10px] text-emerald-400 font-medium">
                            Rejoindre
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-around py-2 border-t border-dark-border mt-2">
                      {['🏠', '🔍', '➕', '💬', '👤'].map((icon, i) => (
                        <button key={i} className={`text-lg ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>{icon}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-75" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Témoignages</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Ce que disent les joueurs</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 text-sm leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack (transparent about architecture) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Architecture</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Construit pour la performance</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Stack technologique moderne pour une expérience fluide</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Flutter', desc: 'Cross-platform', icon: '📱' },
              { name: 'Firebase', desc: 'BaaS & Realtime', icon: '🔥' },
              { name: 'Agora', desc: 'Live Streaming', icon: '📡' },
              { name: 'Maps API', desc: 'Géolocalisation', icon: '🗺️' },
              { name: 'Cloud Functions', desc: 'Backend Logic', icon: '⚡' },
              { name: 'Firestore', desc: 'Database', icon: '💾' },
              { name: 'FCM', desc: 'Push Notifications', icon: '🔔' },
              { name: 'Codemagic', desc: 'CI/CD', icon: '🚀' },
            ].map((tech, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center card-hover">
                <div className="text-3xl mb-2">{tech.icon}</div>
                <h4 className="font-semibold text-sm">{tech.name}</h4>
                <p className="text-xs text-slate-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-amber-500/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Prêt à jouer ? ⚽</h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8">Rejoins des milliers de joueurs en Tunisie et organise ton prochain match en quelques secondes</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => onNavigate('dashboard')} className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg flex items-center gap-2 justify-center">
                  Commencer Maintenant <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-display text-xl gradient-text mb-4">KooraTime</h3>
              <p className="text-sm text-slate-400">La plateforme N°1 pour organiser des matchs de foot en Tunisie 🇹🇳</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Produit</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => onNavigate('matches')}>Matchs</p>
                <p className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => onNavigate('tournaments')}>Tournois</p>
                <p className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => onNavigate('chat')}>Chat</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Support</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p className="cursor-pointer hover:text-emerald-400 transition-colors">FAQ</p>
                <p className="cursor-pointer hover:text-emerald-400 transition-colors">Contact</p>
                <p className="cursor-pointer hover:text-emerald-400 transition-colors">API Docs</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p className="cursor-pointer hover:text-emerald-400 transition-colors">Conditions d'utilisation</p>
                <p className="cursor-pointer hover:text-emerald-400 transition-colors">Politique de confidentialité</p>
                <p className="cursor-pointer hover:text-emerald-400 transition-colors">Mentions légales</p>
              </div>
            </div>
          </div>
          <div className="border-t border-dark-border pt-8 text-center text-sm text-slate-500">
            <p>© 2026 KooraTime. Fait avec ❤️ en Tunisie. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
