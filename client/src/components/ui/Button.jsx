import PropTypes from 'prop-types';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
  const baseStyles = 'px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 rounded-md',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 rounded-md',
    accent: 'bg-[#e75625] hover:bg-[#d14e1a] text-white focus:ring-[#e75625] rounded-full',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;