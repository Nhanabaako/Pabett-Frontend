import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

function parseToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check not expired
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [payload, setPayload] = useState(() => parseToken());

  const refresh = useCallback(() => setPayload(parseToken()), []);

  const isSuperAdmin = payload?.role === 'superadmin';
  const isLoggedIn   = !!payload;
  const role         = payload?.role || null;
  const email        = payload?.email || null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, isSuperAdmin, role, email, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
