// create roles store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Role {
  roleId: number;
  roleName: string;
  roleDescription: string;
}

interface RolesStore {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
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

export const useRolesStore = create<RolesStore>()(
  persist(
    (set) => ({
      roles: [],
      setRoles: (roles: Role[]) => set({ roles }),
    }),
    {
      name: 'roles-store',
      storage: localStorageWrapper,
    }
  )
);