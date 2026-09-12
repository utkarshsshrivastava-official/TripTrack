import React, { useState } from 'react';
import { UserProfile } from '../shared/types/user';
import { UserCheck, Edit2, Check, ShieldCheck, Heart, Users, X } from 'lucide-react';

interface ProfileLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserProfile;
  allProfiles: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onUpdateGuestName: (guestId: string, newName: string) => void;
}

export const ProfileLoginModal: React.FC<ProfileLoginModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  allProfiles,
  onSelectUser,
  onUpdateGuestName
}) => {
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [guestNameInput, setGuestNameInput] = useState('');

  if (!isOpen) return null;

  const pilgrims = allProfiles.filter(p => p.type === 'PILGRIM');
  const guests = allProfiles.filter(p => p.type === 'GUEST');

  const startEditing = (e: React.MouseEvent, guest: UserProfile) => {
    e.stopPropagation();
    setEditingGuestId(guest.id);
    setGuestNameInput(guest.name);
  };

  const saveEditing = (guestId: string) => {
    if (guestNameInput.trim()) {
      onUpdateGuestName(guestId, guestNameInput.trim());
    }
    setEditingGuestId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-lg font-bold text-stone-100 flex items-center gap-2">
                Device Active Profile
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                  फ़ोन किसका है?
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Select who is using this phone for personalized tracking & chat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-800/80 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: Pilgrims */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-400" />
                4 Pilgrims (यात्री — Family A & Family B)
              </h3>
              <span className="text-[11px] text-stone-400">Full GPS & Pass Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pilgrims.map(p => {
                const isSelected = p.id === activeUser.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectUser(p)}
                    className={`min-h-[72px] p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10'
                        : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/60'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-white text-base shadow-md border border-white/20"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-100 text-sm truncate">
                          {p.name}
                        </span>
                        {p.isElder && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700/50">
                            Senior
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 truncate">{p.roleLabel}</p>
                      <span className="text-[10px] font-semibold text-stone-300">
                        {p.duoId === 'DUO_A' ? 'Family A (Son + Dad)' : 'Family B (Cousin + Uncle)'}
                      </span>
                    </div>

                    {/* Checkmark indicator */}
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Home Family Guests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                4 Home Family Observers (घर के सदस्य)
              </h3>
              <span className="text-[11px] text-stone-400">Can edit display name</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guests.map(g => {
                const isSelected = g.id === activeUser.id;
                const isEditing = editingGuestId === g.id;

                return (
                  <div
                    key={g.id}
                    onClick={() => onSelectUser(g)}
                    className={`min-h-[72px] p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-400 ring-2 ring-purple-400/40 shadow-lg shadow-purple-500/10'
                        : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/60'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-white text-base shadow-md border border-white/20"
                      style={{ backgroundColor: g.avatarColor }}
                    >
                      {g.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={guestNameInput}
                            onChange={e => setGuestNameInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveEditing(g.id);
                            }}
                            autoFocus
                            placeholder="e.g. Mummy"
                            className="w-full px-2 py-1 text-xs bg-stone-950 border border-purple-400 text-stone-100 rounded-lg focus:outline-none"
                          />
                          <button
                            onClick={() => saveEditing(g.id)}
                            className="p-1 rounded bg-purple-600 text-white hover:bg-purple-500"
                            title="Save name"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-100 text-sm truncate">
                            {g.name}
                          </span>
                          <button
                            onClick={e => startEditing(e, g)}
                            className="p-1 text-stone-400 hover:text-purple-300 rounded hover:bg-stone-700 transition-colors"
                            title="Edit name"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-stone-400 truncate">{g.roleLabel}</p>
                      <span className="text-[10px] text-purple-300">Live Chat & Tracking View</span>
                    </div>

                    {/* Checkmark */}
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-purple-400 text-stone-950 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Saved permanently on this device</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            Continue as {activeUser.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
};
