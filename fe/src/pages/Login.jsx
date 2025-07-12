import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // prevent form reload

        try {
            const response = await axios.post(`http://localhost:3000/api/v1/user/login`, {
                email,
                password,
            });

            localStorage.setItem("authorization", `Bearer ${response.data.token}`);
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed. Please check your credentials.");
        }
    }


    return <div className="sign">
        <div className="auth-container">
            <h2>Login</h2>

            <form className="auth-form" onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>

            <div style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem'}}>
                Don't have an account?{' '}
                <Link to="/signup" style={{color: '#4a43eb', fontWeight: 'bold', textDecoration: 'none'}}>
                    Sign Up
                </Link>
            </div>
        </div>
    </div>
}