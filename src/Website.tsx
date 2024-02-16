import { Button, Card, Group, Stack, Text, Title, Radio } from "@mantine/core";
import { useEffect, useState } from "react";

const COMPS = [
  {
    value: "lava",
    label: "lava hound + headhunter",
    troops: {
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
    minSize: 15,
  },
];

const DEFAULT_TROOP_AMTS = {
  archers: 0,
  headhunters: 0,
  lavas: 0,
  icegolems: 0,
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
  const [selectedComp, setSelectedComp] = useState<string>("lava");
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
          {troopAmts.headhunters !== 0 && (
            <Text>headhunters: {troopAmts.headhunters}</Text>
          )}
          {troopAmts.archers !== 0 && <Text>archers: {troopAmts.archers}</Text>}
        </Stack>
      </Card>
    );
  }

  function CompositionCard() {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder p="md" mb="md">
          <Title order={3} ta="center">
            select composition
          </Title>
        </Card.Section>
        <Radio.Group
          name="comp"
          value={selectedComp}
          p="md"
          onChange={(event) => setSelectedComp(event)}
        >
          {COMPS.map((comp) => (
            <Radio
              key={comp.value}
              value={comp.value}
              label={comp.label}
              mb="md"
            />
          ))}
        </Radio.Group>
      </Card>
    );
  }

  return (
    <Stack align="center" m="xl">
      <Title order={1}>⚔️ coc war cc calculator ⚔️</Title>
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
