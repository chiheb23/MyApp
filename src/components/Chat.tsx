import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Users, Search, Phone, MoreVertical, Loader2 } from 'lucide-react';
import { chatRooms } from '../data';
import { chatService } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';
import { Message } from '../types';

interface ChatProps {
  onNavigate: (page: string) => void;
}

export default function Chat(_props: ChatProps) {
  const { firebaseUser, userProfile } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!selectedRoom) {
      setMessages([]);
      return;
    }

    const unsubscribe = chatService.subscribeToMessages(selectedRoom, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  const room = chatRooms.find(r => r.id === selectedRoom);

  const filteredRooms = chatRooms.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // Identité de l'expéditeur : utilisateur Firebase connecté, sinon fallback
  const senderId = firebaseUser?.uid || 'guest-user';
  const senderName = userProfile?.name || firebaseUser?.displayName || 'Invité';
  const senderAvatar = userProfile?.avatar || '👤';

  const sendMessage = async () => {
    if (!message.trim() || !selectedRoom || sending) return;

    setSending(true);
    try {
      await chatService.sendMessage(
        selectedRoom,
        { id: senderId, name: senderName.split(' ')[0], avatar: senderAvatar },
        message
      );
      setMessage('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      alert("Impossible d'envoyer le message. Vérifiez votre connexion.");
    } finally {
      setSending(false);
    }
  };

  const showChat = selectedRoom !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="glass rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="flex h-full">

          {/* ── Room List ── */}
          <div className={`${showChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-dark-border`}>
            <div className="p-4 border-b border-dark-border">
              <h2 className="text-lg font-bold mb-3">Messages 💬</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark text-white text-sm placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredRooms.length === 0 ? (
                <p className="text-center text-slate-500 text-sm p-6">Aucune conversation trouvée.</p>
              ) : filteredRooms.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoom(r.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                    selectedRoom === r.id ? 'bg-emerald-500/10' : 'hover:bg-dark/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-dark-lighter flex items-center justify-center text-xl shrink-0">
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{r.name}</p>
                      <span className="text-xs text-slate-500 shrink-0 ml-2">{r.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-slate-400 truncate">{r.lastMessage}</p>
                      {r.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0 ml-2">
                          {r.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Users size={10} className="text-slate-500" />
                      <span className="text-[10px] text-slate-500">{r.members} membres</span>
                      <span className="text-[10px] text-slate-500 ml-1">•</span>
                      <span className={`text-[10px] px-1.5 rounded ${
                        r.type === 'match'      ? 'bg-emerald-500/10 text-emerald-400' :
                        r.type === 'tournament' ? 'bg-amber-500/10 text-amber-400'    :
                                                  'bg-blue-500/10 text-blue-400'
                      }`}>
                        {r.type === 'match' ? 'Match' : r.type === 'tournament' ? 'Tournoi' : 'Groupe'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Chat Area ── */}
          <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            {selectedRoom && room ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-dark-border">
                  <button onClick={() => setSelectedRoom(null)} className="md:hidden text-slate-400 hover:text-white">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-lg">
                    {room.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{room.name}</p>
                    <p className="text-xs text-slate-400">{room.members} membres</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-dark/50 text-slate-400 transition-colors"><Phone size={18} /></button>
                    <button className="p-2 rounded-lg hover:bg-dark/50 text-slate-400 transition-colors"><MoreVertical size={18} /></button>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                      <p className="text-4xl mb-3">💬</p>
                      <p className="text-sm font-medium">Aucun message encore.</p>
                      <p className="text-xs mt-1">Soyez le premier à écrire !</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id}>
                        {msg.isSystem ? (
                          <div className="text-center">
                            <span className="px-3 py-1 rounded-full bg-dark-lighter text-xs text-slate-400">
                              {msg.text}
                            </span>
                          </div>
                        ) : (
                          <div className={`flex gap-3 ${msg.authorId === senderId ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-sm shrink-0">
                              {msg.authorAvatar}
                            </div>
                            <div className={`max-w-[70%] ${msg.authorId === senderId ? 'text-right' : ''}`}>
                              <p className="text-xs text-slate-400 mb-1">
                                {msg.authorName} · {msg.timestamp}
                              </p>
                              <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                                msg.authorId === senderId
                                  ? 'bg-emerald-500 text-white rounded-tr-sm'
                                  : 'bg-dark-lighter text-slate-200 rounded-tl-sm'
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {/* Ancre scroll automatique */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-dark-border">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !sending && sendMessage()}
                      placeholder="Écris un message..."
                      className="flex-1 px-4 py-3 rounded-xl bg-dark text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() || sending}
                      className="p-3 rounded-xl btn-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending
                        ? <Loader2 size={18} className="animate-spin" />
                        : <Send size={18} />
                      }
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <p className="text-5xl mb-4">💬</p>
                  <p className="text-lg font-semibold">Sélectionne une conversation</p>
                  <p className="text-sm text-slate-400 mt-1">Choisis un chat pour commencer</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
