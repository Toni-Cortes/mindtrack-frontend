import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../src/assets/logo.svg'

function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error state to display login errors
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); // Clear previous error

    try {
      await login(username, password);
      navigate('/home'); // Redirect only if login succeeds
    } catch (error) {
      setError(error.message); // Set error message if login fails
    }
  }

  return (
    <div>

      <div className="Navbar">
        <div className="navbar-img">
          <Link to='/'>
          <img src={logo} alt="Mindcheck Logo" />
          </Link>
        </div>
        <div className="navbar-buttons">
          <Link to={'/signup'}>Signup</Link>
        </div>
      </div>

      <br /><br /><br /><br />

      <div className="login-container">


        <div className="login-wrapper">
          <h1 className="login-title">Login</h1>



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
            {error && <p className="signupError">{error}</p>} {/* Display error message */}
            <button style={{ border: '1px dashed white', cursor: 'pointer' }} type="submit" className="login-btn">
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

export default Login;
