
// import MusicPlayer from "./MusicPlayer";
import NavBar from "./NavBar";
import { useMusicContext } from "./MusicContext";

function Explore() {
  const {
    currentSongIndex,
    isPlaying,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
  } = useMusicContext();

  return (
    <>
      <header className="navbar">
        {/* <NavBar /> */}
      </header>
      <footer>
        {/* <MusicPlayer /> */}
      </footer>
    </>
  );
}
export default Explore;

