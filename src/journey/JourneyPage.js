import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import Typography from '@mui/material/Typography';

import { journeyAPI } from '../api/journey-client';
import { aiAPI } from '../api/ai-client';
import { spotifyJourneyAPI } from '../api/spotify-journey-client';
import { useJourneyStore } from './journeyStore';
import { pathwaysToGraph } from './graphTraversal';

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

  const nodes = useJourneyStore((s) => s.nodes);
  const edges = useJourneyStore((s) => s.edges);
  const visited = useJourneyStore((s) => s.visited);
  const tracks = useJourneyStore((s) => s.tracks);
  const isRecording = useJourneyStore((s) => s.isRecording);
  const setGraph = useJourneyStore((s) => s.setGraph);
  const setCenter = useJourneyStore((s) => s.setCenter);
  const setTracks = useJourneyStore((s) => s.setTracks);
  const setCurrentJourneyId = useJourneyStore((s) => s.setCurrentJourneyId);
  const startRecording = useJourneyStore((s) => s.startRecording);
  const stopRecording = useJourneyStore((s) => s.stopRecording);
  const visitNode = useJourneyStore((s) => s.visitNode);

  const [loading, setLoading] = useState(true);
  const [aiBusy, setAiBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [ended, setEnded] = useState(false);
  const [exportResult, setExportResult] = useState(null);

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

        const center = {
          nodeType: j?.starting_node_type,
          nodeId: j?.starting_node_id,
          nodeName: j?.starting_node_name
        };
        setCenter(center);

        const graph = j?.graph || {};
        const graphNodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
        const graphEdges = Array.isArray(graph?.edges) ? graph.edges : [];

        if (graphNodes.length) {
          setGraph({ nodes: graphNodes, edges: graphEdges });
        } else {
          // Ensure at least a center node exists.
          setGraph({
            nodes: [{ id: `center:${center.nodeType}:${center.nodeId}`, position: { x: 0, y: 0 }, data: center }],
            edges: []
          });
        }

        setTracks(Array.isArray(j?.tracks) ? j.tracks : []);
      } catch (e) {
        console.error('[JourneyPage] load failed', e);
        setStatus(e?.message || 'Failed to load journey');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id, setCenter, setCurrentJourneyId, setGraph, setTracks]);

  const onNodesChange = useCallback((changes) => {
    setGraph({ nodes: applyNodeChanges(changes, nodes), edges });
  }, [edges, nodes, setGraph]);

  const onEdgesChange = useCallback((changes) => {
    setGraph({ nodes, edges: applyEdgeChanges(changes, edges) });
  }, [edges, nodes, setGraph]);

  const context = useMemo(() => ({
    previousNodes: visited.map((v) => ({ name: v?.nodeName || v?.name }))
  }), [visited]);

  const handleNodeClick = useCallback(async (_evt, node) => {
    const data = node?.data;
    if (!data?.nodeType || !data?.nodeId || !data?.nodeName) return;

    visitNode(data);

    setAiBusy(true);
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

      const merged = mergeGraph({
        existingNodes: nodes,
        existingEdges: edges,
        newNodes: newNodes.filter((n) => !n.id.startsWith('center:')),
        newEdges
      });

      setGraph(merged);
    } catch (e) {
      console.error('[JourneyPage] generate pathways failed', e);
      setStatus(e?.message || 'Failed to generate pathways');
    } finally {
      setAiBusy(false);
    }
  }, [context, edges, nodes, setGraph, visitNode]);

  const handleSave = useCallback(async () => {
    setStatus('Saving...');
    try {
      await journeyAPI.update(id, {
        nodesVisited: visited,
        tracks,
        graph: { nodes, edges }
      });
      setStatus('Saved.');
      setTimeout(() => setStatus(''), 1200);
    } catch (e) {
      console.error('[JourneyPage] save failed', e);
      setStatus(e?.message || 'Save failed');
    }
  }, [edges, id, nodes, tracks, visited]);

  const handleExport = useCallback(async () => {
    setStatus('Exporting to Spotify...');
    try {
      const r = await spotifyJourneyAPI.exportJourneyToPlaylist({ journeyId: id });
      setExportResult(r?.playlist || r);
      setStatus('Exported.');
    } catch (e) {
      console.error('[JourneyPage] export failed', e);
      setStatus(e?.message || 'Export failed');
    }
  }, [id]);

  const handleEnd = useCallback(() => {
    setEnded(true);
    stopRecording();
  }, [stopRecording]);

  if (loading) {
    return <Box sx={{ padding: 3 }}><Typography>Loading journey...</Typography></Box>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5">Musical Journey</Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {!isRecording ? (
            <Button variant="contained" onClick={startRecording}>Start Recording</Button>
          ) : (
            <Button variant="outlined" onClick={stopRecording}>Stop Recording</Button>
          )}

          <Button variant="outlined" onClick={handleSave}>Save</Button>
          <Button variant="outlined" onClick={handleExport}>Export Playlist</Button>
          <Button variant="contained" color="secondary" onClick={handleEnd}>End Journey</Button>
        </Box>
      </Box>

      {(status || aiBusy) && (
        <Box sx={{ marginTop: 1 }}>
          <Typography variant="body2">{aiBusy ? 'Generating pathways...' : status}</Typography>
        </Box>
      )}

      {ended && (
        <Box sx={{ marginTop: 2, padding: 2, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1 }}>
          <Typography variant="h6">Journey Summary</Typography>
          <Typography variant="body2">Visited nodes: {visited.length}</Typography>
          <Typography variant="body2">Tracks collected: {tracks.length}</Typography>
          {exportResult?.external_urls?.spotify && (
            <Typography variant="body2">
              Playlist: <a href={exportResult.external_urls.spotify} target="_blank" rel="noreferrer">Open on Spotify</a>
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ height: '70vh', marginTop: 2, border: '1px solid rgba(0,0,0,0.12)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </Box>
    </Box>
  );
}
