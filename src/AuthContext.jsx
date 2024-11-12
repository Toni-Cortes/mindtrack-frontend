import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// Create the authentication context
export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {

    //saving user data
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const navigate = useNavigate();

    // Function to log in a user by making a POST request to the backend
    async function login(username, password) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/login`, { username, password });
            const { token } = response.data;
    
            setToken(token);
            localStorage.setItem('token', token);
    
            const userPayload = await verifyToken(token);
            setUser(userPayload);
    
            return true; // Indicate login success
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            throw new Error(errorMessage); // Throw an error with a message
        }
    }
    

 
    async function therapistLogin(username, password) {
        try {
            // Send email and password to the backend to log in
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/therapist/login`, { username, password });
            const { token } = response.data;
    
            // Store token in state and local storage
            setToken(token);
            localStorage.setItem('token', token);
    
            // Verify token and set user data in state
            const userPayload = await verifyToken(token);
            setUser(userPayload);
    
            console.log('loggin ok');
    
            // Return the full response object for further handling
            return response;
    
        } catch (error) {
            console.log ('loggin not ok');
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error; // Re-throw the error for the calling function to handle
        }
    }
    

    // Function to verify JWT token and get user info
    async function verifyToken(token) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data.user;

        } catch (error) {
            console.error("Token verification failed:", error);
            logout(); // Log out if token verification fails
            return null;
        }
    }

    // Function to log out by clearing token and user data
    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
    }

    // New function to handle signup with automatic login
    async function signup(username, password, loginCode) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/patients/signup`, { username, password, loginCode });
    
            const { token } = response.data;
    
            setToken(token);
            localStorage.setItem('token', token);
    
            const userPayload = await verifyToken(token);
            setUser(userPayload);
    
            navigate('/home');
            
        } catch (error) {
            console.error("Signup failed:", error.response?.data?.message || error.message);
            throw error; // Re-throw the error for the calling function to handle
        }
    }
    


    // safe user if token exists
    useEffect(() => {
        if (token) {
            verifyToken(token).then((verifiedUser) => {
                if (verifiedUser) {
                    setUser(verifiedUser); // Set user only if token verification succeeds
                } else {
                    logout(); // Clear token if verification fails
                }
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);



    return (
        // Provide the user, login, and logout functions to child components
        <AuthContext.Provider value={{ user, login, logout, token, signup, therapistLogin }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider }