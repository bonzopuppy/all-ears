import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { journeyAPI } from '../api/journey-client';
import { aiAPI } from '../api/ai-client';
import { spotifyJourneyAPI } from '../api/spotify-journey-client';
import { spotifyAPI } from '../api/spotify-client';
import { useMusicContext } from '../components/MusicContext';
import MusicPlayer from '../components/MusicPlayer';
import { useJourneyStore } from './journeyStore';
import { pathwaysToGraph, layoutFullGraph } from './graphTraversal';
import MetroStationNode from './metro/MetroStationNode';
import MetroRouteEdge from './metro/MetroRouteEdge';
import NodeDetailPanel from './metro/NodeDetailPanel';
import MapLegend from './metro/MapLegend';
import { resolveNodeColor, NODE_SIZE } from './metro/metroConstants';

// Module-level constants — React Flow requires stable references
const nodeTypes = { metroStation: MetroStationNode };
const edgeTypes = { metroRoute: MetroRouteEdge };

const pulseKeyframes = (
  <GlobalStyles
    styles={{
      '@keyframes metroPulse': {
        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
        '50%': { opacity: 0.7, transform: 'scale(1.12)' }
      }
    }}
  />
);

/**
 * Merge new nodes/edges into existing graph.
 * Duplicate nodes are skipped (existing kept). Duplicate edges are skipped.
 * Cross-connections: if a new node already exists, only the edge is added.
 */
function mergeGraph({ existingNodes, existingEdges, newNodes, newEdges }) {
  const nodeMap = new Map(existingNodes.map((n) => [n.id, n]));
  for (const n of newNodes) {
    if (!nodeMap.has(n.id)) nodeMap.set(n.id, n);
  }

  const edgeMap = new Map(existingEdges.map((e) => [e.id, e]));
  for (const e of newEdges) {
    if (!edgeMap.has(e.id)) edgeMap.set(e.id, e);
  }

  return { nodes: Array.from(nodeMap.values()), edges: Array.from(edgeMap.values()) };
}

