import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { SignIn } from './components/auth/Signin';
import { Signup } from './components/auth/Signup';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page as default route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authentication routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Dashboard route (protected) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          {/* Redirect any unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
