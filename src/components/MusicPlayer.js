import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import MicIcon from '@mui/icons-material/Mic';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SongSmallNoHover from './SongSmallNoHover';
// import { useMusicContext } from './MusicContext';
import frozen from "../music/LetItGo.mp3"
import phil from "../music/In-the-Air-Tonight.mp3";
import untold from "../music/Untold-Stories.mp3";
import james from "../music/GetUpOffaThatThing.mp3"


function MusicPlayer() {

  const songs = [james, frozen, phil, untold]


  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const song = songs[currentSongIndex]
  const audioRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    audioRef.current.src = songs[currentSongIndex];
    if (isPlaying) {
        audioRef.current.play();
    }
  }, [currentSongIndex, isPlaying, songs]);

  const playPauseHandler = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true)
    } else {
      audioRef.current.pause();
      setIsPlaying(false)
    }
  };


  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  return (
      <Box sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          height: '88px',
          backgroundColor: '#F4F2F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
      }}>
           {/* Audio Element */}
           <audio id="audio-element" ref={audioRef}  src={song} preload="auto"></audio>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <SongSmallNoHover />
          </ul>

          {/* Controls and Scrubber */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Controls */}
              <Box>
                  <IconButton sx={{ color: '#626262', '&:hover': { color: 'secondary.main' } }}>
                      <SkipPreviousIcon sx={{ fontSize: 36 }} onClick={prevSongHandler} />
                  </IconButton>
                  <IconButton sx={{ color: 'primary.main', '&:hover': { color: 'secondary.main' } }} onClick={playPauseHandler}>
                      {!isPlaying ? <PlayArrowIcon sx={{ fontSize: 36 }} />
                      : <PauseIcon sx={{ fontSize: 36 }} />}
                      {/* <img src={DBPlayArrow} alt="PlayArrow" style={{ width: 20, height: 23, objectFit: 'cover' }} /> */}
                  </IconButton>
                  <IconButton sx={{ color: '#626262', '&:hover': { color: 'secondary.main' } }}>
                      <SkipNextIcon sx={{ fontSize: 36 }} onClick={nextSongHandler} />
                  </IconButton>

              </Box>

              {/* Scrubber with Timers*/}
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  {/* Current Time */}
                  <Typography sx={{ marginRight: 1, fontSize: 12, marginBottom: 1.5}}>0:00</Typography>
                  {/* Scrubber */}    
                  <Slider
                      sx={{
                          width: 500,
                          marginTop: -1.5, // Adjust as needed
                          '& .MuiSlider-thumb': {
                              width: 0,
                              height: 0,
                          },
                          '& .MuiSlider-track': {
                              color: '#181C1E',
                              height: 3,
                          },
                          '& .MuiSlider-rail': {
                              color: '#626262',
                              height: 4,
                          },
                      }}
                      defaultValue={30}
                      aria-label="Song scrubber"
                  />
                  {/* Total Duration */}
                  <Typography sx={{ marginLeft: 1, fontSize: 12, marginBottom: 1.5 }}>3:30</Typography>
              </Box>
          </Box>

          {/* Additional Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginLeft: '20px', marginRight: '10px' }}>
              <IconButton sx={{  color: 'primary.main', '&:hover': { color: 'secondary.main'} }}>
                  <MicIcon sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton sx={{  color: 'primary.main', '&:hover': { color: 'secondary.main'} }}>
                  <QueueMusicIcon sx={{ fontSize: 32 }} />
              </IconButton>
              <IconButton sx={{  color: 'primary.main', '&:hover': { color: 'secondary.main' } }}>
                  <GraphicEqIcon sx={{ fontSize: 28 }} />
              </IconButton>
          </Box>
      </Box>
  );
    // <div>
    //     <footer>
    //     <audio ref={audioRef} controls  />
    //     <div>
    //         <p>Now Playing: {songs[currentSongIndex]}</p>
    //       <button onClick={prevSongHandler}>Previous</button>
    //       <button onClick={playPauseHandler}>
    //         {isPlaying ? "Pause" : "Play"}
    //       </button>
    //       <button onClick={nextSongHandler}>Next</button>
    //     </div>
    
    //     </footer>
    // </div>
}
export default MusicPlayer;