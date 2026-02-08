import React, { memo } from 'react';
import {
  PATHWAY_COLORS,
  PATHWAY_DASH,
  DEFAULT_NODE_COLOR
} from './metroConstants';

// Edge color = pathway/relationship type (the "metro line" color), not the target node.

/**
 * Compute metro-style bend between two points.
 * Returns SVG "L x y" for the bend point, or '' for a straight line.
 */
function metroBend(fromX, fromY, toX, toY) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // Exactly cardinal — already a clean straight line
  if (absDx < 1 || absDy < 1) return '';

  // Nearly 45° — straight diagonal is fine (within 5% or 5px)
  const minor = Math.min(absDx, absDy);
  if (Math.abs(absDx - absDy) < Math.max(5, minor * 0.05)) return '';

  // All other cases: 45° diagonal segment + cardinal segment.
  // This guarantees every line uses only 0°/45°/90° angles.
  const signX = dx >= 0 ? 1 : -1;
  const signY = dy >= 0 ? 1 : -1;

  if (absDx >= absDy) {
    return `L ${fromX + signX * minor} ${toY}`;
  } else {
    return `L ${toX} ${fromY + signY * minor}`;
  }
}

/**
 * Custom React Flow edge for the Metro/Subway theme.
 *
 * Each edge starts at the source node's border (facing the target) and ends
 * at the target node's border (facing the source). This ensures lines
 * emanate from the station and never cross sibling lines near a hub.
 */
function MetroRouteEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd
}) {
  const pathwayType = data?.pathwayType || '';
  const color = PATHWAY_COLORS[pathwayType] || DEFAULT_NODE_COLOR;
  const dashArray = PATHWAY_DASH[pathwayType] || '0';

  // Start from source border, end at target border
  const sx = sourceX + (data?.sourceDx || 0);
  const sy = sourceY + (data?.sourceDy || 0);
  const tx = targetX + (data?.targetDx || 0);
  const ty = targetY + (data?.targetDy || 0);

  const bend = metroBend(sx, sy, tx, ty);
  const edgePath = `M ${sx} ${sy} ${bend} L ${tx} ${ty}`;

  return (
    <path
      id={id}
      d={edgePath}
      stroke={color}
      strokeWidth={2.5}
      strokeDasharray={dashArray}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
      markerEnd={markerEnd}
      style={{ opacity: 0.85 }}
    />
  );
}

export default memo(MetroRouteEdge);
