import {
  Box,
  Button,
  Container,
  Input,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";

type Props = {};

const SignUp = (props: Props) => {
  const toast = useToast();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const validateForm = (text: string, regex: RegExp) => {
    if (regex.test(text)) return true;
    return false;
  };
  const createUser = () => {
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
    if (confirmPassword != password) {
      toast({
        title: "Invalid Confirm Password!",
        description:
          "Please make sure your confirm password matches with your password",
        status: "error",
        duration: 5000,
      });
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await setDoc(doc(db, "users", email), {
          email: email,
        });
        toast({
          title: "Account Created!",
          description: "We have created your account for you.",
          status: "success",
          duration: 5000,
        });
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        toast({
          title: "ERROR404",
          description: "An Error has Occured!",
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
            value={email}
          />

          <InputGroup size={"lg"}>
            <Input
              size={"lg"}
              pr={"4.5rem"}
              placeholder={"Password..."}
              type={showPass ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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

          <InputGroup size={"lg"}>
            <Input
              size={"lg"}
              pr={"4.5rem"}
              placeholder={"Confirm Password..."}
              type={showConfirm ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowConfirm((val) => !val)}
                variant={"ghost"}
                bgColor={"gray.800"}
              >
                {showConfirm ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            variant={"ghost"}
            bgColor={"red"}
            color={"black"}
            size={"lg"}
            onClick={createUser}
            _hover={{
              bgColor: "unset",
              border: "2px solid red",
              color: "red",
            }}
            _active={{}}
            _focus={{}}
          >
            Sign Up
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default SignUp;
