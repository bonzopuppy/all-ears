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

// ---------------------------------------------------------------------------
// pathwaysToGraph — hub-and-spoke (every node connects directly to center)
// ---------------------------------------------------------------------------

/**
 * Converts an AI pathway response to nodes/edges suitable for React Flow.
 * Hub-and-spoke: every child node connects directly to the center node.
 */
export function pathwaysToGraph({ center, pathwaysResponse }) {
  const nodes = [];
  const edges = [];

  const centerId = `center:${center.nodeType}:${center.nodeId}`;

  nodes.push({
    id: centerId,
    position: { x: 0, y: 0 },
    data: { ...center, label: center.nodeName }
  });

  const pathways = pathwaysResponse?.pathways || [];

  for (const p of pathways) {
    for (const n of p.nodes || []) {
      const id = `node:${n.nodeType}:${n.nodeId}`;
      nodes.push({
        id,
        position: { x: 0, y: 0 }, // positions assigned by layoutFullGraph
        data: {
          label: n.nodeName,
          nodeType: n.nodeType,
          nodeId: n.nodeId,
          nodeName: n.nodeName,
          description: n.description,
          representativeTrackTitles: n.representativeTrackTitles,
          pathwayType: p.type
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

// ---------------------------------------------------------------------------
// layoutFullGraph — force-directed (Fruchterman-Reingold) with BFS init
// ---------------------------------------------------------------------------

/**
 * Compute layout for all nodes using a force-directed simulation.
 *
 * Phase 1: BFS-ring initialization (root at center, children on concentric rings).
 * Phase 2: Fruchterman-Reingold force simulation:
 *   - Node–node repulsion (all pairs)
 *   - Edge spring attraction (connected pairs)
 *   - Edge–node repulsion (keep nodes off non-adjacent edges)
 *
 * @param {{ nodes: object[], edges: object[], rootId: string }} opts
 * @returns {object[]} nodes with updated positions
 */
export function layoutFullGraph({ nodes, edges, rootId }) {
  if (!nodes.length) return nodes;
  if (nodes.length < 3) {
    // Trivial: just space them out
    return nodes.map((n, i) => ({
      ...n,
      position: n.id === rootId ? { x: 0, y: 0 } : { x: 200 * (i || 1), y: 0 }
    }));
  }

  // --- Phase 1: BFS-ring initial positions ---
  const adj = new Map();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source).push(e.target);
      adj.get(e.target).push(e.source);
    }
  }

  const positions = new Map();
  const visited = new Set([rootId]);
  const queue = [rootId];
  const depths = new Map([[rootId, 0]]);
  positions.set(rootId, { x: 0, y: 0 });

  while (queue.length) {
    const id = queue.shift();
    for (const nb of (adj.get(id) || [])) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        depths.set(nb, depths.get(id) + 1);
      }
    }
  }

  // Group by BFS depth, place on concentric rings
  const RING_SPACING = 250;
  const depthGroups = new Map();
  for (const [id, depth] of depths) {
    if (!depthGroups.has(depth)) depthGroups.set(depth, []);
    depthGroups.get(depth).push(id);
  }
  for (const [depth, ids] of depthGroups) {
    if (depth === 0) continue;
    const r = depth * RING_SPACING;
    ids.forEach((id, i) => {
      const angle = (2 * Math.PI * i) / ids.length - Math.PI / 2;
      positions.set(id, { x: r * Math.cos(angle), y: r * Math.sin(angle) });
    });
  }

  // Any disconnected nodes
  for (const n of nodes) {
    if (!positions.has(n.id)) {
      positions.set(n.id, { x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 });
    }
  }

  // --- Phase 2: Force-directed refinement (Fruchterman-Reingold) ---
  const IDEAL = 220;       // ideal edge length
  const ITERATIONS = 300;
  const INIT_TEMP = 400;
  const COOLING = 0.97;
  const MIN_EDGE_DIST = 60; // edge-node repulsion threshold
  const TIME_LIMIT = 200;   // ms budget

  let temp = INIT_TEMP;
  const startTime = Date.now();

  for (let iter = 0; iter < ITERATIONS; iter++) {
    if (Date.now() - startTime > TIME_LIMIT) break;

    const disp = new Map();
    for (const n of nodes) disp.set(n.id, { dx: 0, dy: 0 });

    // Node–node repulsion (Coulomb-like: k² / dist)
    for (let i = 0; i < nodes.length; i++) {
      const pi = positions.get(nodes[i].id);
      for (let j = i + 1; j < nodes.length; j++) {
        const pj = positions.get(nodes[j].id);
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const force = (IDEAL * IDEAL) / dist;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        disp.get(nodes[i].id).dx += fx;
        disp.get(nodes[i].id).dy += fy;
        disp.get(nodes[j].id).dx -= fx;
        disp.get(nodes[j].id).dy -= fy;
      }
    }

    // Edge spring attraction (Hooke-like: dist² / k)
    for (const e of edges) {
      const ps = positions.get(e.source);
      const pt = positions.get(e.target);
      if (!ps || !pt) continue;
      const dx = ps.x - pt.x;
      const dy = ps.y - pt.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
      const force = (dist * dist) / IDEAL;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      disp.get(e.source).dx -= fx;
      disp.get(e.source).dy -= fy;
      disp.get(e.target).dx += fx;
      disp.get(e.target).dy += fy;
    }

    // Edge–node repulsion (push nodes away from non-adjacent edge segments)
    for (const node of nodes) {
      const np = positions.get(node.id);
      const d = disp.get(node.id);
      for (const edge of edges) {
        if (edge.source === node.id || edge.target === node.id) continue;
        const sp = positions.get(edge.source);
        const tp = positions.get(edge.target);
        if (!sp || !tp) continue;
        const abx = tp.x - sp.x;
        const aby = tp.y - sp.y;
        const len2 = abx * abx + aby * aby;
        if (len2 < 1) continue;
        const t = Math.max(0, Math.min(1, ((np.x - sp.x) * abx + (np.y - sp.y) * aby) / len2));
        const cx = sp.x + t * abx;
        const cy = sp.y + t * aby;
        const dx = np.x - cx;
        const dy = np.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        if (dist < MIN_EDGE_DIST) {
          const push = (MIN_EDGE_DIST - dist) * 1.5;
          d.dx += (dx / dist) * push;
          d.dy += (dy / dist) * push;
        }
      }
    }

    // Apply displacements, capped by temperature
    for (const n of nodes) {
      const d = disp.get(n.id);
      const mag = Math.sqrt(d.dx * d.dx + d.dy * d.dy) || 0.1;
      const step = Math.min(mag, temp);
      const pos = positions.get(n.id);
      pos.x += (d.dx / mag) * step;
      pos.y += (d.dy / mag) * step;
    }

    temp *= COOLING;
  }

  // Center on root
  const rootPos = positions.get(rootId) || { x: 0, y: 0 };

  return nodes.map((n) => ({
    ...n,
    position: {
      x: Math.round(positions.get(n.id).x - rootPos.x),
      y: Math.round(positions.get(n.id).y - rootPos.y)
    }
  }));
}
