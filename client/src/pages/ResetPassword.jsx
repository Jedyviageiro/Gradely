import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center px-8 py-12 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-60" />
        
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-amber-200/40 to-orange-300/40 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-orange-200/30 to-amber-300/30 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Logo with modern styling */}
          <div className="mb-8">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <img src={gradelyLogo} alt="Gradely Logo" className="w-10 h-10 brightness-0 invert" />
            </div>
          </div>
          
          {/* Header section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Reset password
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Choose a strong new password to secure your account
            </p>
          </div>
          
          {/* Form container with enhanced styling */}
          <div className="w-full space-y-6">
            <ResetPasswordForm />
          </div>
          
          {/* Security note */}
          <div className="mt-8 text-center">
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-700 flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Use at least 8 characters with mixed case, numbers & symbols
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Remember your password?{' '}
              <a href="/login" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
                Back to login
              </a>
            </p>
          </div>
        </div>
        
        {/* Subtle bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 opacity-60" />
      </div>
    </div>
  );
};

export default ResetPassword;