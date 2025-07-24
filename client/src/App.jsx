import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ConfirmEmail from './pages/ConfirmEmail.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import GenerateFeedback from './pages/GenerateFeedback.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AllFeedback from './pages/AllFeedback.jsx';
import ManageProfile from './pages/ManageProfile.jsx';
import ChatModalProvider from './context/ChatModalContext.jsx';
import ChatModal from './components/ui/ChatModal.jsx';
import { useState, useEffect, useCallback } from 'react';
import api from './services/api';
import MainLayout from './components/ui/MainLayout.jsx';

function App() {
  // Global essays state
  const [essays, setEssays] = useState([]);
  const [essaysLoading, setEssaysLoading] = useState(true);
  const [essaysError, setEssaysError] = useState(null);

  // Fetch essays globally
  const fetchEssays = useCallback(async () => {
    setEssaysLoading(true);
    setEssaysError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setEssays([]);
        setEssaysLoading(false);
        return;
      }
      const data = await api.getUserEssays(token);
      setEssays(data);
    } catch (err) {
      setEssaysError(err.message || 'Failed to load essays.');
    } finally {
      setEssaysLoading(false);
    }
  }, []);

  // Fetch essays on mount
  useEffect(() => {
    fetchEssays();
  }, [fetchEssays]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ChatModalProvider essays={essays} fetchEssays={fetchEssays}>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserDashboard essays={essays} fetchEssays={fetchEssays} essaysLoading={essaysLoading} essaysError={essaysError} />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/generate-feedback"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <GenerateFeedback essays={essays} fetchEssays={fetchEssays} essaysLoading={essaysLoading} essaysError={essaysError} />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedbacks"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AllFeedback essays={essays} fetchEssays={fetchEssays} essaysLoading={essaysLoading} essaysError={essaysError} />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ManageProfile />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ChatModal />
          </div>
        </ChatModalProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;