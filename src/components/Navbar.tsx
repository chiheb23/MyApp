import { useState } from 'react';
import {
  Home, Search, Trophy, MessageCircle, User, Menu, X, Bell, Settings,
  Plus, ChevronDown, LogOut, Shield
} from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  void onNavigate;
  const { firebaseUser, userProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!firebaseUser) return;
    const unsubscribe = notificationService.subscribeToNotifications(firebaseUser.uid, (data) => {
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [firebaseUser]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadNotificationIds = notifications.filter((n) => !n.read).map((n) => n.id);

  const handleMarkAllAsRead = async () => {
    if (unreadNotificationIds.length === 0) return;
    try {
      await notificationService.markAllAsRead(unreadNotificationIds);
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  if (currentPage === 'landing') return null;

  const user = userProfile || { name: 'Invité', avatar: '👤' };

  const navItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home, path: '/dashboard' },
    { id: 'matches', label: 'Matchs', icon: Search, path: '/matches' },
    { id: 'tournaments', label: 'Tournois', icon: Trophy, path: '/tournaments' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat' },
    { id: 'profile', label: 'Profil', icon: User, path: '/profile' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-dark-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="font-display text-xl gradient-text hover:opacity-80 transition-opacity">
              KooraTime
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Create match button */}
              <Link
                to="/create-match"
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg btn-primary text-white text-sm font-medium"
              >
                <Plus size={16} />
                <span className="hidden lg:inline">Créer</span>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 glass rounded-xl shadow-xl overflow-hidden animate-slide-up z-50">
                    <div className="p-3 border-b border-dark-border flex justify-between items-center">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <button
                        onClick={handleMarkAllAsRead}
                        disabled={unreadNotificationIds.length === 0}
                        className="text-xs text-emerald-400 disabled:text-slate-500"
                      >
                        Tout marquer lu
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 10).map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => !n.read && notificationService.markAsRead(n.id)}
                            className={`p-3 hover:bg-dark/50 cursor-pointer border-b border-dark-border/50 last:border-0 ${!n.read ? 'bg-emerald-500/5' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-sm mt-0.5">
                                {n.type === 'match_invite' ? '📩' : n.type === 'payment' ? '💳' : n.type === 'tournament' ? '🏆' : n.type === 'match_confirmed' ? '✅' : '🔔'}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{n.title}</p>
                                <p className="text-xs text-slate-400">{n.message}</p>
                                <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                              </div>
                              {!n.read && <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2" />}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-500 text-sm">
                          Aucune notification
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin */}
              <Link
                to="/admin"
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 'admin' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield size={18} />
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-sm">{user.avatar}</div>
                  <ChevronDown size={14} className="text-slate-400 hidden md:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl overflow-hidden animate-slide-up z-50">
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="w-full flex items-center gap-2 p-3 hover:bg-dark/50 text-sm text-left">
                      <User size={16} className="text-slate-400" /> Mon profil
                    </Link>
                    <button className="w-full flex items-center gap-2 p-3 hover:bg-dark/50 text-sm text-left">
                      <Settings size={16} className="text-slate-400" /> Paramètres
                    </button>
                    <div className="border-t border-dark-border">
                      <Link to="/" onClick={() => setShowUserMenu(false)} className="w-full flex items-center gap-2 p-3 hover:bg-dark/50 text-sm text-red-400 text-left">
                        <LogOut size={16} /> Déconnexion
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-dark/95 backdrop-blur-lg pt-20 animate-slide-up">
          <div className="px-6 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <item.icon size={22} />
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-dark-border">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium text-slate-300 hover:bg-white/5"
              >
                <Shield size={22} /> Admin Panel
              </Link>
              <Link
                to="/create-match"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-2 py-4 rounded-xl btn-primary text-white font-semibold text-lg text-center"
              >
                + Créer un Match
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotifications(false); setShowUserMenu(false); }} />
      )}
    </>
  );
}
