import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Image,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

/* 🌊 background animation */
const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* 💬 floating animation */
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-18px); }
  100% { transform: translateY(0px); }
`;

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Flex
      minH="100vh"
      bg="#0b1220"
      backgroundSize="400% 400%"
      animation={`${gradientMove} 12s ease infinite`}
      align="center"
      justify="space-between"
      px={{ base: 4, md: 20 }}
      direction={{ base: "column", md: "row" }}
      position="relative"
      overflow="hidden"
    >
      {/* 🌌 background glow */}
      <Box position="absolute" inset={0} opacity={0.25}>
        <Box
          position="absolute"
          w="320px"
          h="320px"
          bg="blue.500"
          borderRadius="full"
          top="10%"
          left="5%"
          filter="blur(90px)"
        />
        <Box
          position="absolute"
          w="280px"
          h="280px"
          bg="cyan.400"
          bottom="10%"
          right="10%"
          filter="blur(100px)"
        />
      </Box>

      {/* ================= LEFT: AUTH CARD ================= */}
      <Box flex="1" display="flex" justifyContent="center" zIndex={2}>
        <Box
          w="100%"
          maxW="420px"
          p={8}
          borderRadius="2xl"
          bg="rgba(15, 23, 42, 0.85)"
          backdropFilter="blur(18px)"
          border="1px solid rgba(255,255,255,0.08)"
          boxShadow="2xl"
          _hover={{ transform: "translateY(-5px)" }}
          transition="0.3s"
        >
          {/* HEADER */}
          <VStack mb={6}>
            <Heading
              bgGradient="linear(to-r, blue.400, cyan.300)"
              bgClip="text"
              fontSize="3xl"
            >
              Talkative 💬
            </Heading>

            <Text fontSize="sm" color="gray.400" textAlign="center">
              Connect instantly with friends & communities
            </Text>
          </VStack>

          {/* TOGGLE */}
          <HStack mb={6}>
            <Button
              flex={1}
              onClick={() => setIsLogin(true)}
              bg={isLogin ? "blue.500" : "gray.700"}
              _hover={{ bg: "blue.400" }}
              color="white"
            >
              Login
            </Button>

            <Button
              flex={1}
              onClick={() => setIsLogin(false)}
              bg={!isLogin ? "blue.500" : "gray.700"}
              _hover={{ bg: "blue.400" }}
              color="white"
            >
              Sign Up
            </Button>
          </HStack>

          {/* FORM */}
          {isLogin ? <Login /> : <Signup />}
        </Box>
      </Box>

      {/* ================= RIGHT: IMAGE ================= */}
      <Box
        flex="1"
        zIndex={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={{ base: 10, md: 0 }}
      >
        <VStack spacing={6}>
          <Image
            src="https://img.freepik.com/premium-photo/happy-young-woman-checking-her-phone-blue-background-with-generative-ai_1375-15574.jpg?w=2000"
            alt="Chat App Illustration"
            maxW="1000px"
            w="100%"
            animation={`${float} 6s ease-in-out infinite`}
            borderRadius="20px"
          />

          <Text color="gray.400" textAlign="center" maxW="350px">
            Seamless chatting experience with real-time messaging, groups, and
            friends — all in one place.
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default HomePage;