"use client";
import { SimpleGrid, Box, Heading, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { DASHBOARD_CARDS } from "@/const/pages/DASHBOARD";

export default function DashboardCardGrid() {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      {DASHBOARD_CARDS.map((card) => (
        <Link
          key={card.href}
          as={NextLink}
          href={card.href}
          textDecoration="none"
          _hover={{ textDecoration: "none" }}
        >
          <Box
            p={5}
            bg="white"
            borderRadius="lg"
            shadow="sm"
            borderWidth="1px"
            _hover={{ shadow: "md", borderColor: "blue.300" }}
            transition="all 0.2s"
          >
            <Heading size="sm" mb={2}>{card.label}</Heading>
            <Text fontSize="sm" color="gray.600">{card.description}</Text>
          </Box>
        </Link>
      ))}
    </SimpleGrid>
  );
}
