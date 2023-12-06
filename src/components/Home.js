import React from "react";
import NavBar from "./NavBar";
import "/Users/annehastings/Development/Code/phase-2/GP-AllEars/all-ears/src/styles/NavBar.css";
import MusicPlayer from "./MusicPlayer";
import harlots from "../music/Harlots-Gardens.mp3";
import phil from "../music/In-the-Air-Tonight.mp3";
import untold from "../music/Untold-Stories.mp3"

function Home() {
  // const [songs, setSongs] = useState([harlots, phil, untold]);
  const songs = [harlots, phil, untold]

  // useEffect(() => {
  //   fetch(music)
  //   .then(r=>r.json())
  //   .then(setSongs)
  // }, [])
  

  return (
    <>
      <header className="navbar">
        <NavBar />
      </header>
      <main>
        <div></div>
      </main>
      <footer>
        <MusicPlayer songs={songs} />
      </footer>
    </>
  );
}
export default Home;
