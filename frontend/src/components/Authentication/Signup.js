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
  Avatar,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Signup = ({ goToLogin }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const toast = useToast();
  const history = useHistory();

  // IMAGE HANDLER (UNCHANGED)
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // SIGNUP API + AUTO LOGIN
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2000,
      });
    }

    if (password !== confirmPassword) {
      return toast({
        title: "Passwords do not match",
        status: "error",
        duration: 2000,
      });
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (image) {
        formData.append("pic", image);
      }

      const res = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast({
        title: "Account created 🎉",
        status: "success",
        duration: 2000,
      });

      console.log("REGISTER RESPONSE:", data);

      // 🔐 store session (NO UI CHANGE)
      localStorage.setItem("userInfo", JSON.stringify(data));

      // 🚀 go to chat
      history.push("/chats");

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
      });
    }
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

        {/* HEADER (UNCHANGED UI) */}
        <VStack spacing={1}>
          <Heading
            size="lg"
            bgGradient="linear(to-r, blue.400, cyan.400)"
            bgClip="text"
          >
            Create Account
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Join and start chatting 🚀
          </Text>
        </VStack>

        {/* PROFILE IMAGE (UNCHANGED UI) */}
        <VStack spacing={2}>
          <Avatar size="xl" src={imagePreview} />

          <Input
            type="file"
            accept="image/*"
            id="picUpload"
            onChange={handleImage}
            display="none"
          />

          <Button
            as="label"
            htmlFor="picUpload"
            variant="outline"
            borderColor="gray.600"
            color="gray.300"
            _hover={{
              bg: "gray.700",
              borderColor: "blue.400",
              color: "white",
            }}
          >
            {image ? "Change Profile Picture" : "Upload Profile Picture"}
          </Button>
        </VStack>

        {/* NAME */}
        <FormControl>
          <FormLabel color="gray.300">Name</FormLabel>
          <Input
            placeholder="e.g. Aarush Singh"
            value={name}
            onChange={(e) => setName(e.target.value)}
            bg="gray.700"
            border="1px solid"
            borderColor="gray.600"
            color="white"
            borderRadius="lg"
          />
        </FormControl>

        {/* EMAIL */}
        <FormControl>
          <FormLabel color="gray.300">Email</FormLabel>
          <Input
            placeholder="e.g. user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="gray.700"
            border="1px solid"
            borderColor="gray.600"
            color="white"
            borderRadius="lg"
          />
        </FormControl>

        {/* PASSWORD */}
        <FormControl>
          <FormLabel color="gray.300">Password</FormLabel>
          <InputGroup>
            <Input
              type={showPass ? "text" : "password"}
              value={password}
                placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              bg="gray.700"
              color="white"
              border="1px solid"
              borderColor="gray.600"
              borderRadius="lg"
            />
            <InputRightElement>
              <Button size="sm" onClick={() => setShowPass(!showPass)}>
                {showPass ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* CONFIRM PASSWORD */}
        <FormControl>
          <FormLabel color="gray.300">Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              bg="gray.700"
              color="white"
              border="1px solid"
              borderColor="gray.600"
              borderRadius="lg"
            />
            <InputRightElement>
              <Button size="sm" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* BUTTON */}
        <Button
          bgGradient="linear(to-r, blue.500, cyan.500)"
          color="white"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          onClick={handleSignup}
        >
          Create Account
        </Button>

        <Divider borderColor="gray.600" />

        {/* FOOTER */}
        <Text textAlign="center" fontSize="sm" color="gray.400">
          Already have an account?{" "}
          <Text
            as="span"
            color="blue.400"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={goToLogin}
          >
            Login →
          </Text>
        </Text>

      </VStack>
    </Box>
  );
};

export default Signup;