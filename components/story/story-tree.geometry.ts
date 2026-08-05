import seedrandom from 'seedrandom';

export interface StoryTreeStory {
  id: string;
  descendantsCount: number;
  childrenCount: number;
  depth: number;
  likesCount: number;
  commentsCount: number;
  root?: StoryTreeStory;
} 

export const LEAF_SHAPES = ['diamond', 'circle', 'triangle', 'hexagon'] as const;
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
const ANGLE_SPREAD = 1.8;
// Used by story-tree.render.ts to normalize trunk length against level count.
export const LENGTH_RATIO_BASE = 0.82;
// Leaves grow on the outermost 3 tiers, sampled along each segment (not just
// the tip) so a well-loved story reads as full rather than dotted at the ends.
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
    lengthRatio: level === 0 ? 1 : LENGTH_RATIO_BASE * (0.85 + structureRand() * 0.3),
    phase: structureRand() * Math.PI * 2,
    leaves: [],
    children: [],
  };

  if (level >= levels - FOLIAGE_ANCHOR_LEVELS_FROM_TIP) {
    for (const fraction of FOLIAGE_ANCHOR_FRACTIONS) {
      // Capped at one leaf per anchor -- keeps the per-frame draw cost down
      // for a density difference that reads as "very full" either way.
      if (foliageRand() >= Math.min(1, foliageDensity)) continue;
      node.leaves.push({
        fraction,
        size: 2 + foliageRand() * 4,
        rotation: foliageRand() * Math.PI,
        offsetX: (foliageRand() - 0.5) * 10,
        offsetY: (foliageRand() - 0.5) * 10,
      });
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
  // Independent RNG streams so e.g. reception changes can't perturb the
  // branch skeleton or shape/color identity.
  const structureRand = seedrandom(story.id);
  const foliageRand = seedrandom(`${story.id}#foliage`);
  const shapeRand = seedrandom(`${story.id}#shape`);
  const colorRand = seedrandom(`${story.id}#color`);

  const levels = Math.max(
    MIN_LEVELS,
    Math.min(MAX_LEVELS, Math.round(3 + Math.log2(1 + story.descendantsCount) * 1.3))
  );
  const branchFactor = Math.max(2, Math.min(3, 1 + Math.round(Math.log2(1 + story.childrenCount))));
  // Caps at depth 8 (not the eventual max) so depth still matters as sagas
  // grow longer without pinning nearly every tree to the floor today; the
  // bulk of tree size comes from render.ts's trunk length, not this range.
  const depthNorm = Math.max(0, Math.min(1, story.depth / 8));
  const heightScale = 0.85 + 0.15 * depthNorm;
  const receptionRaw = Math.log(1 + story.likesCount) + Math.log(1 + story.commentsCount);
  const receptionNorm = Math.max(0, Math.min(1, receptionRaw / 9));
  const foliageDensity = 0.12 + 1.5 * Math.pow(receptionNorm, 0.6);

  const shape = LEAF_SHAPES[Math.floor(shapeRand() * LEAF_SHAPES.length)];
  const color = COLOR_PALETTE[Math.floor(colorRand() * COLOR_PALETTE.length)];
  const canopy = buildBranch(structureRand, foliageRand, 0, levels, branchFactor, foliageDensity);

  return { levels, branchFactor, heightScale, receptionNorm, shape, color, canopy };
}
