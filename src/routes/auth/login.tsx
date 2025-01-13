import { fetchLogin } from '@/features/auth/services/auth-service';
import useUserStore from '@/hooks/userStore';
import { Box, Button, Heading, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  username: z.string().min(3, "Invalid username"),
  password: z.string().min(3, "Invalid password")
});

type LoginFormInput = z.infer<typeof loginSchema>

const Login = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    document.title = `Login | Circle`
  }, []);

  const navigate = useNavigate();

  const { setUser, setUserData } = useUserStore();

  const onSubmit = (inputData: LoginFormInput) => {
    setIsLoading(true);
    fetchLogin(inputData)
      .then((res) => {
        console.log(res);
        if (res.token) {
          setUser(res.user);
          setUserData(res.data);
          Cookies.set('token', res.token);
          setIsError(false);
          setIsLoading(false);
          toast.success(`Welcome back, ${res.data.username}!`, { duration: 4000 });
          navigate('/')
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error(`Login failed. Please try again!`);
        setIsError(true);
        setIsLoading(false);
      })
  };

  return (
    <Box w="100%" h="100vh" py={'32'} px={5}>
      <Box maxW="md" h="50vh" mx="auto">
        <Heading size="3xl" color="brand.500" mb={2}>Circle</Heading>
        <Text mb={3} fontSize="2xl">Login to Circle</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack mb={3}>
            {isError && <Text color="red.500" alignSelf="start">Invalid username or password</Text>}
            <Input
              {...register("username")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='text'
              placeholder='Username'></Input>
            <Input
              {...register("password")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='password'
              placeholder='Password'></Input>
            <HStack justifyContent="end" w="100%">
              <Link to='/forgot-password'>Forgot password?</Link>
            </HStack>
            {isLoading ? (
              <Button disabled type='button' w="100%" borderRadius={100} bg="brand.500" color="inherit">
                <Spinner />
              </Button>
            ) : (
              <Button type='submit' w="100%" borderRadius={100} bg="brand.500" color="inherit" _hover={{ bg: "brand.400" }} _active={{ bg: "brand.900" }}>
                <span>Login</span>
              </Button>
            )}
          </VStack>
        </form>
        <HStack>
          <Text>Don't have an account yet?</Text>
          <Text color="brand.500">
            <Link to="/register">Create account</Link>
          </Text>
        </HStack>
      </Box>
      {isLoading && (
        <HStack justifyContent="center" position="fixed" zIndex={20} top={0} bottom={0} right={0} left={0} className='bg-black/60 backdrop-blur-md'>
          <VStack justifyContent="center">
            <Spinner size="xl" mb={2} />
            <Text>Loading...</Text>
          </VStack>
        </HStack>
      )}
    </Box>
  )
}

export default Login