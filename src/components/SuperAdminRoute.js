import { Navigate } from 'react-router-dom';

export default function SuperAdminRoute({ children }) {
  const role = localStorage.getItem('adminRole');
  if (role !== 'superadmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}
