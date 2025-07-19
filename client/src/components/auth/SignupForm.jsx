import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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
      await api.signup(formData.email, formData.password, formData.firstName, formData.lastName);
      setSuccess('Signup successful! Please log in.');
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
      <Input name="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
      <Input name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
      <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
      {error && <div className="text-center text-red-500 text-sm mb-4">{error}</div>}
      {success && <div className="text-center text-green-600 text-sm mb-4">{success}</div>}
      <Button type="submit" variant="accent" disabled={loading} className="w-full text-lg py-3 mb-4">
        {loading ? 'Signing up...' : 'Sign Up'}
      </Button>
      <div className="text-center mt-2 text-black">
        Already have an account?{' '}
        <button type="button" className="underline ml-1" onClick={() => navigate('/login')}>Login</button>
      </div>
    </form>
  );
};

export default SignupForm;
