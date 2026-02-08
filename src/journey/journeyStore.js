import { create } from 'zustand';

/**
 * Minimal global state for Musical Journey.
 * UI layer can wrap this with selectors and derived state.
 */

export const useJourneyStore = create((set, get) => ({
  center: null,
  nodes: [],
  edges: [],
  visited: [],
  isRecording: false,
  currentJourneyId: null,

  setCenter: (center) => set({ center }),
  setGraph: ({ nodes, edges }) => set({ nodes, edges }),

  startRecording: () => {
    const center = get().center;
    set({
      isRecording: true,
      visited: center ? [center] : []
    });
  },

  stopRecording: () => set({ isRecording: false }),

  visitNode: (nodeData) => {
    if (!get().isRecording) return;
    set((s) => ({ visited: [...s.visited, nodeData] }));
  },

  reset: () => set({
    center: null,
    nodes: [],
    edges: [],
    visited: [],
    isRecording: false,
    currentJourneyId: null
  })
}));
