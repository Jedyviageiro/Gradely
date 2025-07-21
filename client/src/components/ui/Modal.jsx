import { useEffect } from 'react';

const Modal = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
      <div className="relative z-10 max-w-full w-full flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 