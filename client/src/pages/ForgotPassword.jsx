import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9e9f3]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col items-center px-8 py-10">
        <img src={gradelyLogo} alt="Gradely Logo" className="w-14 mb-6" />
        <h1 className="text-2xl font-semibold mb-6 text-center">Forgot your password?</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
