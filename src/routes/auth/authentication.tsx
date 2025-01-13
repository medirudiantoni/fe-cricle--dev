import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '@/utils/baseurl';

const AuthenticationRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axios.post(apiURL + `validate-token`, { token });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default AuthenticationRoute;