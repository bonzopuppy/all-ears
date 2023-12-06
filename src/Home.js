import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./NavBar.css"
import MusicPlayer from "./MusicPlayer";
import Search from "./Search";

function Home() {
    return (
        <>
            <header className="navbar">
                <NavBar />
            </header>
            <main>
                <div>
                    <Search />
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