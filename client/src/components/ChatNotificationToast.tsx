import React, { useEffect, useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

export interface ChatToastData {
  id: string;
  senderName: string;
  senderAvatarColor?: string;
  text: string;
  timestamp: string;
}

interface ChatNotificationToastProps {
  toast: ChatToastData | null;
  onOpenChat: () => void;
  onDismiss: () => void;
}

export const ChatNotificationToast: React.FC<ChatNotificationToastProps> = ({
  toast,
  onOpenChat,
  onDismiss
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast) return;

    setIsExiting(false);
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast?.id]);

  if (!toast) return null;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
      setIsExiting(false);
    }, 250);
  };

  const handleTap = () => {
    onOpenChat();
    onDismiss();
  };

  return (
    <aside 
      aria-label="Live Family Message Alert"
      className="fixed top-2.5 left-3 right-3 max-w-md mx-auto z-50 pointer-events-none"
    >
      <div
        className={`pointer-events-auto tap-active transition-all duration-300 ease-out transform ${
          isExiting ? '-translate-y-6 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'
        } bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 rounded-2xl p-3 flex items-start gap-3 cursor-pointer group hover:border-emerald-400 select-none`}
        onClick={handleTap}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleTap()}
      >
        {/* Sender Avatar / Icon */}
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-md ring-2 ring-emerald-500/30"
          style={{ backgroundColor: toast.senderAvatarColor || '#059669' }}
        >
          {toast.senderName.slice(0, 1).toUpperCase()}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {toast.senderName}
            </span>
            <span className="text-[10px] font-medium text-slate-400 flex-shrink-0">
              Just now
            </span>
          </div>
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
            {toast.text}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-400/90 group-hover:text-emerald-300">
            <span>Tap to reply</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 flex-shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
