import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(credentials.email, credentials.password);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <Input
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <div className="flex justify-end mb-4 -mt-2">
        <button type="button" className="text-sm text-black hover:underline" onClick={() => navigate('/forgot-password')}>
          Forgot Password
        </button>
      </div>
      {error && <div className="text-center text-red-500 text-sm mb-4">{error}</div>}
      <Button type="submit" variant="accent" disabled={loading} className="w-full text-lg py-3 mb-4">
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      {/* Separator */}
      <div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
        <p className="text-center font-semibold mx-4 mb-0 text-gray-500 text-sm">OR</p>
      </div>

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.373-11.127-7.962l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.591,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
        Continue with Google
      </button>

      <div className="text-center mt-6 text-black">
        First Time? <button type="button" className="underline ml-1" onClick={() => navigate('/signup')}>Register</button>
      </div>
    </form>
  );
};

export default LoginForm;
