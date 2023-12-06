
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./NavBar.css"
import MusicPlayer from "./MusicPlayer";
import SearchBar from "./SearchBar";
import harlots from "../music/Harlots-Gardens.mp3";
import phil from "../music/In-the-Air-Tonight.mp3";
import untold from "../music/Untold-Stories.mp3"

// Home (App)
// |- NavBar
//    |- Home (Return)
//    |- Your Library
//       |- Summary Bar
//       |- Library Card
//    |- Explore
// |- Search Bar
// |- Search Results
//    |- Results Card
// |- New Releases
// |- What's Hot
// |- Genre Carousel
//    |- Genre Card
// |- Music Player


function Home() {
  const songs = [harlots, phil, untold]
    return (
        <>
            <header className="navbar">
                <NavBar />
            </header>
            <main>
                <div>
                    <SearchBar />
                </div>
                <div>
                    <h1>New Releases:</h1>

                </div>
            </main>
            <footer>
                <MusicPlayer songs={songs} />
            </footer>
        </>
    )
}
export default Home;

