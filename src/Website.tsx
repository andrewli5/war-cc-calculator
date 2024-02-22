import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Radio,
  HoverCard,
  Center,
  Divider,
  Badge,
  Modal,
} from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { em } from "@mantine/core";

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
  const [distribution, setDistribution] = useState<
    Array<{ size: number; troops: TroopAmtsObj }>
  >([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [totalSelected, setTotalSelected] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [selectedComp, setSelectedComp] = useState("lava");
  const [troopAmts, setTroopAmts] = useState({ ...DEFAULT_TROOP_AMTS });
  const [resultsVisible, setResultsVisible] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const calculateTroops = () => {
    const newTroopAmts = { ...DEFAULT_TROOP_AMTS };
    const newDistribution = [] as Array<{ size: number; troops: TroopAmtsObj }>;
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
          newDistribution.push({
            size: size as unknown as number,
            troops: troopAmtsObj,
          });

          for (const troopType in troopAmtsObj) {
            newTroopAmts[troopType as keyof TroopAmtsObj] +=
              troopAmtsObj[troopType as keyof TroopAmtsObj]!;
          }
        }
      }
    }
    setTroopAmts(newTroopAmts);
    setDistribution(newDistribution);
  };

  const handleSubmitClick = () => {
    calculateTroops();
    setResultsVisible(true);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  function SubmitButton() {
    return (
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
    );
  }

  function SizesCard() {
    return (
      <Card w={350} shadow="sm" padding="xl" radius="md" withBorder>
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
      <Card shadow="sm" padding="lg" radius="md" withBorder w={350}>
        <Card.Section withBorder p="md" mb="md">
          <Title order={3} ta="center">
            results
          </Title>
        </Card.Section>
        <Center>
          <Stack align="center" gap="xs">
            {TROOP_NAMES.map((troop) => {
              if (troopAmts[troop.varName as keyof TroopAmtsObj] !== 0) {
                return (
                  <Text key={troop.varName} ta="left">
                    <Text span fw={600}>
                      {troopAmts[troop.varName as keyof TroopAmtsObj] + " "}
                    </Text>
                    {troop.displayName}
                  </Text>
                );
              }
            })}
            <Button
              variant="gradient"
              mt="sm"
              size="lg"
              onClick={() => {
                open();
              }}
            >
              view cc distribution
            </Button>
          </Stack>
        </Center>
      </Card>
    );
  }

  function troopAmtsObjToString(troops: TroopAmtsObj) {
    let str = "";
    for (const troop in troops) {
      const amt = troops[troop as keyof TroopAmtsObj];
      if (amt !== 0) {
        if (amt === 1) {
          str += `${troops[troop as keyof TroopAmtsObj]} ${troop.slice(0, -1)}, `;
        } else {
          str += `${troops[troop as keyof TroopAmtsObj]} ${troop}, `;
        }
      }
    }
    return str.slice(0, -2);
  }

  function DistributionModal() {
    return (
      <Modal opened={opened} onClose={close} title="cc distribution" size="sm">
        <Stack gap="md" align="center">
          <Text size="sm" ta="center" fw={640}>
            {`total capacity: ${totalSize}`}
          </Text>
          <Card shadow="sm" padding="md" radius="md" withBorder mb="sm">
            {distribution.sort((a, b) => b.size - a.size).map((cc) => {
              return (
                <Text size="sm" ta="left">
                  <Text fw={640} span>{`${cc.size}: `}</Text>
                  {`${troopAmtsObjToString(cc.troops)}`}
                </Text>
              );
            })}
          </Card>
        </Stack>
      </Modal>
    );
  }

  return (
    <>
      {!isMobile && (
        <Stack align="center" m="xl">
          <Title order={1}>⚔️ coc war cc calculator ⚔️</Title>
          <Text c="grey">
            {"what should you train for your clan's war castles?"}
          </Text>
          <Group align="left">
            <SizesCard />
            <Stack w={350}>
              <CompositionCard
                selectedComp={selectedComp}
                setSelectedComp={setSelectedComp}
              />
              <SubmitButton />
            </Stack>
          </Group>
          <Divider my="sm" w="100%" />
          {resultsVisible && <ResultsCard />}
        </Stack>
      )}
      {isMobile && (
        <Stack align="center" m="xl">
          <Title order={3}>⚔️ coc war cc calculator ⚔️</Title>
          <Text c="grey" size="sm">
            {"what should you train for your clan's war castles?"}
          </Text>
          <SizesCard />
          <CompositionCard
            selectedComp={selectedComp}
            setSelectedComp={setSelectedComp}
          />
          <SubmitButton />
          <Divider my="xs" w="100%" />
          {resultsVisible && <ResultsCard />}
        </Stack>
      )}
      <DistributionModal />
    </>
  );
}

interface CompositionCardProps {
  selectedComp: string;
  setSelectedComp: (comp: string) => void;
}

