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

  return useCallback(async ({ nodeType, nodeId, nodeName }) => {
    reset();
    const resp = await journeyAPI.create({
      startingNodeType: nodeType,
      startingNodeId: nodeId,
      startingNodeName: nodeName,
      title: `Journey from ${nodeName}`
    });

    const journeyId = resp?.id;
    setCurrentJourneyId(journeyId);

    const center = { nodeType, nodeId, nodeName };
    setCenter(center);
    setGraph({
      nodes: [{ id: `center:${nodeType}:${nodeId}`, position: { x: 0, y: 0 }, data: center }],
      edges: []
    });

    navigate(`/journey/${journeyId}`);
    return journeyId;
  }, [navigate, reset, setCenter, setCurrentJourneyId, setGraph]);
}
