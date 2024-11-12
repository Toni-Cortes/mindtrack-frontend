import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import './styles/Navigation.css';

function NavBar() {
    const { logout } = useContext(AuthContext);

    const handleLogout = (event) => {
        event.preventDefault(); 
        logout(); 
    };

    return (
        <div className="Navbar">
            <div className="navbar-img">
                <img src="../src/assets/logo.svg" alt="Logo" />
            </div>
            <div className="navbar-buttons">
                <Link to="/" onClick={handleLogout}>Log out</Link>
            </div>
        </div>
    );
}

export default NavBar;
