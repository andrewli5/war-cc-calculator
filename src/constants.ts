import babyDragIcon from "/assets/troopIcons/babydrag.webp";
import balloonIcon from "/assets/troopIcons/loon.webp";
import dragIcon from "/assets/troopIcons/drag.webp";
import edragIcon from "/assets/troopIcons/edrag.webp";
import headhunterIcon from "/assets/troopIcons/hh.webp";
import iceGolemIcon from "/assets/troopIcons/icegolem.webp";
import lavaIcon from "/assets/troopIcons/lava.webp";
import rocketLoonIcon from "/assets/troopIcons/rloon.webp";
import superDragIcon from "/assets/troopIcons/superdrag.webp";
import iceHoundIcon from "/assets/troopIcons/icehound.webp";
import superMinionIcon from "/assets/troopIcons/sminion.webp";
import valkIcon from "/assets/troopIcons/valk.webp";
import witchIcon from "/assets/troopIcons/witch.webp";
import wizardIcon from "/assets/troopIcons/wizard.webp";
import archerIcon from "/assets/troopIcons/archer.webp";

export {
  TROOP_TO_ICON,
  COMPS_UNDER_30,
  COMPS_OVER_30,
  DEFAULT_TROOP_AMTS,
  DEFAULT_CASTLE_SIZES,
  TROOP_NAMES,
};

export type { CastleSizes, TroopAmts, TroopComp, TroopDistribution };

type CastleSizes = { [id: string]: number };

type TroopAmts = Partial<typeof DEFAULT_TROOP_AMTS>;

type TroopComp = {
  value: string;
  label: string;
  icons: Array<string>;
  meta: boolean;
  troops: {
    [size: number]: TroopAmts;
  };
};

type TroopDistribution = {
  size: number;
  troops: TroopAmts;
};

const TROOP_TO_ICON = {
  archers: archerIcon,
  headhunters: headhunterIcon,
  lavas: lavaIcon,
  icegolems: iceGolemIcon,
  superminions: superMinionIcon,
  rocketloons: rocketLoonIcon,
  witches: witchIcon,
  valks: valkIcon,
  wizards: wizardIcon,
  babydrags: babyDragIcon,
  drags: dragIcon,
  balloons: balloonIcon,
  superdrags: superDragIcon,
  superlavas: iceHoundIcon,
  edrags: edragIcon,
};

const COMPS_UNDER_30 = [
  {
    value: "witch",
    label: "w/v/w",
    icons: [witchIcon, valkIcon, wizardIcon],
    meta: true,
    troops: {
      25: {
        witches: 1,
        valks: 1,
        wizards: 1,
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
    },
  },
  {
    value: "drag",
    icons: [dragIcon, balloonIcon],
    label: "drag + loon",
    meta: false,
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
    },
  },
  {
    value: "loon",
    label: "mass loon",
    meta: false,
    icons: [balloonIcon],
    troops: {
      10: {
        balloons: 2,
      },
      15: {
        balloons: 3,
      },
      20: {
        balloons: 4,
      },
      25: {
        balloons: 5,
      },
    },
  },
  {
    value: "archer",
    label: "mass archer",
    meta: false,
    icons: [archerIcon],
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
    },
  },
];

const COMPS_OVER_30 = [
  {
    value: "ig",
    icons: [iceGolemIcon],
    label: "mass ig",
    meta: true,
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
  },
  {
    value: "igwitch",
    icons: [iceGolemIcon, witchIcon],
    label: "ig + witch",
    meta: true,
    troops: {
      30: {
        icegolems: 1,
        witches: 1,
        archers: 3,
      },
      35: {
        icegolems: 1,
        witches: 1,
        headhunters: 1,
        archers: 2,
      },
      40: {
        icegolems: 1,
        witches: 1,
        headhunters: 2,
        archers: 1,
      },
      45: {
        icegolems: 1,
        witches: 2,
        archers: 6,
      },
      50: {
        icegolems: 1,
        witches: 2,
        headhunters: 1,
        archers: 5,
      },
    },
  },
  {
    value: "lavahh",
    icons: [lavaIcon, headhunterIcon],
    label: "lava + hh",
    meta: true,
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
  /*
  {
    value: "lavarl",
    icons: [lavaIcon, rocketLoonIcon],
    label: "lava + rloon",
    meta: true,
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
  },*/
  
  {
    value: "igrl",
    icons: [iceGolemIcon, rocketLoonIcon],
    label: "ig + rloon",
    meta: true,
    troops: {
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
    icons: [superMinionIcon, headhunterIcon],
    label: "sm + hh",
    meta: true,
    troops: {
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
    icons: [superMinionIcon, rocketLoonIcon],
    label: "sm/rloon",
    meta: true,
    troops: {
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
    icons: [edragIcon, balloonIcon],
    label: "edrag + loon",
    meta: false,
    troops: {
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
  {
    value: "drag",
    icons: [dragIcon, balloonIcon],
    label: "drag + loon",
    meta: false,
    troops: {
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
  {
    value: "witch",
    icons: [witchIcon],
    label: "mass witch",
    meta: false,
    troops: {
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
    value: "archer",
    label: "mass archer",
    meta: false,
    icons: [archerIcon],
    troops: {
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

const DEFAULT_CASTLE_SIZES = {
  "50": 0,
  "45": 0,
  "40": 0,
  "35": 0,
  "30": 0,
  "25": 0,
  "20": 0,
  "15": 0,
  "10": 0,
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
