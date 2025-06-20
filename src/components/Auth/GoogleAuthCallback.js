import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Your AuthContext
import api from '../../services/api'; // Your API service

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');

    if (success === 'true') {
      // Assuming your backend set a session cookie and now we fetch user profile
      api.get('http://localhost:7000/api/users/google') // Endpoint to get logged-in user
        .then(response => {
          const { user, token } = response.data; // Adjust based on your backend response
          if (user && token) {
            setUser(user);
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('orgId', user.orgId); // Or however you store orgId
            navigate('/projects'); // Or your desired redirect path
          } else {
            throw new Error('User data or token not found in response.');
          }
        })
        .catch(err => {
          console.error('Auth Callback Profile Fetch Error:', err);
          setError('Failed to fetch user profile. Please try logging in again.');
          setLoading(false);
          // navigate('/login'); // Optionally redirect to login on error
        });
    } else {
      const authError = params.get('error');
      console.error('Google Auth Error (from backend redirect):', authError);
      setError(authError || 'Google authentication failed. Please try again.');
      setLoading(false);
      // navigate('/login');
    }
  }, [navigate, location, setUser, setToken]);

  if (loading && !error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Completing sign-in...</p> {/* Add a spinner or better loading UI */}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{color: 'red'}}>Error: {error}</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return null; // Or a redirect, or success message before navigating
};

export default GoogleAuthCallback;