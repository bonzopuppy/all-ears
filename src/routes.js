import Home from './Home';
import YourLibrary from './YourLibrary';
import Explore from './Explore';

const routes = [
  {
    path: "/all-ears",
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
