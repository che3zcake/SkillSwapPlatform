import {Link, useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";

export default function NavBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();

    const isNotHome = location.pathname !== '/';
    const isLoggedIn = !!localStorage.getItem('authorization');
    // const isLoggedIn = true;
    const handleLogout = () => {
        localStorage.removeItem("authorization");
        navigate("/login");
    };


    return  <div className="container">
        <header>
            <nav>
                <ul className="nav-list">
                    <li className="logo">
                        <div><span className="highlight">Skill</span>Swap<span className="platform">Platform</span></div>
                    </li>

                    {isLoggedIn && (
                        <Link to="/swap" style={{
                            textDecoration: 'none',
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            cursor: "pointer"
                        }}>
                            Swap
                        </Link>
                    )}

                    {isNotHome && (
                        <Link to="/" style={{
                            textDecoration: 'none',
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            marginLeft: "3rem",
                            cursor: "pointer"
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="26px" fill="black"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
                        </Link>
                    )}

                    {isLoggedIn && (
                        <div style={{
                            textDecoration: 'none',
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            marginLeft: "3rem",
                            cursor: "pointer"
                        }} className="dropdown-container">
                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="26px"
                                 fill="black" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <path
                                    d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
                            </svg>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">Profile</Link>
                                    <button onClick={handleLogout} className="dropdown-item">Logout</button>
                                </div>
                            )}
                        </div>
                    )}

                    {!isLoggedIn && (
                        <li>
                            <button className="button-secondary" onClick={() => {
                                navigate('/login')
                            }}>Login
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    </div>
}