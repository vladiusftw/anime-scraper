import { Box, Container, Input } from "@chakra-ui/react";
import Logo from "../logo";
import Navbar from "./navbar";

const Header = () => (
  <Box
    color="white"
    fontSize="18px"
    pos={"fixed"}
    w={"100%"}
    zIndex={9}
    py={[8]}
    top={0}
    bgColor={"black"}
  >
    <Container maxW={"7xl"}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mx="auto"
        h="4rem"
      >
        <Logo />
        <Navbar />
      </Box>
    </Container>
  </Box>
);

export default Header;
