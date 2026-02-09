import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NODE_SIZE, resolveNodeColor } from './metroConstants';

/**
 * Custom React Flow node for the Metro/Subway theme.
 *
 * Shapes:
 *  - artist: circle (capsule when stretched)
 *  - genre:  rounded square
 *
 * States:
 *  - unvisited: hollow outline (border only, transparent fill)
 *  - visited:   filled solid
 *  - current:   filled + pulse glow animation
 */
function MetroStationNode({ data }) {
  const nodeType = data?.nodeType || 'artist';
  const color = resolveNodeColor(data);
  const isCurrent = data?.isCurrent || false;
  const isVisited = data?.isVisited || isCurrent;

  // Use oval dimensions from layout (capsule stations for busy hubs)
  const baseSize = NODE_SIZE[nodeType] || NODE_SIZE.artist;
  const w = data?.ovalWidth || baseSize;
  const h = data?.ovalHeight || baseSize;

  const isGenre = nodeType === 'genre';
  const borderRadius = isGenre ? '3px' : `${Math.min(w, h) / 2}px`;

  const stationSx = {
    width: w,
    height: h,
    borderRadius,
    border: `2px solid ${color}`,
    backgroundColor: isVisited ? color : '#121212',
    transition: 'background-color 0.2s, transform 0.15s',
    cursor: 'pointer',
    ...(isCurrent && {
      animation: 'metroPulse 1.2s ease-in-out infinite',
      boxShadow: `0 0 12px 4px ${color}88`
    }),
    '&:hover': {
      transform: 'scale(1.15)'
    }
  };

  const labelSx = {
    position: 'absolute',
    top: h + 6,
    left: '50%',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.7rem',
    color: '#E0E0E0',
    backgroundColor: '#121212dd',
    padding: '1px 4px',
    borderRadius: '2px',
    textAlign: 'center',
    lineHeight: 1.2,
    pointerEvents: 'none',
    '&:hover': {
      maxWidth: 'none',
      overflow: 'visible'
    }
  };

  // Single centered handle for each type so edges connect to node center
  const centeredHandle = {
    opacity: 0,
    width: 1,
    height: 1,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 0,
    minHeight: 0
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Handle type="target" position={Position.Top} style={centeredHandle} />

      <Box sx={stationSx} />

      <Typography component="div" sx={labelSx}>
        {data?.label || data?.nodeName || ''}
      </Typography>

      <Handle type="source" position={Position.Bottom} style={centeredHandle} />
    </Box>
  );
}

export default memo(MetroStationNode);
