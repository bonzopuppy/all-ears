import { NavLink } from "react-router-dom";
import "/Users/annehastings/Development/Code/phase-2/GP-AllEars/all-ears/src/styles/NavBar.css"


function NavBar() {
    return (
        <nav className="navbar">
            <NavLink to="/">
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