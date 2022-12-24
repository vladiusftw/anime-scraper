import { Box } from "@chakra-ui/react";

import Header from "../header";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <>
    <Box as="main">{children}</Box>
  </>
);

export default Layout;
