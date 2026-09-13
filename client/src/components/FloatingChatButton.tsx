import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ 
  onClick,
  hasUnread = true 
}) => {
  return (
    <div className="fixed bottom-[74px] left-3.5 right-3.5 max-w-md mx-auto z-40 pointer-events-none flex justify-start">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto tap-active w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900/95 via-slate-950/90 to-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 backdrop-blur-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center transition-all group relative min-h-touch min-w-touch"
        aria-label="Open Family Chat"
        title="Family Chat Room (Instant in-family messages & updates)"
      >
        {/* Subtle radial emerald breath glow */}
        <span className="absolute inset-0 rounded-2xl bg-emerald-500/10 blur-sm pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

        {/* Chat Icon */}
        <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />

        {/* Live Active Family Presence Dot */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-slate-950" />
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingChatButton;
