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

export async function getServerSideProps(context: any) {
  const path = context.params.name;
  const response = await fetch(
    `https://anime-scraper-pi.vercel.app/api/getEpNums?path=${path}`
  );
  if (response.status == 404) return { props: { eps: [], path } };
  else {
    const eps = await response.json();
    return {
      props: { eps, path },
    };
  }
}

type Props = {
  eps: Array<number>;
  path: string;
};

const Anime = (props: Props) => {
  const { eps, path } = props;
  const [isLoading, setIsLoading] = useState(false);
  const getLink = async (ep: number) => {
    setIsLoading(true);
    const response = await fetch(
      `https://anime-scraper-pi.vercel.app/api/getEpLink?path=${path}&ep=${ep}`
    );
    const result = await response.json();
    setIsLoading(false);
    window.open(`https:${result}`);
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
      <Container maxW={"7xl"} my={10}>
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
                  bgColor={"rgba(36, 52, 83, 0.5)"}
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
