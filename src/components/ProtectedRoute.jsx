import { Navigate } from 'react-router-dom';
import adminAuthService from '../services/adminAuth';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = adminAuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}
