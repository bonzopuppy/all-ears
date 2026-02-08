/**
 * Shared data structures for Musical Journey.
 *
 * This repo is currently JS; using JSDoc keeps typing lightweight.
 */

/**
 * @typedef {'artist' | 'track' | 'genre'} JourneyNodeType
 */

/**
 * @typedef {Object} JourneyNodeData
 * @property {JourneyNodeType} nodeType
 * @property {string} nodeId
 * @property {string} nodeName
 * @property {string} [description]
 * @property {string[]} [representativeTrackTitles]
 * @property {any[]} [representativeTracks]
 */

/**
 * @typedef {import('reactflow').Node<JourneyNodeData>} RFNode
 * @typedef {import('reactflow').Edge} RFEdge
 */

export const JOURNEY_NODE_KIND = {
  CENTER: 'center',
  PATHWAY: 'pathway'
};
