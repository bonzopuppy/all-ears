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
  tracks: [],
  isRecording: false,
  currentJourneyId: null,

  setCurrentJourneyId: (id) => set({ currentJourneyId: id }),
  setCenter: (center) => set({ center }),
  setGraph: ({ nodes, edges }) => set({ nodes, edges }),
  setTracks: (tracks) => set({ tracks: Array.isArray(tracks) ? tracks : [] }),

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

    if (nodeData?.nodeType === 'track') {
      set((s) => {
        const already = s.tracks.some((t) => t?.nodeId === nodeData?.nodeId);
        if (already) return s;
        return { tracks: [...s.tracks, nodeData] };
      });
    }
  },

  reset: () => set({
    center: null,
    nodes: [],
    edges: [],
    visited: [],
    tracks: [],
    isRecording: false,
    currentJourneyId: null
  })
}));
