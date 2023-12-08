
import React from "react";
// import MusicPlayer from "./MusicPlayer";
// import NavBar from "./NavBar";
import { useMusicContext } from "./MusicContext";
import ExplorationBar from "./ExplorationBar";
import Box from "@mui/material/Box";
import starryNote from "../images/starryNote.svg";
import question from "../images/question.svg";
import PromptExample from "./PromptExample";
import Typography from "@mui/material/Typography";

function Explore({getAccessToken, spotifyAPI}) {
  const {
    currentSongIndex,
    isPlaying,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
  } = useMusicContext();

  return (
    <div style={{ position: 'relative', height: '100vh'}}>
      <Box sx={{
        textAlign: 'center',     // Center text horizontally
        position: 'absolute',
        top: '25%',              // Adjust this value as needed
        left: 0,
        right: 0
      }}>
        <Typography variant="h5">Examples:</Typography>
      </Box>
      <Box 
      Box sx={{
        display: 'flex',           // Flexbox layout
        justifyContent: 'center',  // Center content horizontally
        alignItems: 'center',      // Center content vertically
        gap: '20px',               // Add some spacing between the elements
        position: 'absolute',
        top: 0,                
        bottom: 180,                 // Stretch from top to bottom
        left: 0,
        right: 0
      }}
      >
        <PromptExample color='#C19FF4' icon={starryNote} copy='🌈 Set the tone: Describe a place, a story, or a fantasy of yours, and get a song that brings it to life! 🎼' />
        <PromptExample color='#FFD79A' icon={question} copy='“What were some popular cabaret songs in the 1920’s?”' />
        <PromptExample color='#C19FF4' icon={starryNote} copy='🎶 Spark a musical journey! Ask for a recommendation based on a mood, a memory, or even a color that inspires you. 🌟' />
        <PromptExample color='#FFD79A' icon={question} copy='“Recommend bands like The Violent Femmes"' />
      </Box>
      <Box sx={{position: 'absolute', bottom: 180, left: 0, right: 0}}>
       <ExplorationBar />
      </Box>
    </div>
  );
}
export default Explore;

