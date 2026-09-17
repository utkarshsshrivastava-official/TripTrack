import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../../shared/types/user';
import { useFamilySocket } from '../hooks/useFamilySocket';
import { Send, Wifi, WifiOff, X, Clock, Check, CheckCheck, MessageSquare, Trash2, AlertTriangle } from 'lucide-react';

interface FamilyChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserProfile;
}

const QUICK_STATUS_CHIPS = [
  'Reached safely 🙏',
  'Tea break ☕',
  'Mani Bewakoof 🤯',
  'Taking BP meds 💊',
  'Gorge route, low signal 👍',
  'Jai Badri Vishal! 🏔️',
  'Water break 💧'
];

function formatChatDateDivider(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const FamilyChatDrawer: React.FC<FamilyChatDrawerProps> = ({
  isOpen,
  onClose,
  activeUser
}) => {
  const { messages, isConnected, typingUser, sendMessage, sendTyping, clearChat } = useFamilySocket(activeUser);
  const [inputText, setInputText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
    sendTyping(false);
  };

  const handleQuickChip = (chip: string) => {
    sendMessage(chip);
  };

  const handleConfirmClear = async () => {
    setIsClearing(true);
    try {
      await clearChat();
    } finally {
      setIsClearing(false);
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md h-full bg-stone-900 border-l border-stone-800 flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="family-chat-title"
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="family-chat-title" className="text-sm font-bold text-stone-100 flex items-center gap-1.5 truncate">
                <span>Family Chat</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  4-8 Mbrs
                </span>
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] truncate">
                {isConnected ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Live Synced (Atlas)
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Dexie Offline Queue
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Clear All Chat Button */}
            {messages.length > 0 && !showClearConfirm && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-rose-950/60 hover:text-rose-400 text-stone-400 border border-stone-700/60 flex items-center justify-center transition-colors"
                title="Clear all chat history"
                aria-label="Clear all chat messages"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Clear Confirmation Prompt Banner */}
        {showClearConfirm && (
          <div className="bg-rose-950/80 border-b border-rose-800/60 px-3.5 py-2.5 flex items-center justify-between text-xs text-rose-200 animate-slide-down">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Delete all messages for everyone?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmClear}
                disabled={isClearing}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 font-bold text-white rounded-md text-[11px] transition-all"
              >
                {isClearing ? 'Clearing...' : 'Clear All'}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md text-[11px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Sender Identity Bar */}
        <div className="px-4 py-2 bg-stone-950/40 border-b border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
              style={{ backgroundColor: activeUser.avatarColor }}
            >
              {activeUser.name.charAt(0)}
            </div>
            <span>Speaking as: <strong className="text-stone-200">{activeUser.name}</strong></span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700/60 text-stone-300 font-medium">
            {activeUser.type === 'PILGRIM' ? (activeUser.duoId === 'DUO_A' ? 'Family A' : 'Family B') : 'Home Family'}
          </span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
              <div className="w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <MessageSquare className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-stone-200">Private Family Group</p>
              <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                Connect with pilgrims and home members. Messages sync to MongoDB Atlas and stay saved offline in dead zones.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === activeUser.id;
              const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              // Check if we need date divider
              const currentDateDivider = formatChatDateDivider(msg.timestamp);
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const prevDateDivider = prevMessage ? formatChatDateDivider(prevMessage.timestamp) : null;
              const showDateDivider = currentDateDivider !== prevDateDivider;

              return (
                <React.Fragment key={msg.id}>
                  {showDateDivider && (
                    <div className="flex justify-center my-2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-stone-800/90 text-stone-400 border border-stone-700/60 shadow-sm">
                        {currentDateDivider}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {!isMe && (
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: msg.senderAvatarColor }}
                        >
                          {msg.senderName.charAt(0)}
                        </div>
                        <span className="text-[11px] font-bold text-stone-300">
                          {msg.senderName}
                        </span>
                        {msg.senderDuo && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-800 border border-stone-700/50 text-stone-400">
                            {msg.senderDuo === 'DUO_A' ? 'Family A' : msg.senderDuo === 'DUO_B' ? 'Family B' : msg.senderDuo}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm break-words shadow-md transition-all ${isMe
                        ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs'
                        : 'bg-stone-800 text-stone-100 border border-stone-700/60 rounded-tl-xs'
                        }`}
                    >
                      <p className="leading-relaxed select-text">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-stone-800' : 'text-stone-400'}`}>
                        <span className="font-mono text-[9px]">{timeStr}</span>
                        {isMe && (
                          msg.status === 'queued' ? (
                            <span title="Queued in Dexie (Offline)"><Clock className="w-3 h-3 text-stone-700 animate-pulse" /></span>
                          ) : msg.status === 'delivered' ? (
                            <span title="Delivered to family & MongoDB Atlas"><CheckCheck className="w-3.5 h-3.5 text-emerald-950 stroke-[2.5]" /></span>
                          ) : (
                            <span title="Sent to cloud"><Check className="w-3.5 h-3.5 text-stone-700" /></span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            }))}

          {typingUser && (
            <div className="text-xs text-stone-400 italic flex items-center gap-1.5 px-2 py-1">
              <span className="animate-pulse text-amber-400">●</span>
              <span>{typingUser} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Status Chips */}
        <div className="p-2 border-t border-stone-800/80 bg-stone-950/60 overflow-x-auto flex gap-1.5 scrollbar-none">
          {QUICK_STATUS_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(chip)}
              className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700/60 active:scale-95 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => {
              setInputText(e.target.value);
              sendTyping(e.target.value.length > 0);
            }}
            placeholder="Type message to family..."
            className="flex-1 min-h-[48px] px-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="min-h-[48px] min-w-[48px] rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-stone-950 flex items-center justify-center font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
