import { create } from 'zustand';
import initialData from './dashboardData.json';

export const useDashboardStore = create((set) => ({
  // --- NEW STATE ---
  theme: 'light', // Can be 'light' or 'dark'

  // --- EXISTING STATE ---
  layout: initialData.dashboardLayout,
  allWidgets: initialData.allAvailableWidgets,

  // --- ACTIONS ---
  removeWidget: (categoryId, widgetId) =>
    set((state) => ({
      layout: state.layout.map((category) =>
        category.id === categoryId
          ? { ...category, widgets: category.widgets.filter((id) => id !== widgetId) }
          : category
      ),
    })),
  
  setDashboardLayout: (newLayout) => set({ layout: newLayout }),

  // --- NEW ACTION for Dark Mode ---
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  // --- NEW ACTION for Reset Button ---
  resetLayout: () => set({ layout: initialData.dashboardLayout }),
}));