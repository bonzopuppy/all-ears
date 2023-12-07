import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./components/App";
import { MusicProvider } from "./components/MusicContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MusicProvider>
    <App />
  </MusicProvider>
);


