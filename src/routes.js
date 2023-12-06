import Home from "./components/Home";
import YourLibrary from "./components/YourLibrary";
import Explore from "./components/Explore";

const routes = [
  {
    path: "/",
    element: <Home />,
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

export default routes;
