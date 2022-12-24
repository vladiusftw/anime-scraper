import {
  Box,
  Container,
  Grid,
  GridItem,
  HStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export async function getServerSideProps(context: any) {
  const path = context.params.name;
  const response = await fetch(
    `http://localhost:3000/api/getEpNums?path=${path}`
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
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const getLink = async (ep: number) => {
    setIsLoading(true);
    const response = await fetch(
      `http://localhost:3000/api/getEpLink?path=${path}&ep=${ep}`
    );
    const result = await response.json();
    console.log(`https:${result}`);
    setLink(`https:${result}`);
  };

  return (
    <Box>
      <Container maxW={"7xl"}>
        <Box
          w={"100%"}
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          my={10}
          pos={"relative"}
        >
          <Box
            zIndex={1}
            bgColor={"black"}
            pos={"absolute"}
            w={"100%"}
            h={"100%"}
            top={0}
            display={isLoading ? "flex" : "none"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Spinner size={"xl"} />
          </Box>

          <Box w={"100%"} h={"53.5vw"} maxH={"700px"}>
            <iframe
              src={link}
              allowFullScreen
              height={"100%"}
              width={"100%"}
              frameBorder="0"
              scrolling="no"
              onLoad={() => setIsLoading(false)}
            />
          </Box>
        </Box>

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
          maxH={"5xl"}
          overflowY={"auto"}
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
