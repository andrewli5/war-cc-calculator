import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Radio,
  HoverCard,
} from "@mantine/core";
import { useState } from "react";

const DEFAULT_UNDER_30_COMPS = {
  25: {
    witches: 2,
    archers: 1,
  },
  20: {
    witches: 1,
    valks: 1,
  },
  15: {
    valks: 1,
    wizards: 1,
    archers: 3,
  },
  10: {
    valks: 1,
    archers: 2,
  },
};

const COMPS_UNDER_30 = [
  {
    value: "drag",
    label: "dragon + balloon",
    troops: {
      10: {
        balloons: 2,
      },
      15: {
        balloons: 3,
      },
      20: {
        drags: 1,
      },
      25: {
        drags: 1,
        balloons: 1,
      },
      30: {
        drags: 1,
        balloons: 2,
      },
      35: {
        drags: 1,
        balloons: 3,
      },
      40: {
        drags: 2,
      },
      45: {
        drags: 2,
        balloons: 1,
      },
      50: {
        drags: 2,
        balloons: 2,
      },
    },
  },
];

const COMPS_OVER_30 = [
  {
    value: "lava",
    label: "lava hound + headhunter",
    troops: {
      ...DEFAULT_UNDER_30_COMPS,
      30: {
        lavas: 1,
      },
      35: {
        lavas: 1,
        archers: 5,
      },
      40: {
        lavas: 1,
        headhunters: 1,
        archers: 4,
      },
      45: {
        lavas: 1,
        headhunters: 2,
        archers: 3,
      },
      50: {
        lavas: 1,
        headhunters: 3,
        archers: 2,
      },
    },
  },
  {
    value: "ig",
    label: "ice golem stall",
    troops: {
      ...DEFAULT_UNDER_30_COMPS,
      30: {
        icegolems: 2,
      },
      35: {
        icegolems: 2,
        archers: 5,
      },
      40: {
        icegolems: 2,
        headhunters: 1,
        archers: 4,
      },
      45: {
        icegolems: 3,
      },
      50: {
        icegolems: 3,
        archers: 5,
      },
    },
  },
  {
    value: "sm",
    label: "super minion + headhunter",
    troops: {
      ...DEFAULT_UNDER_30_COMPS,
      30: {
        superminions: 2,
        headhunters: 1,
      },
      35: {
        superminions: 2,
        headhunters: 1,
        archers: 5,
      },
      40: {
        superminions: 3,
        archers: 4,
      },
      45: {
        superminions: 3,
        headhunters: 1,
        archers: 3,
      },
      50: {
        superminions: 3,
        headhunters: 2,
        archers: 2,
      },
    },
  },
];

const DEFAULT_TROOP_AMTS = {
  archers: 0,
  headhunters: 0,
  lavas: 0,
  icegolems: 0,
  superminions: 0,
  rocketloons: 0,
  witches: 0,
  valks: 0,
  wizards: 0,
  babydrags: 0,
  drags: 0,
  balloons: 0,
  superdrags: 0,
  superlavas: 0,
  edrags: 0,
};

const TROOP_NAMES = [
  { varName: "superdrags", displayName: "super dragons" },
  { varName: "superlavas", displayName: "ice hounds" },
  { varName: "edrags", displayName: "electro dragons" },
  { varName: "lavas", displayName: "lava hounds" },
  { varName: "drags", displayName: "dragons" },
  { varName: "icegolems", displayName: "ice golems" },
  { varName: "superminions", displayName: "super minions" },
  { varName: "witches", displayName: "witches" },
  { varName: "babydrags", displayName: "baby dragons" },
  { varName: "rocketloons", displayName: "rocket loons" },
  { varName: "valks", displayName: "valkyries" },
  { varName: "headhunters", displayName: "headhunters" },
  { varName: "balloons", displayName: "balloons" },
  { varName: "wizards", displayName: "wizards" },
  { varName: "archers", displayName: "archers" },
];

type TroopAmtsObj = typeof DEFAULT_TROOP_AMTS;

