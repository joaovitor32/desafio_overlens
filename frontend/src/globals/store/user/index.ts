import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware';

import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  accessToken: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const customStorage: PersistOptions<UserState>['storage'] = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      storage: createJSONStorage(() => customStorage),
    }
  )
);
