
import { useState, useRef, useEffect } from "react";

function MusicPlayer({songs}) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
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
    <div>
        <footer>
        <audio ref={audioRef} controls  />
        <div>
            <p>Now Playing: {songs[currentSongIndex]}</p>
          <button onClick={prevSongHandler}>Previous</button>
          <button onClick={playPauseHandler}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={nextSongHandler}>Next</button>
        </div>
    
        </footer>
    </div>
  )
}
export default MusicPlayer;