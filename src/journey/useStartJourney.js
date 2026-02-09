import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { journeyAPI } from '../api/journey-client';
import { useJourneyStore } from './journeyStore';

export function useStartJourney() {
  const navigate = useNavigate();
  const setCenter = useJourneyStore((s) => s.setCenter);
  const setGraph = useJourneyStore((s) => s.setGraph);
  const setCurrentJourneyId = useJourneyStore((s) => s.setCurrentJourneyId);
  const reset = useJourneyStore((s) => s.reset);

  return useCallback(async ({ nodeType, nodeId, nodeName, artistId, artistName }) => {
    reset();

    // When starting from a track, resolve to the primary artist
    const resolvedType = nodeType === 'track' ? 'artist' : nodeType;
    const resolvedId = nodeType === 'track' ? (artistId || nodeId) : nodeId;
    const resolvedName = nodeType === 'track' ? (artistName || nodeName) : nodeName;

    const resp = await journeyAPI.create({
      startingNodeType: resolvedType,
      startingNodeId: resolvedId,
      startingNodeName: resolvedName,
      title: `Journey from ${resolvedName}`
    });

    const journeyId = resp?.id;
    setCurrentJourneyId(journeyId);

    const center = { nodeType: resolvedType, nodeId: resolvedId, nodeName: resolvedName };
    setCenter(center);
    setGraph({
      nodes: [{ id: `center:${resolvedType}:${resolvedId}`, position: { x: 0, y: 0 }, data: { ...center, label: resolvedName } }],
      edges: []
    });

    navigate(`/journey/${journeyId}`);
    return journeyId;
  }, [navigate, reset, setCenter, setCurrentJourneyId, setGraph]);
}
