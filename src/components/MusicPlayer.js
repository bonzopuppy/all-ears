import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import MicIcon from "@mui/icons-material/Mic";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import SongSmallNoHover from "./SongSmallNoHover";
// import { useMusicContext } from './MusicContext';
import taylor from "../music/YoureLosingMe.mp3";
import tyla from "../music/Water.mp3";
import bey from "../music/MyHouse.mp3";
import republic from "../music/CountingStars.mp3"

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function MusicPlayer() {
  const songs = [
    {
      song: tyla,
      title: "Water",
      artist: "Tyla",
      minutes: 3,
      seconds: 21,
      image: "https://upload.wikimedia.org/wikipedia/en/1/1e/Tyla_album.jpg",
    },
    {
      song: bey,
      title: "My House",
      artist: "Beyoncé",
      minutes: 4,
      seconds: 23,
      image:
        "https://media.pitchfork.com/photos/6569e8059df35b9503950ce8/1:1/w_320,c_limit/Beyonce-My-House.jpg",
    },
    {
      song: taylor,
      title: "You're Losing Me",
      artist: "Taylor Swift",
      minutes: 4,
      seconds: 38,
      image:
        "https://upload.wikimedia.org/wikipedia/en/9/9b/Taylor_Swift_-_You%27re_Losing_Me.png",
    },
    {
        song: republic,
        title: "Counting Stars",
        artist: "One Republic",
        minutes: 4,
        seconds: 17,
        image: "https://upload.wikimedia.org/wikipedia/en/9/96/OneRepublic_-_Native.png",
      },
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const song = songs[currentSongIndex];
  const audioRef = useRef(new Audio(song.song));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(null);

  useEffect(() => {
    const updateTime = () => setCurrentTime(audioRef.current.currentTime);
    audioRef.current.addEventListener("timeupdate", updateTime);
    return () => {
        audioRef.current.removeEventListener("timeupdate", updateTime)
    }
  }, [])

  useEffect(() => {
    audioRef.current.src = song.song;
    if (isPlaying) {
      audioRef.current.play();
      if (pausedTime > 0) {
        audioRef.current.currentTime = pausedTime;
        setPausedTime(0);
      }
    }
  }, [currentSongIndex, isPlaying, song.song]);

  

  useEffect(() => {
    const updateTime = () => setCurrentTime(audioRef.current.currentTime);
    audioRef.current.addEventListener("timeupdate", updateTime);
    return () => {
      // Clean up the event listener
      audioRef.current.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  const playPauseHandler = () => {
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

  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const prevSongHandler = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
    );
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
            onClick={playPauseHandler}
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
