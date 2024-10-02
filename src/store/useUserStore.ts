import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExternalLinkedAccount {
  id: number;
  account_id: string;
  account_number: string;
  name: string;
  type: string;
  balance: number;
  is_linked: boolean;
  created_on: string;
  created_at: string;
  currency: string;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  country: string;
  uid: string;
  created_on: string;
  is_verified: boolean;
  tc_accepted: boolean;
  phone_number: string | null;
  income: number;
  income_bracket: string;
  is_onboarded: boolean;
  password_reset: boolean;
  external_linked_accounts: ExternalLinkedAccount[];
  last_login: string | null;
  first_login: string | null;
}

interface UserStore {
  users: User[];
  setUsers: (users: User[]) => void;
  getUserById: (id: number) => User | undefined;
}

const localStorageWrapper = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      setUsers: (users: User[]) => set({ users }),
      getUserById: (id: number) => {
        const { users } = get();
        return users.find((user) => user.user_id === id);
      },
    }),
    {
      name: 'user-store',
      storage: localStorageWrapper,
    }
  )
);