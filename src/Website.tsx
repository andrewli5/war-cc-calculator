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

const COMPS_UNDER_30 = {
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

const COMPS = [
  {
    value: "lava",
    label: "lava hound + headhunter",
    troops: {
      ...COMPS_UNDER_30,
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
      ...COMPS_UNDER_30,
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
      ...COMPS_UNDER_30,
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
};

type TroopAmtsObj = {
  archers?: number;
  headhunters?: number;
  lavas?: number;
  icegolems?: number;
};

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
    const comp = COMPS.find((comp) => comp.value === selectedComp);
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
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder p="md" mb="md">
          <Title order={3} ta="center">
            results
          </Title>
        </Card.Section>
        <Stack align="center">
          {troopAmts.lavas !== 0 && <Text>lava hounds: {troopAmts.lavas}</Text>}
          {troopAmts.icegolems !== 0 && (
            <Text>ice golems: {troopAmts.icegolems}</Text>
          )}
          {troopAmts.superminions !== 0 && (
            <Text>super minions: {troopAmts.superminions}</Text>
          )}
          {troopAmts.witches !== 0 && <Text>witches: {troopAmts.witches}</Text>}

          {troopAmts.babydrags !== 0 && (
            <Text>baby dragons: {troopAmts.babydrags}</Text>
          )}
          {troopAmts.rocketloons !== 0 && (
            <Text>rocket loons: {troopAmts.rocketloons}</Text>
          )}
          {troopAmts.valks !== 0 && <Text>valkyries: {troopAmts.valks}</Text>}
          {troopAmts.headhunters !== 0 && (
            <Text>headhunters: {troopAmts.headhunters}</Text>
          )}
          {troopAmts.wizards !== 0 && <Text>wizards: {troopAmts.wizards}</Text>}
          {troopAmts.archers !== 0 && <Text>archers: {troopAmts.archers}</Text>}
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
        <Text c="grey" size="sm">
          {"(more coming soon!)"}
        </Text>
        <Radio.Group
          name="comp"
          value={selectedComp}
          label="for capacities 30 and above: "
          p="md"
          withAsterisk
          onChange={(event) => setSelectedComp(event)}
        >
          <Stack mt="md">
            {COMPS.map((comp) => (
              <Radio key={comp.value} value={comp.value} label={comp.label} />
            ))}
          </Stack>
        </Radio.Group>
        <HoverCard width={300} position="right" withArrow shadow="md">
          <HoverCard.Target>
            <Button size="compact" variant="subtle">
              {"(?) "} what about cc's under 30?
            </Button>
          </HoverCard.Target>
          <HoverCard.Dropdown ta="center">
            <Text size="sm">
              these options aren't optimal for capacities under 30, so we've
              chosen some default comps for these sizes as follows:{" "}
            </Text>
            <Text size="xs">25: 2 witches, 1 archer</Text>
            <Text size="xs">20: 1 witch, 1 valkyrie</Text>
            <Text size="xs">15: 1 valkyrie, 1 wizard, 3 archers</Text>
            <Text size="xs">10: 1 valkyrie, 2 archers</Text>
          </HoverCard.Dropdown>
        </HoverCard>
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
          {resultsVisible && <ResultsCard />}
        </Stack>
      </Group>
    </Stack>
  );
}
