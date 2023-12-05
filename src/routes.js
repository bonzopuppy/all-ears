import Home from './Home';
import YourLibrary from './YourLibrary';
import Explore from './Explore';

const routes = [
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/library",
    element: <YourLibrary />,
  },
  {
    path: "/explore",
    element: <Explore/>,
  }
]

export default routes;
