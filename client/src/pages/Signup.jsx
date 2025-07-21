import SignupForm from '../components/auth/SignupForm';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';
import rightSidePhoto from '../assets/gradely-images/right-side-login-photo.jpg';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 overflow-auto">
      <div className="w-full max-w-5xl h-auto min-h-[650px] bg-white/80 backdrop-blur-sm rounded-3xl flex shadow-2xl border border-white/20 overflow-hidden">
        {/* Left Side: Logo + Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-12 py-8 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-60" />
          
          <div className="relative z-10 w-full max-w-sm">
            {/* Logo with modern styling */}
            <div className="flex justify-center mb-8">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <img src={gradelyLogo} alt="Gradely Logo" className="w-8 h-8 brightness-0 invert" />
              </div>
            </div>
            
            {/* Welcome text */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Create account
              </h1>
              <p className="text-gray-500 text-sm">
                Join Gradely and start your learning journey
              </p>
            </div>
            
            {/* Form container */}
            <div className="space-y-1">
              <SignupForm />
            </div>
          </div>
        </div>
        
        {/* Right Side: Image with overlay */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" 
            style={{ backgroundImage: `url(${rightSidePhoto})` }} 
          />
          {/* Gradient overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-emerald-900/30" />
          {/* Optional decorative elements */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-2">
                Start your journey today
              </h3>
              <p className="text-white/80 text-sm">
                Unlock your potential with personalized learning experiences and expert guidance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;