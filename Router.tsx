import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import App from './App';
import AnalyzeExposure from './analyze/AnalyzeExposure';
import Login from './auth/Login';
import AdminDashboard from './dashboards/AdminDashboard';
import StaffDashboard from './dashboards/StaffDashboard';

function WelcomeMessage({ onClose }: { onClose: () => void }) {
  const { userData } = useAuth();
  
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className='fixed top-8 right-8 z-50 bg-gradient-to-r from-[#10454F] to-[#BDE038] text-black px-6 py-4 rounded-xl shadow-2xl animate-fade-in'>
      <div className='flex items-center gap-3'>
        <span className='text-2xl'>👋</span>
        <div>
          <div className='font-bold text-lg'>Welcome back, {userData?.name || 'User'}!</div>
          <div className='text-sm opacity-90'>Good to see you again</div>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'admin' | 'staff' }) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-[#BDE038] text-xl'>Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (allowedRole && userData?.role !== allowedRole) {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const { userData } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  // Regular users go to homepage, not dashboard
  if (userData?.role === 'user') {
    return <Navigate to='/' replace />;
  }

  if (userData?.role === 'admin') {
    return (
      <>
        {showWelcome && <WelcomeMessage onClose={() => setShowWelcome(false)} />}
        <AdminDashboard />
      </>
    );
  }

  if (userData?.role === 'staff') {
    return (
      <>
        {showWelcome && <WelcomeMessage onClose={() => setShowWelcome(false)} />}
        <StaffDashboard />
      </>
    );
  }

  return <Navigate to='/login' replace />;
}

function HomePage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [showWelcome, setShowWelcome] = useState(!!userData);

  return (
    <>
      {showWelcome && userData && <WelcomeMessage onClose={() => setShowWelcome(false)} />}
      <App onNavigateToAnalyze={() => navigate('/analyze')} />
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          
          <Route
            path='/analyze'
            element={
              <ProtectedRoute>
                <AnalyzeExposure />
              </ProtectedRoute>
            }
          />
          
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
