import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token    = localStorage.getItem('token');
  const adminKey = localStorage.getItem('adminKey');

  if (!token && !adminKey) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
