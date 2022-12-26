import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { db, auth } from "../../Firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Link from "next/link";

type episode = {
  animeName: string;
  latest: number;
  path: string;
  img: string;
};

const Home = () => {
  const logOut = async () => {
    await signOut(auth)
      .then(() => console.log("logged out!"))
      .catch((e) => console.log(e));
  };
  const [episodes, setEpisodes] = useState<episode[]>([]);
  useEffect(() => {
    if (auth.currentUser) {
      const q = query(
        collection(db, `users/${auth.currentUser?.email}/animes`)
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        const temp: episode[] = [];
        querySnapshot.forEach((doc) => {
          temp.push({
            path: doc.id,
            latest: doc.data().latest,
            animeName: doc.data().animeName,
            img: doc.data().img,
          });
        });
        setEpisodes([...temp]);
      });
      return unsub;
    }
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
          mt={10}
          templateColumns={[
            "repeat(1,1fr)",
            "repeat(2,1fr)",
            "repeat(3,1fr)",
            "repeat(4,1fr)",
            "repeat(5,1fr)",
          ]}
          rowGap={10}
          columnGap={8}
        >
          {episodes.map((item: episode, index: any) => {
            return (
              <GridItem h={"100%"} key={index}>
                <Link
                  href={{
                    pathname: `/watch/[name]`,
                    query: { img: item.img, animeName: item.animeName },
                  }}
                  as={`/watch/${item.path}`}
                >
                  <VStack
                    bgColor={"rgba(36, 52, 83, 0.5)"}
                    py={6}
                    borderRadius={"3xl"}
                    h={"100%"}
                  >
                    <Image src={item.img} alt={""} w={160} h={240} />
                    <Text size={"xs"} textAlign={"center"}>
                      {item.animeName}
                    </Text>
                    <Text size={"xs"}>{`Episode ${item.latest}`}</Text>
                  </VStack>
                </Link>
              </GridItem>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
