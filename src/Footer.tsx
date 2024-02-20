import { ActionIcon, Stack, Text } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

const CLASH_OF_STATS_LINK =
  "https://www.clashofstats.com/players/grader-LLCLVJR8/summary";
const GITHUB_LINK = "https://github.com/andrewli5/war-cc-calculator";

export default function Footer() {
  return (
    <footer>
      <Stack align="center" gap="xs" mb="lg">
        <Text mb="sm">
          {"made by  "}
          <Text span component="a" c="lightblue" href={CLASH_OF_STATS_LINK}>
            grader
          </Text>{" "}
          {":)"}
        </Text>
        <ActionIcon
          component="a"
          href={GITHUB_LINK}
          variant="transparent"
          c="lightgrey"
        >
          <IconBrandGithub />
        </ActionIcon>
      </Stack>
    </footer>
  );
}
