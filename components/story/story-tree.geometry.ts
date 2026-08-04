import seedrandom from 'seedrandom';

export interface StoryTreeStory {
  id: string;
  descendentsCount: number;
  childrenCount: number;
  depth: number;
  likesCount: number;
  commentsCount: number;
  root?: StoryTreeStory;
}

export const LEAF_SHAPES = ['diamond', 'circle', 'triangle', 'plus', 'hexagon', 'star'] as const;
export type LeafShape = (typeof LEAF_SHAPES)[number];

export interface PaletteColor {
  name: string;
  hue: number;
  saturation: number;
}

export const COLOR_PALETTE: PaletteColor[] = [
  { name: 'coral', hue: 6, saturation: 68 },
  { name: 'amber', hue: 36, saturation: 75 },
  { name: 'gold', hue: 48, saturation: 70 },
  { name: 'sage', hue: 100, saturation: 32 },
  { name: 'moss', hue: 130, saturation: 38 },
  { name: 'teal', hue: 174, saturation: 42 },
  { name: 'seafoam', hue: 160, saturation: 45 },
  { name: 'sky', hue: 200, saturation: 55 },
  { name: 'azure', hue: 210, saturation: 60 },
  { name: 'cobalt', hue: 225, saturation: 55 },
  { name: 'violet', hue: 262, saturation: 42 },
  { name: 'lavender', hue: 275, saturation: 35 },
  { name: 'magenta', hue: 300, saturation: 50 },
  { name: 'rose', hue: 335, saturation: 52 },
  { name: 'crimson', hue: 350, saturation: 60 },
  { name: 'ember', hue: 18, saturation: 62 },
  { name: 'rust', hue: 14, saturation: 55 },
  { name: 'chartreuse', hue: 75, saturation: 55 },
];

export interface LeafSpec {
  fraction: number;
  size: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export interface BranchNode {
  level: number;
  angleSlot: number;
  jitter: number;
  lengthRatio: number;
  phase: number;
  leaves: LeafSpec[];
  children: BranchNode[];
}

export interface TreeGeometry {
  levels: number;
  branchFactor: number;
  heightScale: number;
  receptionNorm: number;
  shape: LeafShape;
  color: PaletteColor;
  canopy: BranchNode;
}

const MIN_LEVELS = 3;
const MAX_LEVELS = 7;
const ANGLE_SPREAD = 0.95;
// leaves only grow on the outermost three tiers of the canopy (this constant
// plus the leaf level itself), sampled along each segment rather than only
// at their tip, so a well-loved story reads as genuinely full rather than
// dotted at the branch ends
const FOLIAGE_ANCHOR_LEVELS_FROM_TIP = 2;
const FOLIAGE_ANCHOR_FRACTIONS = [0.4, 0.7, 1];

function buildBranch(
  structureRand: () => number,
  foliageRand: () => number,
  level: number,
  levels: number,
  branchFactor: number,
  foliageDensity: number
): BranchNode {
  const node: BranchNode = {
    level,
    angleSlot: 0,
    jitter: (structureRand() - 0.5) * ANGLE_SPREAD * 0.5,
    lengthRatio: level === 0 ? 1 : 0.82 * (0.85 + structureRand() * 0.3),
    phase: structureRand() * Math.PI * 2,
    leaves: [],
    children: [],
  };

  if (level >= levels - FOLIAGE_ANCHOR_LEVELS_FROM_TIP) {
    for (const fraction of FOLIAGE_ANCHOR_FRACTIONS) {
      const guaranteed = foliageDensity >= 1;
      if (!guaranteed && foliageRand() >= foliageDensity) continue;
      const leafCount = guaranteed && foliageRand() < foliageDensity - 1 ? 2 : 1;
      for (let i = 0; i < leafCount; i++) {
        node.leaves.push({
          fraction,
          size: 2 + foliageRand() * 4,
          rotation: foliageRand() * Math.PI,
          offsetX: (foliageRand() - 0.5) * 10,
          offsetY: (foliageRand() - 0.5) * 10,
        });
      }
    }
  }

  if (level >= levels) return node;

  const branchCount = level === 0 ? 1 : branchFactor;
  for (let i = 0; i < branchCount; i++) {
    const slot = branchCount > 1 ? -ANGLE_SPREAD / 2 + i * (ANGLE_SPREAD / (branchCount - 1)) : 0;
    const child = buildBranch(structureRand, foliageRand, level + 1, levels, branchFactor, foliageDensity);
    child.angleSlot = slot;
    node.children.push(child);
  }

  return node;
}

export function buildTreeGeometry(story: StoryTreeStory): TreeGeometry {
  // four independent streams (not one shared generator) so that, e.g.,
  // changing a story's reception can never perturb its branch skeleton or
  // its shape/color identity — growth, reception, and identity stay
  // genuinely decoupled rather than accidentally coupled by RNG call order
  const structureRand = seedrandom(story.id);
  const foliageRand = seedrandom(`${story.id}#foliage`);
  const shapeRand = seedrandom(`${story.id}#shape`);
  const colorRand = seedrandom(`${story.id}#color`);

  const levels = Math.max(
    MIN_LEVELS,
    Math.min(MAX_LEVELS, Math.round(3 + Math.log2(1 + story.descendentsCount) * 1.3))
  );
  const branchFactor = Math.max(2, Math.min(3, 1 + Math.round(Math.log2(1 + story.childrenCount))));
  const depthNorm = Math.max(0, Math.min(1, story.depth / 20));
  const heightScale = 0.55 + 0.9 * depthNorm;
  const receptionRaw = Math.log(1 + story.likesCount) + Math.log(1 + story.commentsCount);
  const receptionNorm = Math.max(0, Math.min(1, receptionRaw / 9));
  const foliageDensity = 0.12 + 1.5 * Math.pow(receptionNorm, 0.6);

  const shape = LEAF_SHAPES[Math.floor(shapeRand() * LEAF_SHAPES.length)];
  const color = COLOR_PALETTE[Math.floor(colorRand() * COLOR_PALETTE.length)];
  const canopy = buildBranch(structureRand, foliageRand, 0, levels, branchFactor, foliageDensity);

  return { levels, branchFactor, heightScale, receptionNorm, shape, color, canopy };
}
