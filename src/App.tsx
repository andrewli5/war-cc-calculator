import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Website from "./Website";
import { theme } from "./theme";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
        <Website />
    </MantineProvider>
  );
}
