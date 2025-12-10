"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardStore {
  cardsOrder: string[];
  setCardsOrder: (order: string[]) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      cardsOrder: [
        "ministries",
        "cells",
        "members",
        "groups",
        "reports",
        "sectors",
        "subsectors",
      ],
      setCardsOrder: (order) => set({ cardsOrder: order }),
    }),
    {
      name: "dashboard-cards-order",
    }
  )
);
