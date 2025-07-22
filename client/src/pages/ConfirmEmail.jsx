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

  const isSuccess = status.includes('successfully');
  const isError = status === 'Verification Failed' || status === 'Invalid confirmation link.';
  const isLoading = status === 'Verifying...';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/30 rounded-full blur-lg"></div>
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-indigo-200/25 rounded-full blur-md"></div>
      <div className="absolute bottom-20 right-10 w-28 h-28 bg-slate-200/20 rounded-full blur-lg"></div>

      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 flex flex-col items-center px-8 py-12 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-transparent opacity-80 rounded-3xl" />
        
        {/* Dynamic decorative elements based on status */}
        {isSuccess && (
          <>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-200/40 to-green-300/40 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-3xl" />
          </>
        )}
        {isError && (
          <>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-red-200/40 to-rose-300/40 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-red-300/30 rounded-full blur-3xl" />
          </>
        )}
        {isLoading && (
          <>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-200/40 to-indigo-300/40 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse" />
          </>
        )}
        
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Logo with Gradely text - CENTERED and SMALLER */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src={gradelyLogo} alt="Gradely Logo" className="w-7 h-7 object-contain" />
            <span className={`text-lg font-bold bg-clip-text text-transparent ${
              isSuccess ? 'bg-gradient-to-r from-emerald-700 to-green-600' :
              isError ? 'bg-gradient-to-r from-red-700 to-rose-600' :
              'bg-gradient-to-r from-blue-700 to-indigo-600'
            }`}>
              Gradely
            </span>
          </div>
          
          {/* Status icon */}
          <div className="mb-6">
            {isLoading && (
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            )}
            {isSuccess && (
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {isError && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Status message - CENTERED */}
          <div className="text-center mb-6">
            <h1 className={`text-2xl font-bold mb-3 ${
              isSuccess ? 'bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent' :
              isError ? 'bg-gradient-to-r from-red-700 to-rose-600 bg-clip-text text-transparent' :
              'bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent'
            }`}>
              {status}
            </h1>
            
            {error && (
              <div className="bg-red-50/80 border border-red-200/50 rounded-xl p-4 mb-4">
                <p className="text-red-600 text-sm leading-relaxed">{error}</p>
              </div>
            )}
            
            {isLoading && (
              <p className="text-gray-600 text-sm">
                Please wait while we verify your email address...
              </p>
            )}
          </div>
          
          {/* Success actions */}
          {isSuccess && (
            <div className="w-full text-center space-y-4">
              <div className="bg-emerald-50/80 border border-emerald-200/50 rounded-xl p-4 mb-6">
                <p className="text-emerald-700 text-sm font-medium mb-1">Welcome to Gradely!</p>
                <p className="text-emerald-600 text-sm">
                  Your email has been verified. You can now access all features of your account.
                </p>
              </div>
              
              <Button 
                variant="accent" 
                onClick={() => navigate('/login')} 
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue to Login
              </Button>
            </div>
          )}
          
          {/* Error actions */}
          {isError && (
            <div className="w-full text-center">
              <p className="text-xs text-gray-500 mb-4">
                Need help?{' '}
                <a href="/contact" className="text-red-600 hover:text-red-700 font-medium transition-colors">
                  Contact support
                </a>
              </p>
            </div>
          )}
        </div>
        
        {/* Dynamic bottom accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-60 ${
          isSuccess ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500' :
          isError ? 'bg-gradient-to-r from-red-500 via-rose-500 to-red-500' :
          'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500'
        }`} />
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ConfirmEmail;