import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const authError = searchParams.get('error');

    if (authError) {
      setError('Google authentication failed. Please try again.');
      // Redirect back to login after a delay
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } else if (token) {
      // The login function from AuthContext handles storing the token
      // and updating the user state.
      login(token);
      // Use window.location.replace for a full page reload.
      // This ensures App.jsx remounts and fetches user-specific data,
      // fixing the infinite loop and ensuring data is fresh after login.
      window.location.replace('/dashboard');
    } else {
      setError('Invalid authentication callback. No token provided.');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The key fix: An empty dependency array ensures this runs only ONCE.

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md w-full">
        {error ? (
          <h1 className="text-xl font-bold text-red-600">{error}</h1>
        ) : (
          <h1 className="text-xl font-bold text-gray-800">Authenticating, please wait...</h1>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;