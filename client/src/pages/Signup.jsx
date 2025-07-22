import SignupForm from '../components/auth/SignupForm';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';
import rightSidePhoto from '../assets/gradely-images/right-side-login-photo.jpg';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/30 rounded-full blur-lg"></div>
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-indigo-200/25 rounded-full blur-md"></div>
      <div className="absolute bottom-20 right-10 w-28 h-28 bg-slate-200/20 rounded-full blur-lg"></div>

      <div className="w-full max-w-4xl h-auto min-h-[650px] bg-white/60 backdrop-blur-xl rounded-3xl flex shadow-2xl border border-white/30 overflow-hidden relative">
        {/* Left Side: Logo + Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-6 relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-transparent opacity-80 rounded-l-3xl" />
          
          <div className="relative z-10 w-full max-w-xs">
            {/* Logo with enhanced styling - CENTERED */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src={gradelyLogo} alt="Gradely Logo" className="w-7 h-7 object-contain" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Gradely
              </span>
            </div>
            
            {/* Welcome text with modern typography - CENTERED */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent mb-1 leading-tight">
                Create Account
              </h1>
              <p className="text-gray-600 text-sm">
                Join Gradely and start your learning journey
              </p>
            </div>
            
            {/* Form container with enhanced styling */}
            <div className="space-y-1">
              <SignupForm />
            </div>
          </div>
        </div>
        
        {/* Right Side: Image with enhanced overlay */}
        <div className="flex-1 relative overflow-hidden rounded-l-3xl rounded-r-3xl">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${rightSidePhoto})` }}
          />
          
          {/* Enhanced gradient overlay with blue tones */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-600/20 to-indigo-900/40" />
          
          {/* Bottom content card */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-3">
                Start Your Journey Today
              </h3>
              <p className="text-white/90 text-base leading-relaxed">
                Unlock your potential with personalized learning experiences and expert guidance from Gradely.
              </p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Personalized learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default Signup;