import { create } from 'zustand';

/**
 * Sprint Store
 *
 * Client-side state management for sprint-related UI state.
 * Use this for UI state that doesn't need to be synced with the server.
 */
interface SprintState {
  selectedSprintId: string | null;
  setSelectedSprintId: (id: string | null) => void;

  // UI state
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;

  // Filters and view preferences
  filters: {
    workItemType: string[] | null;
    state: string[] | null;
    feature: string | null;
  };
  setFilters: (filters: Partial<SprintState['filters']>) => void;
  clearFilters: () => void;
}

export const useSprintStore = create<SprintState>((set) => ({
  // Selected sprint
  selectedSprintId: null,
  setSelectedSprintId: (id) => set({ selectedSprintId: id }),

  // Upload state
  isUploading: false,
  setIsUploading: (isUploading) => set({ isUploading }),

  // Filters
  filters: {
    workItemType: null,
    state: null,
    feature: null,
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () =>
    set({
      filters: {
        workItemType: null,
        state: null,
        feature: null,
      },
    }),
}));
