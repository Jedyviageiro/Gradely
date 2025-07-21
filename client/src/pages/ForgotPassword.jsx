import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center px-8 py-12 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-60" />
        
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-violet-300/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-300/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Logo with modern styling */}
          <div className="mb-8">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
              <img src={gradelyLogo} alt="Gradely Logo" className="w-10 h-10 brightness-0 invert" />
            </div>
          </div>
          
          {/* Header section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Forgot password?
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              No worries! Enter your email and we'll send you a reset link
            </p>
          </div>
          
          {/* Form container with enhanced styling */}
          <div className="w-full space-y-6">
            <ForgotPasswordForm />
          </div>
          
          {/* Additional help text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Remember your password?{' '}
              <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                Back to login
              </a>
            </p>
          </div>
        </div>
        
        {/* Subtle bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500 opacity-60" />
      </div>
    </div>
  );
};

export default ForgotPassword;