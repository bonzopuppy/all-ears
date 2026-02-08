/**
 * Metro/Subway theme constants for Musical Journey graph.
 */

// Genre → route color
export const GENRE_COLORS = {
  rock: '#E53935',
  jazz: '#1E88E5',
  electronic: '#00BCD4',
  'hip-hop': '#FB8C00',
  'hip hop': '#FB8C00',
  rap: '#FB8C00',
  'r&b': '#8E24AA',
  rnb: '#8E24AA',
  soul: '#8E24AA',
  classical: '#FFB300',
  folk: '#43A047',
  country: '#43A047',
  pop: '#EC407A',
  metal: '#616161',
  indie: '#26A69A',
  alternative: '#26A69A',
  latin: '#FF7043',
  reggae: '#66BB6A',
  blues: '#5C6BC0',
  punk: '#D84315'
};

// Pathway type → route color (each "metro line" has a fixed color)
export const PATHWAY_COLORS = {
  influences: '#1E88E5',
  collaborators: '#FB8C00',
  contemporaries: '#26A69A',
  genre_connections: '#EC407A',
  legacy: '#FFB300'
};

// Pathway type → dash array (SVG strokeDasharray)
// Solid = lineage, Dashed = peers, Dotted = categorical
export const PATHWAY_DASH = {
  influences: '0',          // solid — lineage
  legacy: '0',              // solid — lineage
  collaborators: '8 4',     // dashed — peers
  contemporaries: '8 4',    // dashed — peers
  genre_connections: '3 3'  // dotted — categorical
};

// Pathway type → human-readable label
export const PATHWAY_LABELS = {
  influences: 'INFLUENCED BY',
  legacy: 'INFLUENCED',
  collaborators: 'COLLABORATOR',
  contemporaries: 'CONTEMPORARY',
  genre_connections: 'GENRE'
};

// Node sizes
export const NODE_SIZE = {
  artist: 14,
  genre: 14,
  track: 8
};

// Default fallback color
export const DEFAULT_NODE_COLOR = '#78909C';

/**
 * Resolve a color for a node (station marker).
 *
 * All stations are neutral — color lives ONLY on lines (PATHWAY_COLORS).
 * Shape distinguishes entity type (circle=artist, square=genre, small=track).
 */
export function resolveNodeColor(nodeData) {
  if (!nodeData) return DEFAULT_NODE_COLOR;
  if (nodeData.nodeType === 'track') return '#BDBDBD';
  return '#E0E0E0';
}
