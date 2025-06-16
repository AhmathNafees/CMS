// AuthProvider.jsx
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const userContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAndRefresh = async () => {
      try {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          try {
            const response = await axios.get('http://localhost:3000/api/auth/verify', {
              headers: { "Authorization": `Bearer ${accessToken}` }
            });
            if (response.data.success) {
              setUser(response.data.user);
              return;
            }
          } catch (verifyError) {
            // If verification fails (e.g., token expired), try refreshing
            if (verifyError.response && verifyError.response.status === 401) {
              const refreshToken = localStorage.getItem('refreshToken');
              if (refreshToken) {
                const refreshResponse = await axios.post('http://localhost:3000/api/auth/refresh', { refreshToken });
                if (refreshResponse.data.success) {
                  // Store new tokens
                  localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                  localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
                  // Verify with the new access token
                  const newVerify = await axios.get('http://localhost:3000/api/auth/verify', {
                    headers: { "Authorization": `Bearer ${refreshResponse.data.accessToken}` }
                  });
                  if (newVerify.data.success) {
                    setUser(newVerify.data.user);
                    return;
                  }
                }
              }
            }
            // If refresh fails, clear the user  
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAndRefresh();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
    }
    
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthProvider;
