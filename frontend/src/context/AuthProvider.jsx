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
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const role = localStorage.getItem('userRole');

        if (!accessToken || !role) {
          setUser(null);
          setLoading(false);
          return;
        }

        const baseURL = role === "supplier" ? "http://localhost:3000/api/supplier" : "http://localhost:3000/api/auth";

        try {
          const verifyResponse = await axios.get(`${baseURL}/verify`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (verifyResponse.data.success) {
            setUser(verifyResponse.data.user || verifyResponse.data.supplier);
            return;
          }
        } catch (verifyError) {
          if (verifyError.response && verifyError.response.status === 401 && refreshToken) {
            const refreshEndpoint = role === "supplier"
              ? "http://localhost:3000/api/supplier/refresh"
              : "http://localhost:3000/api/auth/refresh";

            try {
              const refreshResponse = await axios.post(refreshEndpoint, { refreshToken });

              if (refreshResponse.data.success) {
                localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

                const reVerify = await axios.get(`${baseURL}/verify`, {
                  headers: { Authorization: `Bearer ${refreshResponse.data.accessToken}` },
                });

                if (reVerify.data.success) {
                  setUser(reVerify.data.user || reVerify.data.supplier);
                  return;
                }
              }
            } catch (refreshError) {
              console.error("Refresh failed", refreshError.message);
            }
          }
          setUser(null);
        }
      } catch (error) {
        console.error("Verify error", error.message);
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
