import "@mantine/core/styles.css";
import { MantineProvider, Stack } from "@mantine/core";
import Website from "./Website";
import { theme } from "./theme";
import Footer from "./Footer";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Stack align="center">
        <Website />
        <Footer />
      </Stack>
    </MantineProvider>
  );
}
