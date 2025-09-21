import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. Import the persist middleware
import initialData from './dashboardData.json';

export const useDashboardStore = create(
  // 2. Wrap your entire store definition in the persist function
  persist(
    (set) => ({
      // State (no changes here)
      layout: initialData.dashboardLayout,
      allWidgets: initialData.allAvailableWidgets,
      theme: 'light',

      // Actions (no changes here)
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      resetLayout: () => set({ layout: initialData.dashboardLayout }),

      removeWidget: (categoryId, widgetId) =>
        set((state) => ({
          layout: state.layout.map((category) =>
            category.id === categoryId
              ? { ...category, widgets: category.widgets.filter((id) => id !== widgetId) }
              : category
          ),
        })),

      updateCategoryWidgets: (categoryId, newWidgetIds) =>
        set((state) => ({
          layout: state.layout.map((category) =>
            category.id === categoryId ? { ...category, widgets: newWidgetIds } : category
          ),
        })),
    }),
    // 3. Add the configuration object for the persist middleware
    {
      name: 'dashboard-storage', // The key for the data in local storage
      // This function specifies which parts of your state you want to save
      partialize: (state) => ({
        layout: state.layout,
        theme: state.theme,
      }),
    }
  )
);