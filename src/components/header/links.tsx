import NextLink from "next/link";
import type { MouseEventHandler } from "react";

import { Box, chakra, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

const links = [
  { title: "Home", path: "/" },
  { title: "Profile", path: "/profile" },
];

interface Props {
  onClick: MouseEventHandler<HTMLAnchorElement> | undefined;
}

const Links = ({ onClick }: Props) => {
  const router = useRouter();
  const handleClickScroll = (link: any) => {
    if (window.location.pathname != "/") window.location.href = "/";
    const element = document.getElementById(link);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      {links.map((link) => (
        <Link href={link.path}>
          <Box
            as="li"
            listStyleType="none"
            px={{ base: "4", lg: "8" }}
            py={{ base: "3" }}
            mx={1}
            key={link.title}
            bgColor={router.pathname == link.path ? "red" : "transparent"}
            color={{
              base: "black",
              lg: router.pathname == link.path ? "black" : "white",
            }}
            borderRadius={{ base: "xl", lg: "3xl" }}
            _hover={{ base: {}, lg: { bgColor: "white", color: "black" } }}
            _focus={{}}
            _active={{}}
          >
            <Text>{link.title}</Text>
          </Box>
        </Link>
      ))}
    </>
  );
};

export default Links;
