import {
  Box,
  Button,
  Container,
  Input,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase";
import Link from "next/link";

type Props = {};

const Login = (props: Props) => {
  const toast = useToast();
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = (text: string, regex: RegExp) => {
    if (regex.test(text)) return true;
    return false;
  };
  const loginUser = () => {
    if (!validateForm(email, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      toast({
        title: "Invalid Email!",
        description: "Please make sure you entered a valid email.",
        status: "error",
        duration: 5000,
      });
      return;
    }
    if (!validateForm(password, /(?=.*[0-9a-zA-Z]).{6,}/)) {
      toast({
        title: "Invalid Password!",
        description: "Please make sure you entered a valid password.",
        status: "error",
        duration: 5000,
      });
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        toast({
          title: "Logged In!",
          description: "Login Successful",
          status: "success",
          duration: 5000,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        toast({
          title: "ERROR404",
          description:
            errorCode == "auth/user-not-found"
              ? "Invalid Email"
              : "Invalid Password",
          status: "error",
          duration: 5000,
        });
      });
  };
  return (
    <Box>
      <Container maxW={"2xl"} py={[80]}>
        <VStack spacing={[4]}>
          <Input
            placeholder={"Email..."}
            onChange={(e) => setEmail(e.target.value)}
            size={"lg"}
          />

          <InputGroup size={"lg"}>
            <Input
              size={"lg"}
              pr={"4.5rem"}
              placeholder={"Password..."}
              type={showPass ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowPass((val) => !val)}
                variant={"ghost"}
                bgColor={"gray.800"}
              >
                {showPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            variant={"ghost"}
            bgColor={"red"}
            color={"black"}
            size={"lg"}
            onClick={loginUser}
            _hover={{
              bgColor: "unset",
              border: "2px solid red",
              color: "red",
            }}
            _active={{}}
            _focus={{}}
          >
            Login
          </Button>
          <Link href={"/signUp"}>
            <Text
              size={"xs"}
              color={"linkedin.500"}
              _hover={{ color: "gray.700" }}
            >
              New? Create a New Account!
            </Text>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
