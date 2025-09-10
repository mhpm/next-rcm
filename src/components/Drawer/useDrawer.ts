import { create } from 'zustand';

type DrawerState = {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
};

export const useDrawer = create<DrawerState>((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}));
