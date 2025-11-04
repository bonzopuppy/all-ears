import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QueueContextMenu from './QueueContextMenu';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function QueueViewer({ open, onClose, queuedTracks, onClearQueue, onPlayTrack, currentTrack, onRemoveFromQueue, onAddToQueueNext, onReorderQueue }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const navigate = useNavigate();

  const formatDuration = (duration_ms) => {
    if (!duration_ms) return '--:--';
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = Math.floor((duration_ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMenuOpen = (event, track) => {
    event.stopPropagation(); // Prevent triggering the track click
    setMenuAnchor(event.currentTarget);
    setSelectedTrack(track);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTrack(null);
  };

  const handleRemove = () => {
    if (selectedTrack && onRemoveFromQueue) {
      onRemoveFromQueue(selectedTrack.uri);
    }
  };

  const handlePlayNext = () => {
    if (selectedTrack && onAddToQueueNext) {
      onAddToQueueNext(selectedTrack);
    }
  };

  const handleGoToAlbum = () => {
    if (selectedTrack?.album?.id) {
      navigate(`/album/${selectedTrack.album.id}`);
      onClose(); // Close the queue drawer when navigating
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination || !onReorderQueue) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) {
      return;
    }

    // Reorder the upNext array
    const newUpNext = Array.from(upNext);
    const [removed] = newUpNext.splice(sourceIndex, 1);
    newUpNext.splice(destIndex, 0, removed);

    // Call the reorder handler with the new order
    onReorderQueue(newUpNext);
  };

  // Split queue into now playing and up next
  const nowPlaying = currentTrack ? {
    uri: currentTrack.uri,
    title: currentTrack.name,
    artist: currentTrack.artists?.[0]?.name || '',
    image: currentTrack.album?.images?.[0]?.url || '',
    duration_ms: currentTrack.duration_ms
  } : null;

  // Filter out the currently playing track from the queue
  const upNext = queuedTracks.filter(track => track.uri !== currentTrack?.uri);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          backgroundColor: '#F4F2F7',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Up Next
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Track List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {!nowPlaying && upNext.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ color: 'text.secondary', marginBottom: '8px' }}>
                No tracks in queue
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Click on a song to start playing
              </Typography>
            </Box>
          ) : (
            <>
              {/* Now Playing Section */}
              {nowPlaying && (
                <>
                  <Box
                    sx={{
                      padding: '12px 20px',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Now Playing
                    </Typography>
                  </Box>
                  <List sx={{ padding: 0 }}>
                    <ListItem
                      sx={{
                        padding: '12px 20px',
                        backgroundColor: 'rgba(255, 110, 29, 0.08)',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={nowPlaying.image}
                          alt={nowPlaying.title}
                          sx={{ width: 48, height: 48 }}
                        >
                          {!nowPlaying.image && nowPlaying.title?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={nowPlaying.title}
                        secondary={nowPlaying.artist}
                        primaryTypographyProps={{
                          style: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: 600,
                          },
                        }}
                        secondaryTypographyProps={{
                          style: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                        sx={{ marginRight: '12px' }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          minWidth: '45px',
                          textAlign: 'right',
                        }}
                      >
                        {formatDuration(nowPlaying.duration_ms)}
                      </Typography>
                    </ListItem>
                  </List>
                </>
              )}

              {/* Up Next Section */}
              {upNext.length > 0 && (
                <>
                  <Box
                    sx={{
                      padding: '12px 20px',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Up Next ({upNext.length} {upNext.length === 1 ? 'track' : 'tracks'})
                    </Typography>
                  </Box>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="queue">
                      {(provided) => (
                        <List sx={{ padding: 0 }} {...provided.droppableProps} ref={provided.innerRef}>
                          {upNext.map((track, index) => (
                            <Draggable key={track.uri} draggableId={track.uri} index={index}>
                              {(provided, snapshot) => (
                                <React.Fragment>
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onPlayTrack && onPlayTrack(track)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    sx={{
                      padding: '12px 20px',
                      cursor: 'grab',
                      backgroundColor: snapshot.isDragging ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      },
                      '&:active': {
                        cursor: 'grabbing',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: '32px',
                        marginRight: '12px',
                        color: 'text.secondary',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <ListItemAvatar>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          variant="rounded"
                          src={track.image}
                          alt={track.title}
                          sx={{ width: 48, height: 48 }}
                        >
                          {!track.image && track.title?.[0]}
                        </Avatar>
                        {hoveredIndex === index && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              borderRadius: '4px',
                            }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: 'white',
                                width: 28,
                                height: 28,
                                '&:hover': {
                                  backgroundColor: 'white',
                                  '.MuiSvgIcon-root': {
                                    color: '#FF6E1D',
                                  }
                                },
                                '.MuiSvgIcon-root': {
                                  color: '#181C1E',
                                  fontSize: '18px',
                                }
                              }}
                            >
                              <PlayArrowIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={track.title}
                      secondary={track.artist}
                      primaryTypographyProps={{
                        style: {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                        },
                      }}
                      secondaryTypographyProps={{
                        style: {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                      }}
                      sx={{ marginRight: '12px' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          minWidth: '45px',
                          textAlign: 'right',
                        }}
                      >
                        {formatDuration(track.duration_ms)}
                      </Typography>
                      <IconButton
                        className="menuButton"
                        onClick={(event) => handleMenuOpen(event, track)}
                        sx={{
                          visibility: hoveredIndex === index ? 'visible' : 'hidden',
                          opacity: hoveredIndex === index ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                          color: 'primary.main',
                          '&:hover': {
                            color: 'secondary.main',
                            backgroundColor: 'rgba(255, 110, 29, 0.08)',
                          }
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < upNext.length - 1 && (
                    <Divider variant="inset" component="li" sx={{ marginLeft: '84px' }} />
                  )}
                                </React.Fragment>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </List>
                      )}
                    </Droppable>
                  </DragDropContext>
                </>
              )}
            </>
          )}
        </Box>

        {/* Clear Queue Button (Bottom) */}
        {upNext.length > 0 && (
          <Box sx={{ padding: '16px 20px', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClearQueue}
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  backgroundColor: 'rgba(255, 110, 29, 0.08)',
                },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Clear Queue
            </Button>
          </Box>
        )}
      </Box>

      {/* Context Menu */}
      <QueueContextMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onRemove={handleRemove}
        onPlayNext={handlePlayNext}
        onGoToAlbum={handleGoToAlbum}
      />
    </Drawer>
  );
}

export default QueueViewer;
