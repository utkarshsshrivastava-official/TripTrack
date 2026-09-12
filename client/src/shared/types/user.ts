import { DuoId } from './index';

export type UserType = 'PILGRIM' | 'GUEST';

export interface UserProfile {
  id: string;
  name: string;
  type: UserType;
  duoId?: DuoId;
  avatarColor: string;
  roleLabel: string;
  relation: string;
  isElder?: boolean;
  isCustomName?: boolean;
  bloodGroup?: string;
  emergencyContact?: string;
}

export const GUEST_INITIAL_NAMES: Record<string, string> = {
  'guest-1': 'Home Family 1 (Mummy)',
  'guest-2': 'Home Family 2 (Didi)',
  'guest-3': 'Home Family 3',
  'guest-4': 'Home Family 4'
};
