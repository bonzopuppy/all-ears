/**
 * Core graph logic for Musical Journey.
 * No UI assumptions.
 */

/**
 * @param {import('./graphTypes').RFNode[]} nodes
 * @param {import('./graphTypes').RFEdge[]} edges
 * @param {string} startNodeId - reactflow node id
 */
export function buildAdjacency(nodes, edges, startNodeId) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adj = new Map();

  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source).push(e.target);
    adj.get(e.target).push(e.source);
  }

  return { nodeMap, adj, startNodeId };
}

/** Breadth-first traversal to collect visited node ids in stable order. */
export function bfs({ adj, startNodeId }, max = 100) {
  const visited = new Set();
  const order = [];
  const q = [startNodeId];

  while (q.length && order.length < max) {
    const id = q.shift();
    if (!id || visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    const next = adj.get(id) || [];
    for (const n of next) {
      if (!visited.has(n)) q.push(n);
    }
  }

  return order;
}

/**
 * Converts an AI pathway response to nodes/edges suitable for React Flow.
 *
 * @param {object} opts
 * @param {import('./graphTypes').JourneyNodeData} opts.center
 * @param {object} opts.pathwaysResponse - { pathways: [...] }
 */
export function pathwaysToGraph({ center, pathwaysResponse }) {
  const nodes = [];
  const edges = [];

  const centerId = `center:${center.nodeType}:${center.nodeId}`;

  nodes.push({
    id: centerId,
    type: 'journeyNode',
    position: { x: 0, y: 0 },
    data: center
  });

  const pathways = pathwaysResponse?.pathways || [];
  let i = 0;
  for (const p of pathways) {
    for (const n of p.nodes || []) {
      i += 1;
      const id = `node:${n.nodeType}:${n.nodeId}`;
      nodes.push({
        id,
        type: 'journeyNode',
        position: { x: 250 * Math.cos(i), y: 250 * Math.sin(i) },
        data: {
          nodeType: n.nodeType,
          nodeId: n.nodeId,
          nodeName: n.nodeName,
          description: n.description,
          representativeTrackTitles: n.representativeTrackTitles
        }
      });
      edges.push({
        id: `e:${centerId}->${id}:${p.type}`,
        source: centerId,
        target: id,
        data: { pathwayType: p.type }
      });
    }
  }

  return { nodes, edges, centerId };
}
