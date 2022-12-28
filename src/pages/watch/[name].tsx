import {
  Box,
  Container,
  Grid,
  GridItem,
  HStack,
  Text,
  Spinner,
  ModalOverlay,
  Modal,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../Firebase";

export async function getServerSideProps(context: any) {
  console.log(context.query);
  const path = context.query.name;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/getEpNums?path=${path}`
  );
  if (response.status == 404) return { props: { eps: [], path } };
  else {
    const eps = await response.json();
    return {
      props: {
        eps,
        path,
        img: context.query.img,
        animeName: context.query.animeName,
      },
    };
  }
}

type Props = {
  eps: Array<number>;
  path: string;
  img: string;
  animeName: string;
};

const Anime = (props: Props) => {
  const { eps, path, img, animeName } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [latest, setLatest] = useState(-1);
  useEffect(() => {
    if (auth.currentUser) {
      const unsub = onSnapshot(
        doc(db, `users/${auth.currentUser?.email}/animes/${path}`),
        (doc) => {
          if (doc.exists()) {
            setCompleted(doc.data().completed);
            setLatest(doc.data().latest);
            console.log("completed", doc.data().completed);
            console.log("latest", doc.data().latest);
          }
        }
      );
      return unsub;
    }
  }, []);
  const markCurrent = async (ep: number) => {
    if (auth.currentUser) {
      if (completed.find((i) => i == ep)) {
        console.log("already watched!");
        return;
      }
      await setDoc(doc(db, `users/${auth.currentUser?.email}/animes/${path}`), {
        latest: ep > latest ? ep : latest,
        completed: [...completed, ep],
        animeName: animeName,
        img: img,
      })
        .then(() => console.log("episode updated!"))
        .catch((e) => console.log(e));
    }
  };
  const getLink = async (ep: number) => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/getEpLink?path=${path}&ep=${ep}`
    );
    const result = await response.json();
    setIsLoading(false);
    markCurrent(ep);
    setTimeout(() => {
      window.open(`https:${result}`, "_blank");
    });
    console.log(`https:${result}`);
  };

  return (
    <Box pos={"relative"}>
      <Box
        pos={"fixed"}
        w={"100%"}
        h={"100%"}
        top={"0"}
        display={isLoading ? "flex" : "none"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        zIndex={1}
        bgColor={"rgb(0,0,0,0.5)"}
      >
        <Spinner size={"lg"} />
      </Box>
      <Container maxW={"7xl"} py={36}>
        <Grid
          templateColumns={[
            "repeat(3,1fr)",
            "repeat(5,1fr)",
            "repeat(6,1fr)",
            "repeat(7,1fr)",
            "repeat(8,1fr)",
            "repeat(9,1fr)",
          ]}
          rowGap={4}
          columnGap={4}
        >
          {eps.map((item: number, index: any) => {
            return (
              <GridItem
                key={index}
                w={"100%"}
                onClick={() => getLink(item)}
                _hover={{ cursor: "pointer" }}
              >
                <HStack
                  justifyContent={"center"}
                  bgColor={
                    completed.find((i) => i == item)
                      ? "red"
                      : "rgba(36, 52, 83, 0.5)"
                  }
                  p={2}
                >
                  <Text>EP</Text>
                  <Text>{item}</Text>
                </HStack>
              </GridItem>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Anime;
