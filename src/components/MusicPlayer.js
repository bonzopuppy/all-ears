import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import MicIcon from "@mui/icons-material/Mic";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useMusicContext } from './MusicContext';

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function MusicPlayer() {
  const { playlist, currentSongIndex, isPlaying, nextSongHandler, prevSongHandler, setIsPlaying } = useMusicContext();

  const song = playlist[currentSongIndex];
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(null);

  // Initialize audio ref on first render
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };

    if (audio) {
      audio.addEventListener("timeupdate", updateTime);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateTime);
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && song.song) {
      // Only update src if it's different from current
      if (audio.src !== song.song) {
        audio.src = song.song;
        audio.load(); // Explicitly load the new source
        setCurrentTime(0);
        setPausedTime(0);
      }

      if (isPlaying) {
        audio.play().catch(err => console.error('Error playing audio:', err));
      } else {
        audio.pause();
      }
    }
  }, [currentSongIndex, isPlaying, song.song]);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
      if (pausedTime > 0) {
        audioRef.current.currentTime = pausedTime;
        setPausedTime(0)
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setPausedTime(audioRef.current.currentTime)
    }
  };

  
  const totalDurationSeconds = (song.minutes * 60) + song.seconds;
  const handleSliderChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

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
      {/* Audio Element */}
      <audio
        id="audio-element"
        ref={audioRef}
        src={song.song}
        preload="auto"
      ></audio>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        <li style={{ listStyleType: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
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
                src={song.image}
                alt="Album"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
              />
            </Box>
            {/* Song Info */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>
                {song.title}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                {song.artist}
              </Typography>
            </Box>
          </Box>
        </li>
        {/* <SongSmallNoHover song={song[currentSongIndex]} isPlaying={isPlaying} /> */}
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
            {formatTime(currentTime)}
          </Typography>
          {/* Scrubber */}
          <Slider
            sx={{
              width: 500,
              marginTop: -1.5, // Adjust as needed
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
            //   defaultValue={30}
            value={currentTime}
            min={0}
            max={totalDurationSeconds}
            onChange={handleSliderChange}
            aria-label="Song scrubber"
          />
          {/* Total Duration */}
          <Typography sx={{ marginLeft: 1, fontSize: 12, marginBottom: 1.5 }}>
            {formatTime(totalDurationSeconds)}
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
        >
          <GraphicEqIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
export default MusicPlayer;
