import { fetchRegister } from '@/features/auth/services/auth-service';
import { Box, Button, Heading, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Invalid username"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type RegisterFormInput = z.infer<typeof registerSchema>

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema)
  });

  useEffect(() => {
    document.title = `Register | Circle`
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  useEffect(() => {
    console.log(isError)
  }, [isError])

  const navigate = useNavigate();

  const onSubmit = (inputData: RegisterFormInput) => {
    setIsLoading(true)
    fetchRegister(inputData)
      .then((res) => {
        if (res.data) {
          setTimeout(() => {
            setIsLoading(false)
            toast.success("Registration successful", { duration: 4000, style: { background: "#333", color: "#fff" } });
            navigate('/login')
          }, 1000);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(error.message);
      })
  };

  return (
    <Box w="100%" h="100vh" py={'32'} px={5}>
      <Box maxW="md" h="50vh" mx="auto">
        <Heading size="3xl" color="brand.500" mb={2}>Circle</Heading>
        <Text mb={3} fontSize="2xl">Create account Circle</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack mb={3}>
            {errors.username && <Text color="red.500" alignSelf="start">Invalid username</Text>}
            {isError && <Text color="red.500" alignSelf="start">{isError}</Text>}
            <Input
              {...register("username")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='text'
              placeholder='Username'></Input>
            {errors.email && <Text color="red.500" alignSelf="start">{errors.email.message}</Text>}
            <Input
              {...register("email")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='email'
              placeholder='Email'></Input>
            {errors.password && <Text color="red.500" alignSelf="start">{errors.password.message}</Text>}
            <Input
              {...register("password")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='password'
              placeholder='Password'></Input>
            {isLoading ? (
              <Button disabled type='button' w="100%" borderRadius={100} bg="brand.500" color="inherit">
                <Spinner />
              </Button>
            ) : (
              <Button type='submit' w="100%" borderRadius={100} bg="brand.500" color="inherit" _hover={{ bg: "brand.400" }} _active={{ bg: "brand.900" }}>
                <span>Create account</span>
              </Button>
            )}
          </VStack>
        </form>
        <HStack>
          <Text>Already have an account?</Text>
          <Text color="brand.500">
            <Link to="/login">Login</Link>
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

export default Register