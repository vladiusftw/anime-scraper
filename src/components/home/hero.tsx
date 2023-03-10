import {
  Box,
  Container,
  Grid,
  GridItem,
  Input,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Item = {
  endpointLink: string;
  img: string;
  name: string;
  released: string;
};

const Hero = () => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState<Array<Item>>([]);
  const fetchItems = async () => {
    console.log("test");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/animeSearch?search=${value}`
    );
    const temp: Array<Item> = await response.json();
    setItems([...temp]);
  };
  useEffect(() => {
    async function getHome() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/animeSearch?search=${value}`
      );
      const temp: Array<Item> = await response.json();
      setItems([...temp]);
    }
    getHome();
  }, []);
  return (
    <Box>
      <Box pos={"fixed"} w={"100%"} my={32} zIndex={20}>
        <Container maxW={"7xl"}>
          <Input
            placeholder={"Search Anime..."}
            onChange={(val) => setValue(val.target.value)}
            onKeyPress={(e) => {
              if (e.key == "Enter") fetchItems();
            }}
            bgColor={"black"}
            w={"100%"}
          />
        </Container>
      </Box>

      <Container maxW={"7xl"} py={32}>
        <Grid
          templateColumns={[
            "repeat(1,1fr)",
            "repeat(2,1fr)",
            "repeat(3,1fr)",
            "repeat(4,1fr)",
            "repeat(5,1fr)",
          ]}
          rowGap={10}
          columnGap={8}
          mt={20}
        >
          {items.map((item: Item, index: any) => {
            const getName = () => {
              const temp = item.name.toString();
              return temp
                .toLowerCase()
                .replaceAll(/[^a-zA-Z\s0-9\-]/g, "")
                .replaceAll(" ", "-");
            };
            return (
              <GridItem h={"100%"} key={index}>
                <Link
                  href={{
                    pathname: `/watch/[name]`,
                    query: { img: item.img, animeName: item.name },
                  }}
                  as={`/watch/${getName()}`}
                >
                  <VStack
                    bgColor={"rgba(36, 52, 83, 0.5)"}
                    py={6}
                    borderRadius={"3xl"}
                    h={"100%"}
                  >
                    <Image src={item.img} alt={""} w={160} h={240} />
                    <Text size={"xs"} textAlign={"center"}>
                      {item.name}
                    </Text>
                    <Text size={"xs"}>{item.released}</Text>
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

export default Hero;
