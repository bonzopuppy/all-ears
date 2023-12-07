
import Home from './components/Home';
import YourLibrary from './components/YourLibrary';
import Explore from './components/Explore';
import App from './components/App';

const routes = [
  {
    path: "/",
    // element: <Home />,
    element: <App />,
  },
  {
    path: "/library",
    element: <YourLibrary />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
];
//
// export default routes;
