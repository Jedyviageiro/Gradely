import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Bell, Settings, AlertTriangle, UserIcon, CheckCircle, Loader, Search, Camera, Upload } from 'lucide-react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';
import EmailsAndPassword from './EmailsAndPassword';
import useAuth from '../hooks/useAuth'; // Import the useAuth hook

const ManageProfile = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile_picture_url: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [status, setStatus] = useState('idle'); // idle, loading, saving, success, error
  const [uploadStatus, setUploadStatus] = useState('idle'); // separate status for image upload
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('Personal Info');
  
  // Ref for file input
  const fileInputRef = useRef(null);

  // Get the login function from AuthContext to update global state
  const { login } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setStatus('loading');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Pre-fill with token data for a faster perceived load
          const decoded = jwtDecode(token);
          setFormData({
            first_name: decoded.first_name || '',
            last_name: decoded.last_name || '',
            email: decoded.email || '',
            profile_picture_url: decoded.profile_picture_url || ''
          });

          // Fetch the most up-to-date profile from the server
          const profileData = await api.getProfile(token);
          setFormData(profileData);
          setOriginalData(profileData);
          setStatus('idle');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
        setStatus('error');
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await api.updateProfile(token, {
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      // Use the login function to update the global auth state and localStorage
      login(response.token);

      setOriginalData(response.user);
      setFormData(response.user); // Resync form data with the new original data
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000); // Reset status after 2s
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      setStatus('error');
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    
    if (file.size > maxFileSize) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadStatus('uploading');
    setUploadError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.updateProfilePicture(token, formData);
      
      // Use the login function to update the global auth state and localStorage
      login(response.token);

      setFormData(prev => ({ 
        ...prev, 
        profile_picture_url: response.user.profile_picture_url 
      }));
      setOriginalData(prev => ({ 
        ...prev, 
        profile_picture_url: response.user.profile_picture_url 
      }));
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload profile picture.');
      setUploadStatus('error');
    }

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Determine if the form data has changed from its original state.
  const isDirty = formData.first_name !== originalData.first_name || formData.last_name !== originalData.last_name;

  const menuItems = [
    { icon: User, label: 'Personal Info' },
    { icon: Mail, label: 'Emails & Password' },
    { icon: Bell, label: 'Notifications' }
  ];

  // Function to render the appropriate content based on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case 'Personal Info':
        return renderPersonalInfo();
      case 'Emails & Password':
        return <EmailsAndPassword email={formData.email} />;
      case 'Notifications':
        return renderNotifications();
      default:
        return renderPersonalInfo();
    }
  };

  const renderPersonalInfo = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Personal information</h1>
        {status === 'saving' && (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Saving changes...</span>
          </div>
        )}
        {status === 'success' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Profile updated!</span>
          </div>
        )}
      </div>

      {/* Profile Picture */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 group">
            {formData.profile_picture_url ? (
              <img 
                src={formData.profile_picture_url} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            
            {/* Upload overlay that appears on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                 onClick={triggerFileInput}>
              <Camera className="w-6 h-6 text-white" />
            </div>

            {/* Upload status indicator */}
            {uploadStatus === 'uploading' && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Loader className="w-4 h-4 text-white animate-spin" />
              </div>
            )}
            {uploadStatus === 'success' && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <button
              onClick={triggerFileInput}
              disabled={uploadStatus === 'uploading'}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>{uploadStatus === 'uploading' ? 'Uploading...' : 'Change Picture'}</span>
            </button>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, GIF or WebP. Max 2MB.
            </p>
            {uploadError && (
              <p className="text-red-500 text-xs mt-1">{uploadError}</p>
            )}
            {uploadStatus === 'success' && (
              <p className="text-green-600 text-xs mt-1">Picture updated successfully!</p>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleProfilePictureUpload}
          className="hidden"
        />
      </div>

      {status === 'loading' ? (
        <p>Loading profile...</p>
      ) : (
        <form onSubmit={handleSave}>
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div>
            <button
              type="submit"
              className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300"
              disabled={!isDirty || status === 'saving' || status === 'loading'}
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Delete Account Section */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
        
        <div className="flex items-start space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            After making a deletion request, you will have <strong>6 months</strong> to maintain this account.
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          To permanently erase your whole Profico account, click the button below. This implies that you won't have access to your enterprises, 
          accounting and personal financial data.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          There is no reversing this action.
        </p>

        <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium">
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Notifications</h1>
      <p className="text-gray-600">Notification settings coming soon...</p>
    </div>
  );

  return (
    <>
      <header className="bg-white/80 backdrop-blur-xl px-6 py-4 sticky top-0 z-30 w-full">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={gradelyLogo} alt="Gradely Logo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-normal text-gray-700 hidden sm:block">
              Gradely
            </span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48 md:w-80 border border-gray-200 bg-gray-100/50 rounded-full focus:ring-2 focus:ring-blue-200 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Secondary Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(item.label)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.label
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default ManageProfile;