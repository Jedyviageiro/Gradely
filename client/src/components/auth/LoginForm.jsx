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
      <div className="text-center mt-2 text-black">
        First Time? <button type="button" className="underline ml-1" onClick={() => navigate('/signup')}>Register</button>
      </div>
    </form>
  );
};

export default LoginForm;
