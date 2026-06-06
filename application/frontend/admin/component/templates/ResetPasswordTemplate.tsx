import { Box, Center, Heading } from "@chakra-ui/react";
import ResetPasswordForm from "@/component/organisms/resetPassword/ResetPasswordForm";
import { RESET_PASSWORD } from "@/const/pages/RESET_PASSWORD";

export default function ResetPasswordTemplate() {
  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} borderRadius="lg" shadow="md" w="full" maxW="400px">
        <Heading size="lg" mb={6} textAlign="center">
          {RESET_PASSWORD.TEXT.TITLE}
        </Heading>
        <ResetPasswordForm />
      </Box>
    </Center>
  );
}
