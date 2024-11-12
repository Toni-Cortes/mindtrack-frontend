import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="login-container">
      <img className="logo-img" src=".\src\assets\logo.svg" alt="Mindcheck Logo" />

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
          <button style={{ border: '1px dashed white', cursor:'pointer' }} type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <p className="reminder">
          Don&apos;t have an account yet? <Link to={'/signup'}>Sign</Link> up here
        </p>
      </div>
    </div>
  );
}

export default Login;
