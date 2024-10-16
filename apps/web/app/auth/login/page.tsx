import { AuthenticationForm } from "@/components/auth/login/form";
import { Center, Flex } from "@mantine/core";

export default function LoginPage() {
    return <Flex

        h={"100dvh"}
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
    >
        <AuthenticationForm />
    </Flex>;
}