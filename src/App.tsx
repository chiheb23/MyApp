import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Matches from './components/Matches';
import MatchDetail from './components/MatchDetail';
import CreateMatch from './components/CreateMatch';
import Tournaments from './components/Tournaments';
import TournamentDetail from './components/TournamentDetail';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Admin from './components/Admin';
import { useAuth } from './hooks/useAuth';
import { notificationService } from './services/notificationService';

// Composant pour faire défiler vers le haut lors du changement de route
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Composant pour protéger les routes privées
function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const location = useLocation();
  const { firebaseUser, userProfile, loading, profileMissing } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );
  
  if (!firebaseUser) return <Navigate to="/" />;

  if (profileMissing && location.pathname !== '/profile') {
    return <Navigate to="/profile" />;
  }
  
  if (adminOnly && userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
}

export default function App() {
  const { firebaseUser } = useAuth();

  useEffect(() => {
    // Écouter les notifications au premier plan
    notificationService.onForegroundMessage();
    
    // Demander la permission si l'utilisateur est connecté
    if (firebaseUser) {
      notificationService.requestPermission(firebaseUser.uid);
    }
  }, [firebaseUser]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-dark text-slate-200">
        <Routes>
          {/* Route Landing sans Navbar */}
          <Route path="/" element={<Landing onNavigate={(page) => window.location.href = `/${page}`} />} />
          
          {/* Routes avec Navbar */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname.split('/')[1] || 'dashboard';

  const handleNavigate = (page: string, id?: string) => {
    const routeMap: Record<string, string> = {
      'match-detail': 'match',
      'tournament-detail': 'tournament'
    };
    const targetPage = routeMap[page] || page;
    const path = id ? `/${targetPage}/${id}` : `/${targetPage}`;
    navigate(path);
  };

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className={currentPage === 'landing' ? '' : 'pb-20 md:pb-8'}>
        <Routes>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="/matches" element={<PrivateRoute><Matches onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="/match/:id" element={<PrivateRoute><MatchDetailWrapper onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="/create-match" element={<PrivateRoute><CreateMatch onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="/tournaments" element={<PrivateRoute><Tournaments onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="/tournament/:id" element={<PrivateRoute><TournamentDetailWrapper onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><Admin onNavigate={handleNavigate} /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-dark-border/50 z-50">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: '🏠', label: 'Accueil', path: '/dashboard' },
            { id: 'matches', icon: '⚽', label: 'Matchs', path: '/matches' },
            { id: 'create-match', icon: '➕', label: 'Créer', path: '/create-match' },
            { id: 'chat', icon: '💬', label: 'Chat', path: '/chat' },
            { id: 'profile', icon: '👤', label: 'Profil', path: '/profile' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                currentPage === item.id ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function MatchDetailWrapper({ onNavigate }: { onNavigate: any }) {
  const { id } = useParams();
  return <MatchDetail matchId={id || ''} onNavigate={onNavigate} />;
}

function TournamentDetailWrapper({ onNavigate }: { onNavigate: any }) {
  const { id } = useParams();
  return <TournamentDetail tournamentId={id || ''} onNavigate={onNavigate} />;
}
