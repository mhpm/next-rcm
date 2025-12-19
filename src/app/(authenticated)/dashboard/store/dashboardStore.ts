"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PeriodType } from "../actions/dashboard.actions";

interface DashboardStore {
  cardsOrder: string[];
  setCardsOrder: (order: string[]) => void;
  growthChartPeriod: PeriodType;
  setGrowthChartPeriod: (period: PeriodType) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      cardsOrder: [
        "members",
        "reports",
        "sectors",
        "ministries",
        "cells",
        "groups",
      ],
      setCardsOrder: (order) => set({ cardsOrder: order }),
      growthChartPeriod: "month",
      setGrowthChartPeriod: (period) => set({ growthChartPeriod: period }),
    }),
    {
      name: "dashboard-cards-order-v3",
    }
  )
);
