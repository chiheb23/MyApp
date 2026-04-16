import { useState, useEffect } from 'react';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedId, setSelectedId] = useState<string>('');

  const navigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (id) setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'matches':
        return <Matches onNavigate={navigate} />;
      case 'match-detail':
        return <MatchDetail matchId={selectedId} onNavigate={navigate} />;
      case 'create-match':
        return <CreateMatch onNavigate={navigate} />;
      case 'tournaments':
        return <Tournaments onNavigate={navigate} />;
      case 'tournament-detail':
        return <TournamentDetail tournamentId={selectedId} onNavigate={navigate} />;
      case 'profile':
        return <Profile onNavigate={navigate} />;
      case 'chat':
        return <Chat onNavigate={navigate} />;
      case 'admin':
        return <Admin onNavigate={navigate} />;
      default:
        return <Landing onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-200">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className={currentPage === 'landing' ? '' : 'pb-20 md:pb-8'}>
        {renderPage()}
      </main>

      {/* Mobile bottom navigation */}
      {currentPage !== 'landing' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-dark-border/50 z-50">
          <div className="flex justify-around py-2">
            {[
              { id: 'dashboard', icon: '🏠', label: 'Accueil' },
              { id: 'matches', icon: '⚽', label: 'Matchs' },
              { id: 'create-match', icon: '➕', label: 'Créer' },
              { id: 'chat', icon: '💬', label: 'Chat' },
              { id: 'profile', icon: '👤', label: 'Profil' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
