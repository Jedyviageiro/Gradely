import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSuccess('A 6-digit PIN has been sent to your email.');
      setTimeout(() => navigate('/reset-password'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <Input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      {error && <div className="text-center text-red-500 text-sm mb-4">{error}</div>}
      {success && <div className="text-center text-green-600 text-sm mb-4">{success}</div>}
      <Button type="submit" variant="accent" disabled={loading} className="w-full text-lg py-3 mb-4">
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <div className="text-center mt-2 text-black">
        Remembered your password?{' '}
        <button type="button" className="underline ml-1" onClick={() => navigate('/login')}>Login</button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
