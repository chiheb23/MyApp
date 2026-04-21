import { useState, useEffect } from 'react';
import { Send, ArrowLeft, Search, Phone, MoreVertical, Loader2 } from 'lucide-react';
import { chatService } from '../services/chatService';
import { Message, ChatRoom } from '../types';
import { useAuth } from '../hooks/useAuth';

interface ChatProps {
  onNavigate: (page: string) => void;
}

export default function Chat({ onNavigate }: ChatProps) {
  const { userProfile, loading: authLoading } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [search, setSearch] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    // Dans une version réelle, on s'abonnerait aux salons de l'utilisateur
    // Pour le moment, on simule la récupération des salons
    setLoadingRooms(false);
  }, []);

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

  const sendMessage = async () => {
    if (!message.trim() || !selectedRoom || !userProfile) return;
    
    const author = {
      id: userProfile.id,
      name: userProfile.name.split(' ')[0],
      avatar: userProfile.avatar
    };

    try {
      await chatService.sendMessage(selectedRoom, author, message);
      setMessage('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  const showChat = selectedRoom !== null;
  const currentRoom = rooms.find(r => r.id === selectedRoom);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="glass rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="flex h-full">
          {/* Room List */}
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
              {loadingRooms ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div>
              ) : rooms.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">Aucune conversation active</div>
              ) : (
                rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(room => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                      selectedRoom === room.id ? 'bg-emerald-500/10' : 'hover:bg-dark/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-dark-lighter flex items-center justify-center text-xl shrink-0">
                      {room.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{room.name}</p>
                        <span className="text-xs text-slate-500 shrink-0 ml-2">{room.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{room.lastMessage}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            {selectedRoom && currentRoom ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-dark-border">
                  <button onClick={() => setSelectedRoom(null)} className="md:hidden text-slate-400 hover:text-white">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-lg">
                    {currentRoom.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{currentRoom.name}</p>
                    <p className="text-xs text-slate-400">{currentRoom.members} membres</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-dark/50 text-slate-400 transition-colors"><Phone size={18} /></button>
                    <button className="p-2 rounded-lg hover:bg-dark/50 text-slate-400 transition-colors"><MoreVertical size={18} /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.authorId === userProfile?.id ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-sm shrink-0">
                        {msg.authorAvatar}
                      </div>
                      <div className={`max-w-[70%] ${msg.authorId === userProfile?.id ? 'text-right' : ''}`}>
                        <p className="text-xs text-slate-400 mb-1">
                          {msg.authorName} · {msg.timestamp}
                        </p>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                          msg.authorId === userProfile?.id
                            ? 'bg-emerald-500 text-white rounded-tr-sm'
                            : 'bg-dark-lighter text-slate-200 rounded-tl-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-dark-border">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Écris un message..."
                      className="flex-1 px-4 py-3 rounded-xl bg-dark text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="p-3 rounded-xl btn-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
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
