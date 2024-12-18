import { Center, Loader } from '@mantine/core';

export default function Loading() {
  return (
    <Center w="100%" h="100dvh">
      <Loader size={30} />
    </Center>
  );
}
