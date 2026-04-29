import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  VStack,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Text,
  Divider,
  useToast,
  Box,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const history = useHistory();

  //  NORMAL LOGIN (backend)
  const handleLogin = async () => {
    if (!email || !password) {
      return toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast({
        title: "Login successful 🚀",
        status: "success",
        duration: 1000,
        isClosable: true,
      });

      console.log("LOGIN RESPONSE:", data);

      history.push("/chats");

    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  //  GUEST LOGIN (FIXED - NO API CALL)
  const handleGuest = () => {
    const guestEmail = "guest@example.com";
    const guestPassword = "123456";

    // auto fill UI only
    setEmail(guestEmail);
    setPassword(guestPassword);

    toast({
      title: "Guest mode activated 🚀",
      status: "success",
      duration: 1500,
      isClosable: true,
    });

    // instant redirect
    history.push("/chats");
  };

  return (
    <Box
      p={6}
      borderRadius="xl"
      bg="rgba(30, 41, 59, 0.8)"
      backdropFilter="blur(10px)"
      border="1px solid rgba(255,255,255,0.08)"
    >
      <VStack spacing={6} align="stretch">

        {/* HEADER */}
        <VStack spacing={1}>
          <Heading
            size="lg"
            bgGradient="linear(to-r, blue.400, cyan.400)"
            bgClip="text"
          >
            Welcome Back
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Sign in to continue your journey
          </Text>
        </VStack>

        {/* EMAIL */}
        <FormControl>
          <FormLabel color="gray.300">Email</FormLabel>
          <Input
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="gray.700"
            border="1px solid"
            borderColor="gray.600"
            _hover={{ borderColor: "blue.400" }}
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px #3182ce",
            }}
            color="white"
            borderRadius="lg"
          />
        </FormControl>

        {/* PASSWORD */}
        <FormControl>
          <FormLabel color="gray.300">Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              bg="gray.700"
              border="1px solid"
              borderColor="gray.600"
              _hover={{ borderColor: "blue.400" }}
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
              color="white"
              borderRadius="lg"
            />
            <InputRightElement>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShow(!show)}
              >
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* LOGIN BUTTON */}
        <Button
          bgGradient="linear(to-r, blue.500, cyan.500)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, blue.400, cyan.400)",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          _active={{ transform: "scale(0.98)" }}
          borderRadius="lg"
          onClick={handleLogin}
        >
          Login
        </Button>

        <Divider borderColor="gray.600" />

        {/* GUEST BUTTON */}
        <Button
          variant="outline"
          borderColor="gray.600"
          color="gray.300"
          _hover={{
            bg: "gray.700",
            borderColor: "blue.400",
            color: "white",
          }}
          borderRadius="lg"
          onClick={handleGuest}
        >
          Use Guest Credentials
        </Button>

      </VStack>
    </Box>
  );
};

export default Login;