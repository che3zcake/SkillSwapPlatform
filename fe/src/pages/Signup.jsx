import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";

export default function Signup(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault(); // prevent form reload

        try {
            const response = await axios.post(`http://localhost:3000/api/v1/user/signup`, {
                email,
                password,
            });

            localStorage.setItem("authorization", `Bearer ${response.data.token}`);
            navigate("/create-profile");
        } catch (err) {
            console.error("Signup error:", err);
            alert("Signup failed. Check credentials or try again.");
        }
    };

    return <div className="sign">
        <div className="auth-container">
            <h2>Sign Up</h2>

            <form className="auth-form" onSubmit={handleSignup}>
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

                <button type="submit">Sign Up</button>
            </form>

            <div style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem'}}>
                Already have an account?{' '}
                <Link to="/login" style={{color: '#4a43eb', fontWeight: 'bold', textDecoration: 'none'}}>
                    Login
                </Link>
            </div>
        </div>
    </div>
}