export default function JourneyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack: musicPlayTrack } = useMusicContext();

  const center = useJourneyStore((s) => s.center);
  const nodes = useJourneyStore((s) => s.nodes);
  const edges = useJourneyStore((s) => s.edges);
  const visited = useJourneyStore((s) => s.visited);
  const playlist = useJourneyStore((s) => s.playlist);
  const setGraph = useJourneyStore((s) => s.setGraph);
  const setCenter = useJourneyStore((s) => s.setCenter);
  const setCurrentJourneyId = useJourneyStore((s) => s.setCurrentJourneyId);
  const addToPlaylist = useJourneyStore((s) => s.addToPlaylist);
  const removeFromPlaylist = useJourneyStore((s) => s.removeFromPlaylist);
  const clearPlaylist = useJourneyStore((s) => s.clearPlaylist);

  const [loading, setLoading] = useState(true);
  const [isMapping, setIsMapping] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const rfInstance = useRef(null);
  const autoExpandedRef = useRef(false);
  const resolveCache = useRef(new Map());

  // The root node ID for layout (the starting node of the journey)
  const rootId = center
    ? `center:${center.nodeType}:${center.nodeId}`
    : null;

  // --- Track resolution ---
  const resolveTrack = useCallback(async (trackTitle, artistName) => {
    const cacheKey = `${trackTitle}|${artistName}`;
    if (resolveCache.current.has(cacheKey)) {
      return resolveCache.current.get(cacheKey);
    }

    const query = artistName
      ? `${trackTitle} artist:${artistName}`
      : trackTitle;

    const result = await spotifyAPI.search(query, 'track', 1);
    const track = result?.tracks?.items?.[0] || null;

    if (track) {
      const resolved = {
        uri: track.uri,
        name: track.name,
        artist: track.artists?.[0]?.name || '',
        image: track.album?.images?.[0]?.url || '',
        albumName: track.album?.name || '',
        // Keep the full Spotify object for playTrack compatibility
        _raw: track
      };
      resolveCache.current.set(cacheKey, resolved);
      return resolved;
    }

    return null;
  }, []);

  // Helper to set loading state for a track key
  const withTrackLoading = useCallback(async (title, artistName, fn) => {
    const key = `${title}|${artistName}`;
    setLoadingTracks((prev) => new Set(prev).add(key));
    try {
      await fn();
    } finally {
      setLoadingTracks((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }, []);

  // --- Handlers for NodeDetailPanel ---
  const handlePlayTrack = useCallback(async (title, artistName) => {
    await withTrackLoading(title, artistName, async () => {
      const resolved = await resolveTrack(title, artistName);
      if (!resolved) {
        setStatus(`Could not find "${title}" on Spotify`);
        setTimeout(() => setStatus(''), 3000);
        return;
      }
      musicPlayTrack(resolved._raw);
    });
  }, [resolveTrack, musicPlayTrack, withTrackLoading]);

  const handleAddTrack = useCallback(async (title, artistName) => {
    await withTrackLoading(title, artistName, async () => {
      const resolved = await resolveTrack(title, artistName);
      if (!resolved) {
        setStatus(`Could not find "${title}" on Spotify`);
        setTimeout(() => setStatus(''), 3000);
        return;
      }
      addToPlaylist(resolved);
    });
  }, [resolveTrack, addToPlaylist, withTrackLoading]);

  const handleSavePlaylist = useCallback(async () => {
    if (playlist.length === 0) return;
    setIsSaving(true);
    setStatus('Saving to Spotify...');
    try {
      const trackUris = playlist.map((t) => t.uri);
      const title = center?.nodeName
        ? `Journey from ${center.nodeName}`
        : 'Musical Journey';
      await spotifyJourneyAPI.exportJourneyToPlaylist({
        title,
        description: `Musical journey playlist with ${playlist.length} tracks`,
        trackUris
      });
      setStatus('Playlist saved to Spotify!');
      setTimeout(() => setStatus(''), 3000);
    } catch (e) {
      console.error('[JourneyPage] save playlist failed', e);
      setStatus(e?.message || 'Failed to save playlist');
      setTimeout(() => setStatus(''), 4000);
    } finally {
      setIsSaving(false);
    }
  }, [playlist, center, id]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setStatus('');
      try {
        const resp = await journeyAPI.get(id);
        if (!mounted) return;
        const j = resp?.journey;
        setCurrentJourneyId(j?.id);

        const c = {
          nodeType: j?.starting_node_type,
          nodeId: j?.starting_node_id,
          nodeName: j?.starting_node_name
        };
        setCenter(c);

        const graph = j?.graph || {};
        const graphNodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
        const graphEdges = Array.isArray(graph?.edges) ? graph.edges : [];

        if (graphNodes.length) {
          setGraph({ nodes: graphNodes, edges: graphEdges });
        } else {
          setGraph({
            nodes: [{ id: `center:${c.nodeType}:${c.nodeId}`, position: { x: 0, y: 0 }, data: { ...c, label: c.nodeName } }],
            edges: []
          });
        }
      } catch (e) {
        console.error('[JourneyPage] load failed', e);
        setStatus(e?.message || 'Failed to load journey');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (id) load();
    return () => { mounted = false; };
  }, [id, setCenter, setCurrentJourneyId, setGraph]);

  const onNodesChange = useCallback((changes) => {
    setGraph({ nodes: applyNodeChanges(changes, nodes), edges });
  }, [edges, nodes, setGraph]);

  const onEdgesChange = useCallback((changes) => {
    setGraph({ nodes, edges: applyEdgeChanges(changes, edges) });
  }, [edges, nodes, setGraph]);

  const context = useMemo(() => ({
    previousNodes: visited.map((v) => ({ name: v?.nodeName || v?.name }))
  }), [visited]);

  // Build a set of visited node IDs for quick lookup
  const visitedIds = useMemo(() => {
    const ids = new Set();
    for (const v of visited) {
      if (v?.nodeType && v?.nodeId) {
        ids.add(`center:${v.nodeType}:${v.nodeId}`);
        ids.add(`node:${v.nodeType}:${v.nodeId}`);
      }
    }
    return ids;
  }, [visited]);

  const currentVisited = visited.length > 0 ? visited[visited.length - 1] : null;
  const currentNodeKey = currentVisited
    ? `${currentVisited.nodeType}:${currentVisited.nodeId}`
    : null;

  // Compute oval/capsule dimensions for each node based on edge directions.
  const ovalDims = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const LINE_SPACING = 8;
    const dims = new Map();

    const totalConns = new Map();
    const sideCounts = new Map();

    for (const n of nodes) {
      sideCounts.set(n.id, { top: 0, bottom: 0, left: 0, right: 0 });
    }

    for (const e of edges) {
      totalConns.set(e.source, (totalConns.get(e.source) || 0) + 1);
      totalConns.set(e.target, (totalConns.get(e.target) || 0) + 1);

      const src = nodeMap.get(e.source);
      const tgt = nodeMap.get(e.target);
      if (!src || !tgt) continue;

      const angle = Math.atan2(
        tgt.position.y - src.position.y,
        tgt.position.x - src.position.x
      );
      const absAngle = Math.abs(angle);

      let srcSide, tgtSide;
      if (absAngle > 3 * Math.PI / 4) { srcSide = 'left'; tgtSide = 'right'; }
      else if (absAngle < Math.PI / 4) { srcSide = 'right'; tgtSide = 'left'; }
      else if (angle < 0) { srcSide = 'top'; tgtSide = 'bottom'; }
      else { srcSide = 'bottom'; tgtSide = 'top'; }

      const sc = sideCounts.get(e.source);
      const tc = sideCounts.get(e.target);
      if (sc) sc[srcSide]++;
      if (tc) tc[tgtSide]++;
    }

    for (const n of nodes) {
      const nodeType = n.data?.nodeType || 'artist';
      const baseSize = NODE_SIZE[nodeType] || NODE_SIZE.artist;

      const connCount = totalConns.get(n.id) || 0;
      const growth = Math.min(Math.max(0, connCount - 2), 5) * 2;
      const size = baseSize + growth;

      const c = sideCounts.get(n.id) || { top: 0, bottom: 0, left: 0, right: 0 };
      const vertMax = Math.max(c.top, c.bottom);
      const horizMax = Math.max(c.left, c.right);

      dims.set(n.id, {
        width: Math.max(size, vertMax > 1 ? (vertMax - 1) * LINE_SPACING + size : size),
        height: Math.max(size, horizMax > 1 ? (horizMax - 1) * LINE_SPACING + size : size)
      });
    }

    return dims;
  }, [nodes, edges]);

  // Decorate nodes with Metro theme type, state flags, and oval dimensions
  const decoratedNodes = useMemo(() => {
    const connectionCounts = new Map();
    for (const e of edges) {
      connectionCounts.set(e.source, (connectionCounts.get(e.source) || 0) + 1);
      connectionCounts.set(e.target, (connectionCounts.get(e.target) || 0) + 1);
    }

    return nodes.map((n) => {
      const dims = ovalDims.get(n.id) || { width: 14, height: 14 };
      return {
        ...n,
        type: 'metroStation',
        data: {
          ...n.data,
          isVisited: visitedIds.has(n.id),
          isCurrent: currentNodeKey ? n.id.endsWith(currentNodeKey) : false,
          connectionCount: connectionCounts.get(n.id) || 0,
          ovalWidth: dims.width,
          ovalHeight: dims.height
        }
      };
    });
  }, [nodes, edges, visitedIds, currentNodeKey, ovalDims]);

  // Decorate edges with Metro theme type + target node color + side-exit offsets.
  const decoratedEdges = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const sideEdges = new Map();
    for (const n of nodes) {
      sideEdges.set(n.id, { top: [], bottom: [], left: [], right: [] });
    }

    for (const e of edges) {
      const src = nodeMap.get(e.source);
      const tgt = nodeMap.get(e.target);
      if (!src || !tgt) continue;

      const angle = Math.atan2(
        tgt.position.y - src.position.y,
        tgt.position.x - src.position.x
      );
      const absAngle = Math.abs(angle);

      let srcSide, tgtSide;
      if (absAngle > 3 * Math.PI / 4) { srcSide = 'left'; tgtSide = 'right'; }
      else if (absAngle < Math.PI / 4) { srcSide = 'right'; tgtSide = 'left'; }
      else if (angle < 0) { srcSide = 'top'; tgtSide = 'bottom'; }
      else { srcSide = 'bottom'; tgtSide = 'top'; }

      const se = sideEdges.get(e.source);
      if (se) se[srcSide].push({ edgeId: e.id, isSource: true, otherX: tgt.position.x, otherY: tgt.position.y });
      const te = sideEdges.get(e.target);
      if (te) te[tgtSide].push({ edgeId: e.id, isSource: false, otherX: src.position.x, otherY: src.position.y });
    }

    const EDGE_SPACING = 8;
    const exitMap = new Map();

    for (const [nodeId, sides] of sideEdges) {
      const dims = ovalDims.get(nodeId) || { width: 14, height: 14 };
      const w = dims.width;
      const h = dims.height;

      for (const [sideName, refs] of Object.entries(sides)) {
        if (!refs.length) continue;

        const isHoriz = sideName === 'top' || sideName === 'bottom';
        refs.sort((a, b) => isHoriz ? a.otherX - b.otherX : a.otherY - b.otherY);

        const n = refs.length;
        const maxDim = isHoriz ? w : h;
        const span = Math.min(EDGE_SPACING * (n - 1), maxDim * 0.7);

        refs.forEach((ref, i) => {
          if (!exitMap.has(ref.edgeId)) {
            exitMap.set(ref.edgeId, { sourceDx: 0, sourceDy: 0, targetDx: 0, targetDy: 0 });
          }
          const entry = exitMap.get(ref.edgeId);

          const t = n <= 1 ? 0 : -span / 2 + (span * i) / (n - 1);
          let dx, dy;
          if (isHoriz) {
            dx = t;
            dy = sideName === 'top' ? -h / 2 : h / 2;
          } else {
            dx = sideName === 'left' ? -w / 2 : w / 2;
            dy = t;
          }

          if (ref.isSource) {
            entry.sourceDx = dx;
            entry.sourceDy = dy;
          } else {
            entry.targetDx = dx;
            entry.targetDy = dy;
          }
        });
      }
    }

    return edges.map((e) => {
      const pts = exitMap.get(e.id) || { sourceDx: 0, sourceDy: 0, targetDx: 0, targetDy: 0 };

      return {
        ...e,
        type: 'metroRoute',
        data: {
          ...e.data,
          sourceDx: pts.sourceDx,
          sourceDy: pts.sourceDy,
          targetDx: pts.targetDx,
          targetDy: pts.targetDy
        }
      };
    });
  }, [edges, nodes, ovalDims]);

  // All connections for the selected node (incoming and outgoing)
  const selectedConnections = useMemo(() => {
    if (!selectedNode) return [];
    const nodeId = selectedNode.id;
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return edges
      .filter((e) => e.target === nodeId || e.source === nodeId)
      .map((e) => {
        const isIncoming = e.target === nodeId;
        const otherId = isIncoming ? e.source : e.target;
        const otherNode = nodeMap.get(otherId);
        return {
          nodeName: otherNode?.data?.nodeName || otherNode?.data?.label || 'Unknown',
          pathwayType: e.data?.pathwayType || '',
          direction: isIncoming ? 'from' : 'to'
        };
      });
  }, [selectedNode, edges, nodes]);

  // --- Click = inspect only (detail panel) ---
  const handleNodeClick = useCallback((_evt, node) => {
    setSelectedNode(node);
  }, []);

  // --- "Continue Journey From Here" — expand from selected node ---
  const handleExpandNode = useCallback(async (node) => {
    const data = node?.data;
    if (!data?.nodeType || !data?.nodeId || !data?.nodeName) return;

    setIsMapping(true);
    setStatus('');
    try {
      const pathways = await aiAPI.generatePathways({
        nodeType: data.nodeType,
        nodeId: data.nodeId,
        nodeName: data.nodeName,
        context
      });

      const { nodes: newNodes, edges: newEdges } = pathwaysToGraph({
        center: data,
        pathwaysResponse: pathways
      });

      // Rewrite edge sources: center:type:id → the clicked node's actual graph id
      const clickedNodeId = node.id;
      const centerId = `center:${data.nodeType}:${data.nodeId}`;
      const fixedEdges = newEdges.map((e) => ({
        ...e,
        source: e.source === centerId ? clickedNodeId : e.source
      }));

      // Filter out the center node from new nodes (it already exists as the clicked node)
      const childNodes = newNodes.filter((n) => !n.id.startsWith('center:'));

      // Merge — duplicates are skipped, cross-connection edges are kept
      const merged = mergeGraph({
        existingNodes: nodes,
        existingEdges: edges,
        newNodes: childNodes,
        newEdges: fixedEdges
      });

      // Full re-layout from the journey root
      const laid = layoutFullGraph({
        nodes: merged.nodes,
        edges: merged.edges,
        rootId
      });

      setGraph({ nodes: laid, edges: merged.edges });
      setSelectedNode(null);

      // After render, zoom to show the expanded node + its direct connections
      const neighborIds = new Set([clickedNodeId]);
      for (const e of merged.edges) {
        if (e.source === clickedNodeId) neighborIds.add(e.target);
        if (e.target === clickedNodeId) neighborIds.add(e.source);
      }
      const fitNodes = Array.from(neighborIds).map((nid) => ({ id: nid }));
      setTimeout(() => {
        rfInstance.current?.fitView({ nodes: fitNodes, padding: 0.3, duration: 500 });
      }, 50);
    } catch (e) {
      console.error('[JourneyPage] generate pathways failed', e);
      setStatus(e?.message || 'Failed to generate pathways');
    } finally {
      setIsMapping(false);
    }
  }, [context, edges, nodes, rootId, setGraph]);

  // Auto-expand the center node on fresh journeys (single node, no edges)
  useEffect(() => {
    if (loading || autoExpandedRef.current || isMapping) return;
    if (nodes.length !== 1 || edges.length !== 0) return;

    const centerNode = nodes[0];
    const data = centerNode?.data;
    if (!data?.nodeType || !data?.nodeId || !data?.nodeName) return;

    autoExpandedRef.current = true;
    handleExpandNode(centerNode);
  }, [loading, nodes, edges, isMapping, handleExpandNode]);

  const handleEnd = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const miniMapNodeColor = useCallback((node) => {
    return resolveNodeColor(node.data);
  }, []);

  if (loading) {
    return (
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 1200, backgroundColor: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#E0E0E0' }}>Loading journey...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 88, zIndex: 1200, backgroundColor: '#121212' }}>
      {pulseKeyframes}

      {/* Full-screen graph */}
      <ReactFlow
        nodes={decoratedNodes}
        edges={decoratedEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onInit={(instance) => { rfInstance.current = instance; }}
        nodesDraggable={false}
        proOptions={{ hideAttribution: true }}
        fitView
        style={{ backgroundColor: '#121212' }}
      >
        <MiniMap
          nodeColor={miniMapNodeColor}
          maskColor="rgba(0,0,0,0.7)"
          style={{ backgroundColor: '#1E1E1E' }}
        />
        <Controls
          style={{ button: { backgroundColor: '#2A2A2A', color: '#E0E0E0', borderColor: '#444' } }}
        />
        <Background color="#333" gap={20} size={1} />
      </ReactFlow>

      {/* Floating toolbar — top-left */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backgroundColor: '#1E1E1Ecc',
            borderRadius: showPlaylistDrawer ? '6px 6px 0 0' : '6px',
            padding: '4px 8px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <IconButton size="small" onClick={handleEnd} sx={{ color: '#E0E0E0' }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          <Typography variant="body2" sx={{ color: '#FAFAFA', fontWeight: 600, mr: 1, fontSize: '0.85rem' }}>
            Journey
          </Typography>

          <Chip
            icon={<QueueMusicIcon sx={{ fontSize: 16, color: 'inherit !important' }} />}
            label={`${playlist.length} track${playlist.length !== 1 ? 's' : ''}`}
            size="small"
            onClick={() => setShowPlaylistDrawer((v) => !v)}
            sx={{
              backgroundColor: playlist.length > 0 ? '#FF6E1D33' : '#333',
              color: playlist.length > 0 ? '#FF6E1D' : '#9E9E9E',
              fontWeight: 600,
              fontSize: '0.75rem',
              cursor: 'pointer',
              border: playlist.length > 0 ? '1px solid #FF6E1D55' : '1px solid transparent',
              '&:hover': { backgroundColor: playlist.length > 0 ? '#FF6E1D44' : '#444' }
            }}
          />

          {playlist.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleSavePlaylist}
              disabled={isSaving}
              sx={{
                color: '#4CAF50',
                borderColor: '#4CAF5066',
                fontSize: '0.7rem',
                textTransform: 'none',
                minWidth: 0,
                px: 1.5,
                py: 0.3,
                ml: 0.5,
                '&:hover': { borderColor: '#4CAF50', backgroundColor: '#4CAF5018' },
                '&.Mui-disabled': { color: '#4CAF5066', borderColor: '#4CAF5033' }
              }}
            >
              {isSaving ? 'Saving...' : 'Save to Spotify'}
            </Button>
          )}
        </Box>

        {/* Playlist drawer */}
        {showPlaylistDrawer && (
          <Box
            sx={{
              backgroundColor: '#1E1E1Ecc',
              borderRadius: '0 0 6px 6px',
              backdropFilter: 'blur(8px)',
              maxHeight: 320,
              overflowY: 'auto',
              borderTop: '1px solid #333'
            }}
          >
            {playlist.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: '#9E9E9E', fontSize: '0.75rem', p: 2, textAlign: 'center' }}
              >
                No tracks added yet. Click + on tracks in the detail panel.
              </Typography>
            ) : (
              <>
                {playlist.map((track) => (
                  <Box
                    key={track.uri}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 0.75,
                      '&:hover': { backgroundColor: '#2A2A2A44' }
                    }}
                  >
                    {track.image && (
                      <Box
                        component="img"
                        src={track.image}
                        alt=""
                        sx={{ width: 28, height: 28, borderRadius: '3px', flexShrink: 0 }}
                      />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ color: '#E0E0E0', fontSize: '0.75rem', lineHeight: 1.3 }}
                      >
                        {track.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ color: '#9E9E9E', fontSize: '0.65rem', lineHeight: 1.2 }}
                      >
                        {track.artist}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => removeFromPlaylist(track.uri)}
                      sx={{ color: '#9E9E9E', p: 0.3, '&:hover': { color: '#FF5252' } }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 0.75,
                    borderTop: '1px solid #333'
                  }}
                >
                  <Button
                    size="small"
                    onClick={clearPlaylist}
                    startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      color: '#9E9E9E',
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      '&:hover': { color: '#FF5252' }
                    }}
                  >
                    Clear All
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>

      {/* Status toast — top-center */}
      {status && (
        <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 5, backgroundColor: '#1E1E1Ecc', borderRadius: '6px', px: 2, py: 0.5, backdropFilter: 'blur(8px)' }}>
          <Typography variant="body2" sx={{ color: '#BDBDBD', fontSize: '0.8rem' }}>{status}</Typography>
        </Box>
      )}

      {/* Legend — bottom-left */}
      <MapLegend />

      {/* Detail panel — full height, above everything */}
      <NodeDetailPanel
        node={selectedNode}
        connections={selectedConnections}
        onClose={() => setSelectedNode(null)}
        onExpand={handleExpandNode}
        isExpanding={isMapping}
        onPlayTrack={handlePlayTrack}
        onAddTrack={handleAddTrack}
        playlist={playlist}
        loadingTracks={loadingTracks}
      />

      {/* Music player — sits below the canvas in a dark wrapper */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 88,
          zIndex: 1200,
          // Dark theme overrides for MusicPlayer
          '& > .MuiBox-root': {
            backgroundColor: '#1A1A1A !important',
            borderTop: '1px solid #2A2A2A'
          },
          '& .MuiTypography-subtitle1': { color: '#E0E0E0 !important' },
          '& .MuiTypography-subtitle2': { color: '#9E9E9E !important' },
          '& .MuiTypography-root': { color: '#BDBDBD' },
          '& .MuiIconButton-root': { color: '#E0E0E0 !important' },
          '& .MuiIconButton-root:hover': { color: '#FF6E1D !important' },
          '& .MuiSlider-track': { color: '#E0E0E0 !important' },
          '& .MuiSlider-rail': { color: '#555 !important' },
          '& .MuiBadge-badge': { backgroundColor: '#FF6E1D !important' }
        }}
      >
        <MusicPlayer />
      </Box>

      {/* "Mapping new routes..." overlay */}
      {isMapping && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(18, 18, 18, 0.85)',
            zIndex: 1201,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <CircularProgress sx={{ color: '#FF6E1D' }} />
          <Typography variant="h6" sx={{ color: '#FAFAFA', fontWeight: 500 }}>
            Mapping new routes...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
