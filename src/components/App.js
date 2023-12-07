import * as React from 'react';
import NavigationBar from './NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MusicPlayer from './MusicPlayer';
import Home from './Home';
import YourLibrary from './YourLibrary';
import Explore from './Explore';



const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: "'Prompt', sans-serif",
            color: '#181C1E',
        },
        h6: {
            fontSize: '1.1rem',
            fontWeight: '500',
        },
    },
    palette: {
        primary: {
            main: '#181C1E',
        },
        secondary: {
            main: '#FF6E1D',
        },
    },
    // Include any other theme customizations here
});

function App() {
    return (
        <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<YourLibrary />} />
            <Route path="/explore" element={<Explore />} />
          </Routes>
          <MusicPlayer />
        </div>
      </Router>
    </ThemeProvider>
    );
}

export default App;
