import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./NavBar.css"
import MusicPlayer from "./MusicPlayer";
import SearchBar from "./SearchBar";

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
                <MusicPlayer />
            </footer>
        </>
    )
}
export default Home;