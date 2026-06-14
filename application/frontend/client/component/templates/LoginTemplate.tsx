import { Box, Center, Heading } from "@chakra-ui/react";
import LoginForm from "@/component/organisms/login/LoginForm";
import { LOGIN } from "@/const/pages/LOGIN";

export default function LoginTemplate() {
  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} borderRadius="lg" shadow="md" w="full" maxW="400px">
        <Heading size="lg" mb={6} textAlign="center">
          {LOGIN.TEXT.TITLE}
        </Heading>
        <LoginForm />
      </Box>
    </Center>
  );
}
