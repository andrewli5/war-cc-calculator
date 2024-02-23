import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  HoverCard,
  Center,
  Divider,
  Badge,
  Modal,
  Checkbox,
  Radio,
} from "@mantine/core";
import { useMediaQuery, useDisclosure, randomId } from "@mantine/hooks";
import { useState } from "react";
import { em } from "@mantine/core";
import {
  TROOP_NAMES,
  TROOP_TO_ICON,
  DEFAULT_TROOP_AMTS,
  DEFAULT_CASTLE_SIZES,
  COMPS_OVER_30,
  COMPS_UNDER_30,
  CastleSizes,
  TroopAmts,
  TroopComp,
  TroopDistribution,
} from "./constants";

export default function Website() {
  const [castles, setCastles] = useState<CastleSizes>(DEFAULT_CASTLE_SIZES);
  const [distribution, setDistribution] = useState<TroopDistribution[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [totalSelected, setTotalSelected] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [comps, setComps] = useState<string[]>(["lavahh"]);
  const [compsUnder30, setCompsUnder30] = useState<string[]>([]);
  const [fillOption, setFillOption] = useState("default");
  const [troopAmts, setTroopAmts] = useState(DEFAULT_TROOP_AMTS);
  const [resultsVisible, setResultsVisible] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  function getCompByCastleSize(castleSize: number, numCastles: number) {
    if (castleSize < 30 && numCastles > 0) {
      if (fillOption === "default") {
        return COMPS_UNDER_30.find((comp) => comp.value === "witch")!.troops;
      } else {
        const compId =
          compsUnder30[Math.floor(Math.random() * compsUnder30.length)];
        return COMPS_UNDER_30.find((comp) => comp.value === compId)!.troops;
      }
    } else {
      const compId = comps[Math.floor(Math.random() * comps.length)];
      console.log(compId);
      return COMPS_OVER_30.find((comp) => comp.value === compId)!.troops;
    }
  }

  const calculateTroops = () => {
    const newTroopAmts = { ...DEFAULT_TROOP_AMTS };
    const newDistribution = [] as TroopDistribution[];

    for (const castleSize in castles) {
      const numCastles = castles[castleSize];
      for (let i = numCastles; i > 0; i--) {
        const troops = getCompByCastleSize(+castleSize, numCastles);
        const troopAmts = troops[
          castleSize as unknown as keyof typeof troops
        ] as TroopAmts;
        newDistribution.push({
          size: +castleSize,
          troops: troopAmts,
        });

        for (const troopType in troopAmts) {
          newTroopAmts[troopType as keyof TroopAmts] +=
            troopAmts[troopType as keyof TroopAmts]!;
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
        disabled={
          totalSelected === 0 ||
          (comps.length === 0 && compsUnder30.length === 0)
        }
        fullWidth
        variant="gradient"
        onClick={() => handleSubmitClick()}
      >
        {totalSelected === 0
          ? "no ccs selected"
          : comps.length === 0 && compsUnder30.length === 0
            ? "no comps selected"
            : "calculate!"}
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
          {Object.keys(castles)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((obj) => (
              <Group key={obj}>
                <Title order={4} key={obj}>
                  {obj}
                </Title>
                <Button
                  radius="md"
                  color="dark.3"
                  disabled={castles[obj] === 0}
                  onClick={() => {
                    setCastles({
                      ...castles,
                      [obj]: castles[obj] - 1,
                    });
                    setTotalSelected(totalSelected - 1);
                    setTotalSize(totalSize - parseInt(obj));
                  }}
                >
                  -
                </Button>
                <Text>{castles[obj]}</Text>
                <Button
                  radius="md"
                  variant="gradient"
                  disabled={totalSelected === 50}
                  onClick={() => {
                    setCastles({
                      ...castles,
                      [obj]: castles[obj] + 1,
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
              if (troopAmts[troop.varName as keyof TroopAmts] !== 0) {
                return (
                  <Text key={troop.varName} ta="left">
                    <Text span fw={600}>
                      {troopAmts[troop.varName as keyof TroopAmts] + " "}
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

  function TroopAmtsLabel(troops: TroopAmts) {
    return (
      <Group gap="xs" align="center">
        {Object.keys(troops).map((troop) => {
          return (
            <div
              key={troop}
              style={{ display: "flex", flexDirection: "row", gap: "5px" }}
            >
              {`${troops[troop as keyof TroopAmts]}x `}
              <img
                src={TROOP_TO_ICON[troop as keyof typeof TROOP_TO_ICON]}
                width="30"
                height="30"
                style={{
                  objectFit: "cover",
                  borderRadius: 5,
                  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
          );
        })}
      </Group>
    );
  }

  function DistributionModal() {
    return (
      <Modal opened={opened} onClose={close} title="cc distribution" size="sm">
        <Stack gap="md" align="center">
          <Text size="sm" ta="center" fw={640}>
            {`total capacity: ${totalSize}`}
          </Text>
          <Card shadow="sm" padding="md" radius="md" withBorder mb="sm">
            <Stack gap="xs">
              {distribution
                .sort((a, b) => b.size - a.size)
                .map((cc) => {
                  return (
                    <Group ta="center" key={randomId()}>
                      <Text fw={640} span>{`${cc.size}: `}</Text>
                      {TroopAmtsLabel(cc.troops)}
                    </Group>
                  );
                })}
            </Stack>
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
                selectedComps={comps}
                setSelectedComps={setComps}
                selectedCompsUnder30={compsUnder30}
                setSelectedCompsUnder30={setCompsUnder30}
                fillOption={fillOption}
                setFillOption={setFillOption}
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
            selectedComps={comps}
            setSelectedComps={setComps}
            selectedCompsUnder30={compsUnder30}
            setSelectedCompsUnder30={setCompsUnder30}
            fillOption={fillOption}
            setFillOption={setFillOption}
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
  selectedComps: string[];
  setSelectedComps: (comp: string[]) => void;
  selectedCompsUnder30: string[];
  setSelectedCompsUnder30: (comp: string[]) => void;
  fillOption: string;
  setFillOption: (fill: string) => void;
}

function CompositionCard({
  selectedComps,
  setSelectedComps,
  selectedCompsUnder30,
  setSelectedCompsUnder30,
  fillOption,
  setFillOption,
}: CompositionCardProps) {
  function getCompLabel(comp: TroopComp) {
    return (
      <Group gap="xs">
        {comp.meta && <Badge variant="gradient">meta</Badge>}
        {comp.icons.map((icon) => (
          <img
            key={icon}
            src={icon}
            width="30"
            height="30"
            style={{
              objectFit: "cover",
              borderRadius: 5,
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          />
        ))}
        <Text size="sm">{comp.label}</Text>
      </Group>
    );
  }

  return (
    <Card w={350} shadow="sm" padding="lg" radius="md" withBorder ta="center">
      <Card.Section withBorder p="md" mb="md">
        <Title order={3} ta="center">
          select composition
          <HoverCard width={300} withArrow shadow="md" position="right">
            <HoverCard.Target>
              <Button size="compact-xs" variant="transparent" ml={2} mt={-2}>
                ?
              </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown ta="center">
              <Text size="md">
                if multiple comps are selected, the calculator will randomize
                them across castles.
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Title>
      </Card.Section>

      <Card shadow="sm" radius="md" padding="xs" withBorder ta="center">
        <Checkbox.Group
          value={selectedComps}
          p="md"
          label={<Text fw={600}>for capacities 30+</Text>}
          onChange={setSelectedComps}
        >
          <Stack mt="md" mb="md" gap="xs">
            {COMPS_OVER_30.map((comp) => (
              <Checkbox
                key={randomId()}
                value={comp.value}
                label={getCompLabel(comp)}
              />
            ))}
          </Stack>
        </Checkbox.Group>
        <Center>
          <Radio.Group
            name="fill-options"
            label={<Text fw={600}>for smaller capacities</Text>}
            value={fillOption}
            onChange={setFillOption}
          >
            <Stack gap="xs" mt="xs">
              <Radio
                label={
                  <Text size="sm" ta="left">
                    {"fill smaller castles with best defaults"}
                  </Text>
                }
                value="default"
              />
              <Radio
                label={<Text size="sm">customize fill...</Text>}
                value="custom"
              />
            </Stack>
          </Radio.Group>
        </Center>
        {fillOption === "custom" && (
          <Checkbox.Group
            value={selectedCompsUnder30}
            p="md"
            onChange={setSelectedCompsUnder30}
          >
            <Stack gap="xs">
              {COMPS_UNDER_30.map((comp) => (
                <Checkbox
                  key={randomId()}
                  value={comp.value}
                  label={getCompLabel(comp)}
                />
              ))}
            </Stack>
          </Checkbox.Group>
        )}
      </Card>
    </Card>
  );
}
