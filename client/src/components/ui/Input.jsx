import PropTypes from 'prop-types';

const Input = ({ type = 'text', name, value, onChange, error, placeholder }) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-6 py-3 bg-[#e3e3ed] border-none rounded-full text-base focus:outline-none placeholder-gray-500 ${
          error ? 'ring-2 ring-red-500' : '' // Error ring remains for validation feedback
        }`}
      />
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Input;