export default function Website() {
  const [clanCastleCounts, setClanCastleCounts] = useState<{
    [id: string]: number;
  }>({
    "50": 0,
    "45": 0,
    "40": 0,
    "35": 0,
    "30": 0,
    "25": 0,
    "20": 0,
    "15": 0,
    "10": 0,
  });
  const [totalSelected, setTotalSelected] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [selectedComp, setSelectedComp] = useState("lava");
  const [troopAmts, setTroopAmts] = useState({ ...DEFAULT_TROOP_AMTS });
  const [resultsVisible, setResultsVisible] = useState(false);

  const calculateTroops = () => {
    const newTroopAmts = { ...DEFAULT_TROOP_AMTS };
    const comp =
      COMPS_OVER_30.find((comp) => comp.value === selectedComp) ||
      COMPS_UNDER_30.find((comp) => comp.value === selectedComp);
    for (const size in clanCastleCounts) {
      const clanCastleCount = clanCastleCounts[size];
      for (let i = clanCastleCount; i > 0; i--) {
        if (comp) {
          const troopAmtsObj = comp.troops[
            size as unknown as keyof typeof comp.troops
          ] as TroopAmtsObj;
          for (const troopType in troopAmtsObj) {
            newTroopAmts[troopType as keyof TroopAmtsObj] +=
              troopAmtsObj[troopType as keyof TroopAmtsObj]!;
          }
        }
      }
    }
    setTroopAmts(newTroopAmts);
  };

  const handleSubmitClick = () => {
    calculateTroops();
    setResultsVisible(true);
  };

  function SubmitCard() {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack align="center">
          <Button
            size="xl"
            radius="md"
            disabled={totalSelected === 0}
            fullWidth
            variant="gradient"
            onClick={() => handleSubmitClick()}
          >
            {totalSelected === 0 ? "no ccs selected" : "calculate!"}
          </Button>
        </Stack>
      </Card>
    );
  }

  function SizesCard() {
    return (
      <Card w="300px" shadow="sm" padding="xl" radius="md" withBorder>
        <Card.Section withBorder p="md" mb="md">
          <Title order={3} ta="center">
            input clan castle sizes
          </Title>
        </Card.Section>
        <Stack align="center">
          <Title order={4}>total selected: {totalSelected}</Title>
          {Object.keys(clanCastleCounts)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((obj) => (
              <Group key={obj}>
                <Title order={4} key={obj}>
                  {obj}
                </Title>
                <Button
                  radius="md"
                  color="darkred"
                  disabled={clanCastleCounts[obj] === 0}
                  onClick={() => {
                    setClanCastleCounts({
                      ...clanCastleCounts,
                      [obj]: clanCastleCounts[obj] - 1,
                    });
                    setTotalSelected(totalSelected - 1);
                    setTotalSize(totalSize - parseInt(obj));
                  }}
                >
                  -
                </Button>
                <Text>{clanCastleCounts[obj]}</Text>
                <Button
                  radius="md"
                  color="darkgreen"
                  disabled={totalSelected === 50}
                  onClick={() => {
                    setClanCastleCounts({
                      ...clanCastleCounts,
                      [obj]: clanCastleCounts[obj] + 1,
                    });
                    setTotalSelected(totalSelected + 1);
                    setTotalSize(totalSize + parseInt(obj));
                  }}
                >
                  +
                </Button>
              </Group>
            ))}
        </Stack>
      </Card>
    );
  }

  function ResultsCard() {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder w={200}>
        <Card.Section withBorder p="md" mb="md">
          <Title order={3} ta="center">
            results
          </Title>
        </Card.Section>
        <Stack align="center" gap="xs">
          {TROOP_NAMES.map((troop) => {
            if (troopAmts[troop.varName as keyof TroopAmtsObj] !== 0) {
              return (
                <Text key={troop.varName}>
                  {troop.displayName}:{" "}
                  {troopAmts[troop.varName as keyof TroopAmtsObj]}
                </Text>
              );
            }
          })}
        </Stack>
      </Card>
    );
  }

  function CompositionCard() {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder ta="center">
        <Card.Section withBorder p="md" mb="md">
          <Title order={3} ta="center">
            select composition
          </Title>
        </Card.Section>
        <Text c="grey" size="sm" mb="md">
          {"(more coming soon!)"}
        </Text>
        <Card shadow="sm" radius="md" padding="xs" withBorder ta="center">
          <Radio.Group
            name="comp"
            value={selectedComp}
            label={<Text fw={600}> for capacities 30+ </Text>}
            p="md"
            onChange={(event) => setSelectedComp(event)}
          >
            <Stack mt="md" mb="md">
              {COMPS_OVER_30.map((comp) => (
                <Radio key={comp.value} value={comp.value} label={comp.label} />
              ))}
            </Stack>
            <HoverCard width={300} position="right" withArrow shadow="md">
              <HoverCard.Target>
                <Button size="compact-xs" variant="subtle">
                  {"what about cc's 25 and below?"}
                </Button>
              </HoverCard.Target>
              <HoverCard.Dropdown ta="center">
                <Text size="sm" fw={620} mb="xs">
                  these options aren't optimal for cc's 25 and below. i've
                  chosen some defaults:
                </Text>
                <Text size="xs">25: 2 witches, 1 archer</Text>
                <Text size="xs">20: 1 witch, 1 valkyrie</Text>
                <Text size="xs">15: 1 valkyrie, 1 wizard, 3 archers</Text>
                <Text size="xs">10: 1 valkyrie, 2 archers</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Radio.Group>
        </Card>
        <Card
          shadow="sm"
          radius="md"
          padding="xs"
          withBorder
          ta="center"
          mt="md"
        >
          <Radio.Group
            name="comp"
            value={selectedComp}
            label={<Text fw={600}> for all capacities</Text>}
            p="md"
            onChange={(event) => setSelectedComp(event)}
          >
            <Stack mt="md">
              {COMPS_UNDER_30.map((comp) => (
                <Radio key={comp.value} value={comp.value} label={comp.label} />
              ))}
            </Stack>
          </Radio.Group>
        </Card>
      </Card>
    );
  }

  return (
    <Stack align="center" m="xl">
      <Title order={1}>⚔️ coc war cc calculator ⚔️</Title>
      <Text>
        {"made by grader :)"}{" "}
        <Text span c="grey">
          {"#LLCLVJR8"}
        </Text>
      </Text>
      <Group>
        <SizesCard />
        <Stack w="300px">
          <CompositionCard />
          <SubmitCard />
        </Stack>
        {resultsVisible && <ResultsCard />}
      </Group>
    </Stack>
  );
}
