import React, { useEffect, useState } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import MicIcon from "@mui/icons-material/Mic";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import RadioIcon from "@mui/icons-material/Radio";
import { useMusicContext } from './MusicContext';
import { useNavigate } from 'react-router-dom';

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
    spotifyPlayer
  } = useMusicContext();

  const navigate = useNavigate();
  const [localPosition, setLocalPosition] = useState(0);

  const handleRadioClick = () => {
    if (currentTrack && currentTrack.id) {
      navigate(`/radio/${currentTrack.id}`);
    }
  };

  // Update local position from Spotify player with polling
  useEffect(() => {
    if (!spotifyPlayer?.player || !isPlaying) return;

    const interval = setInterval(async () => {
      try {
        const state = await spotifyPlayer.player.getCurrentState();
        if (state) {
          setLocalPosition(state.position);
        }
      } catch (error) {
        console.error('Error getting player state:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [spotifyPlayer?.player, isPlaying]);

  const handlePlayPause = () => {
    playPauseHandler();
  };

  const handleSliderChange = (event, newValue) => {
    if (spotifyPlayer?.seek) {
      spotifyPlayer.seek(newValue);
      setLocalPosition(newValue);
    }
  };

  // Get track data with proper fallbacks
  const trackData = currentTrack ? {
    name: currentTrack.name,
    artist: currentTrack.artists?.[0]?.name || '',
    image: currentTrack.album?.images?.[0]?.url || currentTrack.album?.images?.[1]?.url || currentTrack.album?.images?.[2]?.url || '',
    duration_ms: currentTrack.duration_ms
  } : null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "88px",
        backgroundColor: "#F4F2F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        <li style={{ listStyleType: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {trackData ? (
              <>
                {/* Album Image */}
                <Box
                  sx={{
                    width: "64px",
                    height: "64px",
                    marginRight: "10px",
                    marginLeft: "10px",
                    position: "relative",
                  }}
                >
                  <img
                    src={trackData.image}
                    alt="Album"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                  />
                </Box>
                {/* Song Info */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>
                    {trackData.name}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                    {trackData.artist}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                {/* Empty state - Music Icon */}
                <Box
                  sx={{
                    width: "64px",
                    height: "64px",
                    marginRight: "10px",
                    marginLeft: "10px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#E0E0E0",
                    borderRadius: 1,
                  }}
                >
                  <GraphicEqIcon sx={{ fontSize: 32, color: "#9E9E9E" }} />
                </Box>
                {/* Empty state text */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "500", color: "#9E9E9E" }}>
                    Click a song to start playing
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </li>
      </ul>

      {/* Controls and Scrubber */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Controls */}
        <Box>
          <IconButton
            sx={{ color: "#626262", "&:hover": { color: "secondary.main" } }}
          >
            <SkipPreviousIcon sx={{ fontSize: 36 }} onClick={prevSongHandler} />
          </IconButton>
          <IconButton
            sx={{
              color: "primary.main",
              "&:hover": { color: "secondary.main" },
            }}
            onClick={handlePlayPause}
          >
            {!isPlaying ? (
              <PlayArrowIcon sx={{ fontSize: 36 }} />
            ) : (
              <PauseIcon sx={{ fontSize: 36 }} />
            )}
            {/* <img src={DBPlayArrow} alt="PlayArrow" style={{ width: 20, height: 23, objectFit: 'cover' }} /> */}
          </IconButton>
          <IconButton
            sx={{ color: "#626262", "&:hover": { color: "secondary.main" } }}
          >
            <SkipNextIcon sx={{ fontSize: 36 }} onClick={nextSongHandler} />
          </IconButton>
        </Box>

        {/* Scrubber with Timers*/}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {/* Current Time */}
          <Typography sx={{ marginRight: 1, fontSize: 12, marginBottom: 1.5 }}>
            {formatTime(localPosition)}
          </Typography>
          {/* Scrubber */}
          <Slider
            sx={{
              width: 500,
              marginTop: -1.5,
              "& .MuiSlider-thumb": {
                width: 0,
                height: 0,
              },
              "& .MuiSlider-track": {
                color: "#181C1E",
                height: 3,
              },
              "& .MuiSlider-rail": {
                color: "#626262",
                height: 4,
              },
            }}
            value={localPosition}
            min={0}
            max={spotifyPlayer?.duration || trackData?.duration_ms || 0}
            onChange={handleSliderChange}
            aria-label="Song scrubber"
            disabled={!trackData}
          />
          {/* Total Duration */}
          <Typography sx={{ marginLeft: 1, fontSize: 12, marginBottom: 1.5 }}>
            {formatTime(spotifyPlayer?.duration || trackData?.duration_ms || 0)}
          </Typography>
        </Box>
      </Box>

      {/* Additional Icons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginLeft: "20px",
          marginRight: "10px",
        }}
      >
        <IconButton
          sx={{ color: "primary.main", "&:hover": { color: "secondary.main" } }}
        >
          <MicIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <IconButton
          sx={{ color: "primary.main", "&:hover": { color: "secondary.main" } }}
        >
          <QueueMusicIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <IconButton
          sx={{ color: "primary.main", "&:hover": { color: "secondary.main" } }}
          onClick={handleRadioClick}
          disabled={!currentTrack}
        >
          <RadioIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
export default MusicPlayer;
