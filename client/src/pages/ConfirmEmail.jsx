import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';
import Button from '../components/ui/Button';

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState('');

  useEffect(() => {
    const confirm = async () => {
      if (!token) {
        setStatus('Invalid confirmation link.');
        return;
      }
      try {
        await api.confirmEmail(token);
        setStatus('Email confirmed successfully!');
      } catch (err) {
        setStatus('Verification Failed');
        setError(err.message || 'The confirmation link may be invalid or expired.');
      }
    };
    confirm();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9e9f3]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col items-center px-8 py-10">
        <img src={gradelyLogo} alt="Gradely Logo" className="w-14 mb-6" />
        <h1 className="text-2xl font-semibold mb-4 text-center">{status}</h1>
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}
        {status.includes('successfully') && (
          <>
            <p className="text-gray-600 text-center mb-6">You can now log in to your account.</p>
            <Button variant="accent" onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
