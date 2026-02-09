import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PATHWAY_COLORS, PATHWAY_DASH, PATHWAY_LABELS } from './metroConstants';

const LINE_W = 28;

/** Small SVG showing a colored line sample with the correct dash pattern. */
function LineSample({ color, dash }) {
  return (
    <svg width={LINE_W} height={10} style={{ flexShrink: 0 }}>
      <line
        x1={0} y1={5} x2={LINE_W} y2={5}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={dash === '0' ? undefined : dash}
        strokeLinecap="round"
      />
    </svg>
  );
}

const LINES = Object.entries(PATHWAY_LABELS).map(([type, label]) => ({
  type,
  label,
  color: PATHWAY_COLORS[type],
  dash: PATHWAY_DASH[type] || '0'
}));

const STATIONS = [
  { label: 'Artist', shape: 'circle', size: 10 },
  { label: 'Genre', shape: 'square', size: 10 }
];

function StationSample({ shape, size }) {
  const r = size / 2;
  return (
    <svg width={14} height={14} style={{ flexShrink: 0 }}>
      {shape === 'circle' ? (
        <circle cx={7} cy={7} r={r} fill="none" stroke="#E0E0E0" strokeWidth={1.5} />
      ) : (
        <rect
          x={7 - r} y={7 - r} width={size} height={size}
          rx={1.5} fill="none" stroke="#E0E0E0" strokeWidth={1.5}
        />
      )}
    </svg>
  );
}

function MapLegend() {
  const sectionLabel = {
    color: '#9E9E9E',
    fontSize: '0.55rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    mb: 0.3
  };

  const itemRow = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    py: 0.15
  };

  const itemLabel = {
    color: '#BDBDBD',
    fontSize: '0.65rem',
    lineHeight: 1.2
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        zIndex: 5,
        backgroundColor: '#1E1E1Ecc',
        borderRadius: '6px',
        padding: '8px 12px',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.8,
        pointerEvents: 'auto',
        maxWidth: 160
      }}
    >
      {/* Lines */}
      <Box>
        <Typography sx={sectionLabel}>LINES</Typography>
        {LINES.map((l) => (
          <Box key={l.type} sx={itemRow}>
            <LineSample color={l.color} dash={l.dash} />
            <Typography sx={itemLabel}>{l.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Stations */}
      <Box>
        <Typography sx={sectionLabel}>STATIONS</Typography>
        {STATIONS.map((s) => (
          <Box key={s.label} sx={itemRow}>
            <StationSample shape={s.shape} size={s.size} />
            <Typography sx={itemLabel}>{s.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default memo(MapLegend);
