import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { db, auth } from "../../Firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

type episode = {
  name: string;
  latest: number;
};

const Home = () => {
  const logOut = async () => {
    await signOut(auth)
      .then(() => console.log("logged out!"))
      .catch((e) => console.log(e));
  };
  const [episodes, setEpisodes] = useState<episode[]>([]);
  useEffect(() => {
    const q = query(collection(db, `users/${auth.currentUser?.email}/animes`));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const temp: episode[] = [];
      querySnapshot.forEach((doc) => {
        temp.push({
          name: doc.id,
          latest: doc.data().latest,
        });
      });
      setEpisodes([...temp]);
    });
    return unsub;
  }, []);
  return (
    <Box>
      <Container maxW={"7xl"} py={[36]}>
        <Button
          size={"lg"}
          variant={"ghost"}
          bgColor={"gray.700"}
          w={"100%"}
          onClick={logOut}
        >
          Sign Out
        </Button>
        <Grid
          mt={4}
          templateColumns={[
            "repeat(1,1fr)",
            "repeat(2,1fr)",
            "repeat(3,1fr)",
            "repeat(4,1fr)",
          ]}
          columnGap={2}
          rowGap={2}
        >
          {episodes.map((item: episode, index: any) => {
            return (
              <GridItem
                key={index}
                bgColor={"rgba(36, 52, 83, 0.5)"}
                p={4}
                borderRadius={"xl"}
              >
                <HStack
                  spacing={[4]}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  h={"100%"}
                >
                  <Text size={"sm"}>{item.name}</Text>
                  <Text size={"sm"}>{item.latest}</Text>
                </HStack>
              </GridItem>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
