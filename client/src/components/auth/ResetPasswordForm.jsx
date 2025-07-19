import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    pin: '',
    newPassword: '',
  });
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
      await api.resetPassword(formData.pin, formData.newPassword);
      setSuccess('Password reset successful! Please log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <Input name="pin" type="text" value={formData.pin} onChange={handleChange} placeholder="6-digit PIN" />
      <Input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="New Password" />
      {error && <div className="text-center text-red-500 text-sm mb-4">{error}</div>}
      {success && <div className="text-center text-green-600 text-sm mb-4">{success}</div>}
      <Button type="submit" variant="accent" disabled={loading} className="w-full text-lg py-3 mb-4">
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
      <div className="text-center mt-2 text-black">
        Back to{' '}
        <button type="button" className="underline ml-1" onClick={() => navigate('/login')}>Login</button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
