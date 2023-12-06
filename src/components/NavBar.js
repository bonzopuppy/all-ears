import { NavLink } from "react-router-dom";
import "./NavBar.css"


function NavBar() {
    return (
        <nav className="navbar">
            <NavLink to="/all-ears">
                Home
            </NavLink>
            <NavLink to="/library">
                Your Library
            </NavLink>
            <NavLink to="/explore">
                Explore
            </NavLink>
        </nav>
    )
}
export default NavBar;