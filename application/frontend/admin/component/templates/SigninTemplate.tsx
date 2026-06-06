import { Box, Center, Heading } from "@chakra-ui/react";
import SigninForm from "@/component/organisms/signin/SigninForm";
import { SIGNIN } from "@/const/pages/SIGNIN";

export default function SigninTemplate() {
  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} borderRadius="lg" shadow="md" w="full" maxW="400px">
        <Heading size="lg" mb={6} textAlign="center">
          {SIGNIN.TEXT.TITLE}
        </Heading>
        <SigninForm />
      </Box>
    </Center>
  );
}
