import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { resolveNodeColor, PATHWAY_LABELS } from './metroConstants';

/**
 * Right-side overlay panel showing details about a selected node.
 * Shows ALL connections (incoming and outgoing) from the graph edges.
 *
 * @param {object} props
 * @param {object} props.node - React Flow node
 * @param {Array}  props.connections - [{ nodeName, pathwayType, direction: 'from'|'to' }]
 * @param {Function} props.onClose
 * @param {Function} props.onExpand
 * @param {boolean}  props.isExpanding
 */
function NodeDetailPanel({ node, connections = [], onClose, onExpand, isExpanding }) {
  if (!node) return null;

  const data = node.data || {};
  const color = resolveNodeColor(data);
  const nodeType = data.nodeType || 'unknown';
  const tracks = data.representativeTrackTitles || [];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 320,
        height: '100%',
        backgroundColor: '#1E1E1E',
        borderLeft: `3px solid ${color}`,
        zIndex: 10,
        overflowY: 'auto',
        padding: 2.5,
        paddingBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Chip
          label={nodeType.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: `${color}22`,
            color,
            fontWeight: 600,
            fontSize: '0.65rem',
            letterSpacing: '0.05em',
            borderRadius: '4px'
          }}
        />
        <IconButton onClick={onClose} size="small" sx={{ color: '#9E9E9E' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="h6" sx={{ color: '#FAFAFA', fontWeight: 600, lineHeight: 1.3 }}>
        {data.nodeName || data.label || ''}
      </Typography>

      {data.description && (
        <Typography variant="body2" sx={{ color: '#BDBDBD', lineHeight: 1.5 }}>
          {data.description}
        </Typography>
      )}

      {connections.length > 0 && (
        <Box>
          <Typography variant="caption" sx={{ color: '#9E9E9E', fontWeight: 600, mb: 0.5, display: 'block' }}>
            CONNECTIONS
          </Typography>
          {connections.map((c, i) => {
            const label = PATHWAY_LABELS[c.pathwayType] || c.pathwayType || '';
            const arrow = c.direction === 'from' ? '\u2190' : '\u2192';
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, py: 0.4 }}>
                <Typography
                  variant="body2"
                  sx={{ color: '#9E9E9E', fontSize: '0.75rem', flexShrink: 0 }}
                >
                  {arrow}
                </Typography>
                <Typography variant="body2" sx={{ color: '#E0E0E0', fontSize: '0.8rem' }}>
                  {label ? `${label} ${c.nodeName}` : c.nodeName}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {tracks.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#9E9E9E', fontWeight: 600, mb: 0.5, display: 'block' }}>
            REPRESENTATIVE TRACKS
          </Typography>
          {tracks.map((title, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.5
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: color,
                  flexShrink: 0
                }}
              />
              <Typography variant="body2" sx={{ color: '#E0E0E0', fontSize: '0.8rem' }}>
                {title}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {onExpand && (
        <Button
          variant="contained"
          onClick={() => onExpand(node)}
          disabled={isExpanding}
          sx={{
            mt: 2,
            backgroundColor: color,
            color: '#fff',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { backgroundColor: color, filter: 'brightness(1.15)' },
            '&.Mui-disabled': { backgroundColor: `${color}44`, color: '#999' }
          }}
        >
          {isExpanding ? 'Mapping new routes...' : 'Continue Journey From Here'}
        </Button>
      )}
    </Box>
  );
}

export default memo(NodeDetailPanel);
