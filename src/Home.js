import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./NavBar.css"
import MusicPlayer from "./MusicPlayer";

function Home() {
    return (
        <>
            <header className="navbar">
                <NavBar />
            </header>
            <main>
                <div></div>
            </main>
            <footer>
                <MusicPlayer />
            </footer>
        </>
    )
}
export default Home;