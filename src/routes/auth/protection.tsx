import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '@/utils/baseurl';
import { Box, Img, Spinner } from '@chakra-ui/react';

const ProtectionRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axios.post(apiURL + `validate-token`, { token })
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    setTimeout(() => {
      setIsSpinning(true);
    }, 1500);

    validateToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box className='flex items-center justify-center gap-2 w-screen h-screen'>
        <Box className='flex flex-col items-center gap-3'>
          <Img src='/circle.svg' w="fit-content" h="fit-content" maxW="300px" objectFit="contain" mb={10}></Img>
          {isSpinning && (
            <Spinner size="xl" />
          )}
          {/* <span>Loading...</span> */}
        </Box>
      </Box>);
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectionRoute;