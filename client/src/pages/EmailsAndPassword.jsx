import React, { useState } from 'react';
import { Mail, Send, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const EmailsAndPassword = ({ email }) => {
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setStatus('sending');
    setError('');
    try {
      // This reuses your existing forgot password API endpoint
      await api.forgotPassword(email);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions.');
      setStatus('error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Emails & Password</h1>

      {/* Email Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            readOnly
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Your email address cannot be changed.</p>
      </div>

      {/* Password Reset */}
      <div className="p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Password</h3>
        <p className="text-sm text-gray-600 mb-4">
          If you've forgotten your password, you can request to reset it. We'll send a secure PIN to your email address.
        </p>
        
        <button
          onClick={handleResetPassword}
          disabled={status === 'sending'}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' && <Loader className="w-4 h-4 animate-spin" />}
          {status !== 'sending' && <Send className="w-4 h-4" />}
          <span>{status === 'sending' ? 'Sending...' : 'Send Reset Instructions'}</span>
        </button>

        {status === 'success' && (
          <div className="flex items-center space-x-2 text-green-600 mt-3">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Reset instructions sent! Please check your inbox.</span>
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center space-x-2 text-red-600 mt-3">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailsAndPassword;