import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return React.createElement('div', {
      className: 'min-h-screen flex items-center justify-center'
    }, [
      React.createElement('div', {
        key: 'loading',
        className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
      })
    ]);
  }

  if (!isAuthenticated()) {
    return React.createElement(Navigate, { to: '/', replace: true });
  }

  if (requiredRole && user.userType !== requiredRole) {
    return React.createElement(Navigate, { 
      to: user.userType === 'student' ? '/student' : 
          user.userType === 'driver' ? '/driver' : '/admin', 
      replace: true 
    });
  }

  return children;
};

function AppRoutes() {
  return React.createElement(Routes, { key: 'routes' }, [
    React.createElement(Route, {
      key: 'login',
      path: '/',
      element: React.createElement(Login)
    }),
    React.createElement(Route, {
      key: 'student',
      path: '/student',
      element: React.createElement(ProtectedRoute, { requiredRole: 'student' }, 
        React.createElement(StudentDashboard)
      )
    }),
    React.createElement(Route, {
      key: 'driver',
      path: '/driver',
      element: React.createElement(ProtectedRoute, { requiredRole: 'driver' }, 
        React.createElement(DriverDashboard)
      )
    }),
    React.createElement(Route, {
      key: 'admin',
      path: '/admin',
      element: React.createElement(ProtectedRoute, { requiredRole: 'admin' }, 
        React.createElement(AdminDashboard)
      )
    })
  ]);
}

function App() {
  return React.createElement(AuthProvider, null, [
    React.createElement(BrowserRouter, { key: 'router' }, [
      React.createElement(AppRoutes, { key: 'app-routes' })
    ])
  ]);
}

export default App;