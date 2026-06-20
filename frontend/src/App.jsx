import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import IdeasFeed from './pages/IdeasFeed';
import SubmitIdea from './pages/SubmitIdea';
import IdeaDetail from './pages/IdeaDetail';
import AdminDashboard from './pages/AdminDashboard';
import AIInsights from './pages/AIInsights';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated */}
          <Route path="/ideas" element={
            <ProtectedRoute><IdeasFeed /></ProtectedRoute>
          } />
          <Route path="/ideas/new" element={
            <ProtectedRoute><SubmitIdea /></ProtectedRoute>
          } />
          <Route path="/ideas/:id" element={
            <ProtectedRoute><IdeaDetail /></ProtectedRoute>
          } />

          {/* Admin Only */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/insights" element={
            <ProtectedRoute adminOnly><AIInsights /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.95)',
              color: '#ffffff',
              border: '1px solid rgba(7, 163, 137, 0.3)',
              backdropFilter: 'blur(16px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#07a389', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dbdb35', secondary: '#000000' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
