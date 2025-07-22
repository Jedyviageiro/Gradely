import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';

const ForgotPassword = () => {
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
        
        {/* Decorative elements with blue theme */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-blue-300/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Logo with Gradely text - CENTERED and SMALLER */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src={gradelyLogo} alt="Gradely Logo" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Gradely
            </span>
          </div>
          
          {/* Header section - CENTERED */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent mb-3">
              Forgot Password?
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              No worries! Enter your email and we'll send you a reset link
            </p>
          </div>
          
          {/* Form container with enhanced styling */}
          <div className="w-full space-y-6">
            <ForgotPasswordForm />
          </div>
          
          {/* Additional help text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Remember your password?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Back to login
              </a>
            </p>
          </div>
        </div>
        
        {/* Subtle bottom accent with blue theme */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-60" />
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

export default ForgotPassword;