function CompositionCard({
  selectedComp,
  setSelectedComp,
}: CompositionCardProps) {
  console.log("selectedComp", selectedComp);
  return (
    <Card w={350} shadow="sm" padding="lg" radius="md" withBorder ta="center">
      <Card.Section withBorder p="md" mb="md">
        <Title order={3} ta="center">
          select composition
        </Title>
      </Card.Section>
      <Card shadow="sm" radius="md" padding="xs" withBorder ta="center">
        <Radio.Group
          name="compover30"
          value={selectedComp}
          onChange={setSelectedComp}
          label={
            <Text fw={600}>
              for capacities 30+
              <HoverCard width={300} withArrow shadow="md">
                <HoverCard.Target>
                  <Button
                    size="compact-xs"
                    variant="transparent"
                    ml={2}
                    mt={-3}
                  >
                    ?
                  </Button>
                </HoverCard.Target>
                <HoverCard.Dropdown ta="center">
                  <Text size="sm" fw={620} mb="xs">
                    these comps aren't possible {" (or that good) "} for cc's 25
                    and below.{" "}
                    <Text>
                      for these smaller capacities, the calculator will give you
                      these better defaults:
                    </Text>
                  </Text>
                  <Text size="xs">25: 2 witches, 1 archer</Text>
                  <Text size="xs">20: 1 witch, 1 valkyrie</Text>
                  <Text size="xs">15: 1 valkyrie, 1 wizard, 3 archers</Text>
                  <Text size="xs">10: 1 valkyrie, 2 archers</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Text>
          }
          p="md"
        >
          <Stack mt="md" mb="md" gap="xs">
            {COMPS_OVER_30.map((comp) => (
              <Radio
                key={comp.value + comp.label}
                value={comp.value}
                label={comp.label}
              />
            ))}
          </Stack>
        </Radio.Group>
      </Card>
      <Card shadow="sm" radius="md" padding="xs" withBorder ta="center" mt="md">
        <Radio.Group
          name="compallcaps"
          value={selectedComp}
          label={
            <Text fw={600}>
              for all capacities
              <HoverCard width={300} withArrow shadow="md">
                <HoverCard.Target>
                  <Button
                    size="compact-xs"
                    variant="transparent"
                    ml={2}
                    mt={-3.5}
                  >
                    ?
                  </Button>
                </HoverCard.Target>
                <HoverCard.Dropdown ta="center">
                  <Text size="sm" fw={620} mb="xs">
                    these comps are usable for all capacities.
                    <Text>
                      the calculator won't fill with any other options.
                    </Text>
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Text>
          }
          p="md"
          onChange={setSelectedComp}
        >
          <Stack mt="md" gap="xs">
            {COMPS_UNDER_30.map((comp) => (
              <Radio
                key={comp.value + comp.label}
                value={comp.value}
                label={comp.label}
              />
            ))}
          </Stack>
        </Radio.Group>
      </Card>
    </Card>
  );
}

const MetaLabel = (label: string) => (
  <Text size="sm">
    <Badge variant="gradient" mr={3}>
      meta
    </Badge>{" "}
    {label}
  </Text>
);

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
    value: "archer",
    label: "mass archers",
    troops: {
      10: {
        archers: 10,
      },
      15: {
        archers: 15,
      },
      20: {
        archers: 20,
      },
      25: {
        archers: 25,
      },
      30: {
        archers: 30,
      },
      35: {
        archers: 35,
      },
      40: {
        archers: 40,
      },
      45: {
        archers: 45,
      },
      50: {
        archers: 50,
      },
    },
  },
  {
    value: "witch",
    label: "mass witches",
    troops: {
      ...DEFAULT_UNDER_30_COMPS,
      15: {
        witches: 1,
        archers: 3,
      },
      20: {
        witches: 1,
        valks: 1,
      },
      25: {
        witches: 2,
        archers: 1,
      },
      30: {
        witches: 2,
        archers: 6,
      },
      35: {
        witches: 2,
        headhunters: 1,
        archers: 5,
      },
      40: {
        witches: 3,
        archers: 4,
      },
      45: {
        witches: 3,
        headhunters: 1,
        archers: 3,
      },
      50: {
        witches: 4,
        archers: 2,
      },
    },
  },
  {
    value: "drag",
    label: "dragon + loon",
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
    label: MetaLabel("lava + headhunter"),
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
    value: "lavarl",
    label: MetaLabel("lava + rloon"),
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
        rocketloons: 1,
        archers: 2,
      },
      45: {
        lavas: 1,
        rocketloons: 1,
        archers: 7,
      },
      50: {
        lavas: 1,
        rocketloons: 2,
        archers: 4,
      },
    },
  },
  {
    value: "ig",
    label: MetaLabel("mass ice golem"),
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
    value: "igrl",
    label: MetaLabel("ice golem + rloon"),
    troops: {
      ...DEFAULT_UNDER_30_COMPS,
      30: {
        icegolems: 1,
        rocketloons: 1,
        headhunters: 1,
        archers: 1,
      },
      35: {
        icegolems: 1,
        rocketloons: 2,
        archers: 4,
      },
      40: {
        icegolems: 1,
        rocketloons: 2,
        headhunters: 1,
        archers: 3,
      },
      45: {
        icegolems: 1,
        rocketloons: 2,
        headhunters: 2,
        archers: 2,
      },
      50: {
        icegolems: 2,
        rocketloons: 2,
        archers: 4,
      },
    },
  },
  {
    value: "smhh",
    label: MetaLabel("sminion + headhunter"),
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
  {
    value: "smrl",
    label: MetaLabel("sminion + rloon"),
    troops: {
      ...DEFAULT_UNDER_30_COMPS,
      30: {
        superminions: 1,
        rocketloons: 2,
        archers: 2,
      },
      35: {
        superminions: 1,
        rocketloons: 2,
        headhunters: 1,
        archers: 1,
      },
      40: {
        superminions: 2,
        rocketloons: 2,
      },
      45: {
        superminions: 2,
        rocketloons: 2,
        archers: 5,
      },
      50: {
        superminions: 2,
        rocketloons: 2,
        headhunters: 1,
        archers: 4,
      },
    },
  },
  {
    value: "edrag",
    label: "edrag + loon",
    troops: {
      ...DEFAULT_UNDER_30_COMPS,
      30: {
        edrags: 1,
      },
      35: {
        edrags: 1,
        balloons: 1,
      },
      40: {
        edrags: 1,
        balloons: 2,
      },
      45: {
        edrags: 1,
        balloons: 3,
      },
      50: {
        edrags: 1,
        balloons: 4,
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
