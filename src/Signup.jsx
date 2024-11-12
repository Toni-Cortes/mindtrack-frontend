import { useContext, useState } from "react";

import './styles/Signup.css';
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";


function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [code, setCode] = useState("");
    const [signupError, setSignupError] = useState('');

    const { signup } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();
        if (password === passwordRepeat) {
            signup(username, password, code).catch((error) => {
                setSignupError(error.response?.data?.message || "Signup failed");
            });
        } else {
            setSignupError('Passwords do not match');
        }
    }
    



    return (
        <div className={'login-container'}>

            <img className="logo-img" src=".\src\assets\logo.svg" alt="Mindcheck Logo" />

            <div className="login-wrapper">

                <h1 className="login-title">Sign up</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Name</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordRepeat">Repeat password</label>
                        <input
                            type="password"
                            id="passwordRepeat"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="code" style={{ color: 'rgb(106, 174, 214)', fontWeight: '600', marginBottom: '2px' }}>Code</label>
                        <p style={{ color: 'rgb(106, 174, 214)', fontWeight: '300', marginTop: '2px', fontSize: '12px' }}>Provided by your Therapist</p>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            placeholder="Ex: C3P0"
                        />
                    </div>
                    {signupError !== '' && (
                        <p className="signupError">{signupError}</p>
                    )}
                    <button style={{
                        border: '1px dashed white',
                        cursor: 'pointer'
                    }}
                        type="submit"
                        className="login-btn">
                        Sign Up
                    </button>
                </form>

                <p className="reminder">
                    Already signed up? Log in <Link to={'/login'}>here</Link>
                </p>

            </div>

        </div>
    );
}

export default Signup;