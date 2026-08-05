import { LENGTH_RATIO_BASE, type BranchNode, type LeafShape, type PaletteColor, type TreeGeometry } from './story-tree.geometry';

// Quiet wind: trunk barely moves, tips sway most, each branch has its own phase.
const SWAY_AMPLITUDE = 0.065;
const SWAY_SPEED = 0.0006;
// Pixel constants below are scaled from this baseline canvas height.
const SIZE_SCALE_BASELINE = 300;
// Pulls each level's angle offset back toward vertical so deep chains of
// same-direction jitter don't compound into sideways branches; damping
// (vs. a hard clamp) keeps outer branches fanned out instead of piled on
// the same boundary angle.
const ANGLE_DAMPING = 0.85;
const UP = -Math.PI / 2;
// Tapers by fraction of canopy depth, not absolute level count, so a bushy
// tree doesn't end up thicker than a small one at matching depths.
const TRUNK_WIDTH = 4.5;
const TIP_WIDTH = 1;
// Leaves start blooming as their branch extends, not after, so growth reads
// continuous rather than "bare branches, then leaves pop in". Span is capped
// to what's left before growth hits 1, so outermost-level leaves still finish.
const LEAF_BLOOM_SPAN_MULTIPLIER = 2;
// Spreads a level's leaf bloom starts within a fraction of the branch's own
// window so they don't all bloom in unison.
const LEAF_STAGGER_FRACTION = 0.5;

// Deterministic pseudo-random hash of a leaf's own floats, used to
// desynchronize bloom start without a dedicated seed field.
function leafStagger(rotation: number, offsetX: number, offsetY: number): number {
  const mixed = rotation * 12.9898 + offsetX * 78.233 + offsetY * 37.719;
  return mixed - Math.floor(mixed);
}

// Manual translate+rotate so drawLeaf skips the canvas transform stack --
// meaningful savings with thousands of leaves redrawn per frame.
function rotated(px: number, py: number, cosR: number, sinR: number, x: number, y: number): [number, number] {
  return [x + px * cosR - py * sinR, y + px * sinR + py * cosR];
}

function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, shape: LeafShape): void {
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(x, y, size / 2, 0, Math.PI * 2); // circle is rotation-invariant
  } else if (shape === 'diamond') {
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);
    const half = size / 2;
    const [x1, y1] = rotated(-half, -half, cosR, sinR, x, y);
    const [x2, y2] = rotated(half, -half, cosR, sinR, x, y);
    const [x3, y3] = rotated(half, half, cosR, sinR, x, y);
    const [x4, y4] = rotated(-half, half, cosR, sinR, x, y);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
  } else if (shape === 'triangle') {
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);
    const [x1, y1] = rotated(0, -size / 1.6, cosR, sinR, x, y);
    const [x2, y2] = rotated(size / 1.7, size / 2.2, cosR, sinR, x, y);
    const [x3, y3] = rotated(-size / 1.7, size / 2.2, cosR, sinR, x, y);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
  } else if (shape === 'hexagon') {
    for (let i = 0; i < 6; i++) {
      const cornerAngle = (i * Math.PI) / 3 + rotation;
      const px = x + Math.cos(cornerAngle) * (size / 2);
      const py = y + Math.sin(cornerAngle) * (size / 2);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
  ctx.fill();
}

function walkBranch(
  ctx: CanvasRenderingContext2D,
  node: BranchNode,
  x: number,
  y: number,
  angle: number,
  length: number,
  levels: number,
  color: PaletteColor,
  shape: LeafShape,
  sizeScale: number,
  time: number | null,
  growth: number
): void {
  // Each depth level gets an equal slice of the [0, 1] growth range, trunk
  // to tips, so a still-growing parent's children stay untouched naturally.
  const growthWindow = 1 / (levels + 1);
  const growthStart = node.level * growthWindow;
  if (growth <= growthStart) return;
  const growthEnd = growthStart + growthWindow;
  const growthT = growth >= growthEnd ? 1 : (growth - growthStart) / growthWindow;

  const swayTerm = time === null
    ? 0
    : SWAY_AMPLITUDE * Math.pow(node.level / levels, 1.4) * Math.sin(time * SWAY_SPEED + node.phase);
  const rawAngle = angle + node.jitter + swayTerm;
  const segmentAngle = UP + (rawAngle - UP) * ANGLE_DAMPING;
  const segmentLength = length * node.lengthRatio;
  const nextX = x + Math.cos(segmentAngle) * segmentLength;
  const nextY = y + Math.sin(segmentAngle) * segmentLength;
  const ratio = node.level / levels;
  const drawX = x + (nextX - x) * growthT;
  const drawY = y + (nextY - y) * growthT;

  ctx.lineCap = 'butt';
  ctx.lineWidth = Math.max(1, (TRUNK_WIDTH - (TRUNK_WIDTH - TIP_WIDTH) * ratio) * sizeScale);
  ctx.strokeStyle = `hsl(${color.hue}, 14%, ${28 + 45 * (1 - ratio)}%)`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(drawX, drawY);
  ctx.stroke();

  for (const leaf of node.leaves) {
    const staggerOffset = leafStagger(leaf.rotation, leaf.offsetX, leaf.offsetY) * LEAF_STAGGER_FRACTION * growthWindow;
    const bloomStart = growthStart + staggerOffset;
    const bloomSpan = Math.min(LEAF_BLOOM_SPAN_MULTIPLIER * growthWindow, 1 - bloomStart);
    const bloomT = Math.min(1, Math.max(0, (growth - bloomStart) / bloomSpan));
    if (bloomT <= 0) continue;

    const leafX = x + (nextX - x) * leaf.fraction + leaf.offsetX * sizeScale;
    const leafY = y + (nextY - y) * leaf.fraction + leaf.offsetY * sizeScale;
    drawLeaf(ctx, leafX, leafY, leaf.size * sizeScale * bloomT, leaf.rotation, shape);
  }

  for (const child of node.children) {
    walkBranch(ctx, child, nextX, nextY, segmentAngle + child.angleSlot, segmentLength, levels, color, shape, sizeScale, time, growth);
  }
}

export function renderTree(
  ctx: CanvasRenderingContext2D,
  geometry: TreeGeometry,
  width: number,
  height: number,
  time: number | null,
  growth: number = 1
): void {
  ctx.clearRect(0, 0, width, height);

  const sizeScale = height / SIZE_SCALE_BASELINE;
  const groundY = height - 6 * sizeScale;
  // Normalize trunk length against LENGTH_RATIO_BASE's geometric falloff over
  // `levels` segments so total reach stays constant regardless of level count
  // -- otherwise a bushier tree compounds on top of a taller one.
  const expectedReach = (1 - Math.pow(LENGTH_RATIO_BASE, geometry.levels)) / (1 - LENGTH_RATIO_BASE);
  const trunkLength = (groundY * geometry.heightScale) / expectedReach;

  ctx.fillStyle = `hsla(${geometry.color.hue}, ${geometry.color.saturation}%, 58%, 0.85)`;

  walkBranch(ctx, geometry.canopy, width / 2, groundY, -Math.PI / 2, trunkLength, geometry.levels, geometry.color, geometry.shape, sizeScale, time, growth);
}
