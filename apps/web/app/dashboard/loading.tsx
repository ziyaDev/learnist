import { Box, Loader, LoadingOverlay } from "@mantine/core";

export default function Loading() {
   return <Box pos="relative">
      <LoadingOverlay visible zIndex={1000} />
   </Box>
}