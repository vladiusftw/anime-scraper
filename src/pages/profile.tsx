import { Box, Container } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import Login from "../components/profile/login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import Home from "../components/profile/home";

type Props = {};

const Profile = (props: Props) => {
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.email);
        setIsLogged(true);
        // ...
      } else {
        setIsLogged(false);
      }
    });
  }, []);
  return (
    <>
      <NextSeo title="Home" />
      {isLogged ? <Home /> : <Login />}
    </>
  );
};

export default Profile;
