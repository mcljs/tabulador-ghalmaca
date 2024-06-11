import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import apiService from '@/services/apiService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useRouter();

  const loginMutation = useMutation(
    async ({ email, password }) => {
      const response = await apiService.post('/auth/login', {
        username: email,
        password,
      });
      console.log(response);
      return response;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.accessToken);
        apiService.setAuthToken(data.accessToken);
        const decodedUser = jwtDecode(data.accessToken);
        console.log(decodedUser);
        setUser({ ...decodedUser, ...data.user });
        toast.success(`Bienvenido ${data.user.firstName}!`);
        history.push('/');
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          'Error al iniciar sesión. Por favor, revisa tus credenciales.';
        toast.error(errorMessage);
      },
    },
  );

  const logout = () => {
    localStorage.removeItem('token');
    apiService.removeAuthToken();
    setUser(null);
    window.location.reload();
    toast.success('Sesión cerrada.');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiService.setAuthToken(token);
      try {
        const decodedUser = jwtDecode(token);
        const expDate = DateTime.fromSeconds(decodedUser.exp);
        const now = DateTime.now();

        if (now >= expDate) {
          console.log('Token expired');
          logout();
        } else {
          setUser(decodedUser);

          const msUntilExpiration = expDate.diff(now).toMillis();
          setTimeout(logout, msUntilExpiration);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const contextValue = {
    user,
    isLoading: loginMutation.isLoading,
    isError: loginMutation.isError,
    login: loginMutation.mutate,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
