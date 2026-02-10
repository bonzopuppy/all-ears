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
  playlist: [],
  currentJourneyId: null,

  setCurrentJourneyId: (id) => set({ currentJourneyId: id }),
  setCenter: (center) => set({ center }),
  setGraph: ({ nodes, edges }) => set({ nodes, edges }),

  addToPlaylist: (track) => {
    const already = get().playlist.some((t) => t.uri === track.uri);
    if (already) return;
    set((s) => ({ playlist: [...s.playlist, track] }));
  },

  removeFromPlaylist: (uri) => {
    set((s) => ({ playlist: s.playlist.filter((t) => t.uri !== uri) }));
  },

  clearPlaylist: () => set({ playlist: [] }),

  reset: () => set({
    center: null,
    nodes: [],
    edges: [],
    visited: [],
    playlist: [],
    currentJourneyId: null
  })
}));
