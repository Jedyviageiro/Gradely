import LoginForm from '../components/auth/LoginForm';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';
import rightSidePhoto from '../assets/gradely-images/right-side-login-photo.jpg';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9e9f3]">
      <div className="w-[900px] h-[500px] bg-white rounded-[48px] flex shadow-lg overflow-hidden">
        {/* Left Side: Logo + Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-12">
          <img src={gradelyLogo} alt="Gradely Logo" className="w-10 mb-6" />
          <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
          <LoginForm />
        </div>
        {/* Right Side: Image */}
        <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${rightSidePhoto})` }} />
      </div>
    </div>
  );
};

export default Login;
