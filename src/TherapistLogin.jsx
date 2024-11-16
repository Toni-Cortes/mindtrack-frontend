// src/Login.jsx
import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import logo from '../src/assets/logo.svg'

function TherapistLogin() {
 
  const { therapistLogin } = useContext(AuthContext);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
        const response = await therapistLogin(username, password);
        console.log(response);

        if (response.status === 200){
        navigate('/patients');
        setLoginError('');
        }else{
          setLoginError(response.data.message)
        }

    } catch (error) {
        console.error("Login failed:", error);
        setLoginError(error.response?.data?.message || "Login failed: " + error.message);
    }
}


 

  return (
    <div>
      <NavBar/>
    <div className={'login-container'}>

    <img className="logo-img" src={logo} alt="Mindcheck Logo" />

      <div className="login-wrapper">

        <h1 className="login-title">Therapist Login</h1>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">User</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your user name"
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
          {loginError !== '' && (
                        <p className="signupError">{loginError}</p>
                    )}
          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <p className="reminder">
            Don&apos;t have an account yet? <Link to={'/signup'}>Sign</Link> up here
        </p>

      </div>

    </div>
    </div>
  );
}

export default TherapistLogin;
