import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

interface ActiveUserState {
  selectedUserId: string | null;
  hasHydrated: boolean;
  setSelectedUserId: (selectedUserId: string | null) => void;
  clearSelectedUserId: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const storage = createJSONStorage<Pick<ActiveUserState, "selectedUserId">>(() =>
  typeof window === "undefined" ? noopStorage : window.localStorage,
);

export const useActiveUserStore = create<ActiveUserState>()(
  persist(
    (set) => ({
      selectedUserId: null,
      hasHydrated: false,
      setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
      clearSelectedUserId: () => set({ selectedUserId: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "shareit-active-user",
      version: 1,
      storage,
      partialize: (state) => ({ selectedUserId: state.selectedUserId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function getSelectedUserId() {
  return useActiveUserStore.getState().selectedUserId;
}
