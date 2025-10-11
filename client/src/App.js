import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Floors from './pages/Floors';
import Classrooms from './pages/Classrooms';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/floors"
        element={
          <PrivateRoute>
            <Floors />
          </PrivateRoute>
        }
      />
      <Route
        path="/classrooms/:floorId"
        element={
          <PrivateRoute>
            <Classrooms />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
