import { LENGTH_RATIO_BASE, type BranchNode, type LeafShape, type PaletteColor, type TreeGeometry } from './story-tree.geometry';

// quiet wind: trunk barely moves, tips sway the most, each branch has its
// own phase so the canopy doesn't move as one rigid unit
const SWAY_AMPLITUDE = 0.065;
const SWAY_SPEED = 0.0006;
// the validated mockup was tuned against a ~300px-tall canvas; every
// pixel-based constant below is scaled from that baseline so the same
// renderer looks proportionally right at both flyout and full-screen sizes
const SIZE_SCALE_BASELINE = 300;
// each level keeps only this fraction of its raw deviation from straight up,
// pulling the rest back toward vertical. Without this, a chain of
// same-direction angle offsets can compound over many levels into a branch
// that runs sideways or even downward. A hard clamp stops that too, but
// re-clamping at every level makes many outer branches in a deep tree pile
// up on the exact same boundary angle instead of fanning out — this damps
// the drift smoothly instead, so bushier trees stay a spread canopy rather
// than a narrow, crowded cone.
const ANGLE_DAMPING = 0.85;
const UP = -Math.PI / 2;
// branch thickness tapers from trunk to tips as a fraction of the canopy's
// depth (not the absolute level count) so a bushy, many-level tree doesn't
// end up with systematically thicker branches than a small one at every
// matching depth.
const TRUNK_WIDTH = 4.5;
const TIP_WIDTH = 1;
// leaves bloom (scale up from their center point) starting the moment their
// branch begins extending, not after it finishes -- otherwise a whole level's
// worth of leaves pops in as one lockstep block right as its branches finish,
// reading as "bare branches, then sudden leaves" instead of a continuous grow.
// The span is capped to what's left before growth: 1 so a leaf on the
// outermost level (whose window sits right against that ceiling) still
// finishes blooming instead of getting stuck part-open forever.
const LEAF_BLOOM_SPAN_MULTIPLIER = 2;
// spreads a level's leaves' bloom starts within a fraction of their branch's
// own window so they don't all bloom in visual unison
const LEAF_STAGGER_FRACTION = 0.5;

// cheap deterministic pseudo-random hash of a leaf's existing (non-timing)
// floats, used only to desynchronize bloom start -- no dedicated seed field
// needed since the leaf is already unique via these values.
function leafStagger(rotation: number, offsetX: number, offsetY: number): number {
  const mixed = rotation * 12.9898 + offsetX * 78.233 + offsetY * 37.719;
  return mixed - Math.floor(mixed);
}

// equivalent to ctx.translate(x, y) + ctx.rotate(rotation) applied to a
// local point, computed by hand so drawLeaf never touches the canvas
// transform stack -- with up to several thousand leaves redrawn every
// animation frame, skipping save()/rotate()/restore() per leaf is a real
// per-frame saving for identical output, not just a style preference.
function rotated(px: number, py: number, cosR: number, sinR: number, x: number, y: number): [number, number] {
  return [x + px * cosR - py * sinR, y + px * sinR + py * cosR];
}

function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, shape: LeafShape): void {
  ctx.beginPath();
  if (shape === 'circle') {
    // rotation-invariant -- no point rotating a circle
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
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
  // each depth level gets an equal-width slice of the [0, 1] growth range,
  // so the tree visibly sprouts outward from trunk to tips rather than
  // fading in all at once. A child's slice starts exactly where its
  // parent's ends, so a still-growing parent's children are naturally
  // untouched -- no need to special-case skipping their recursion below.
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
  // trunk length is normalized against the expected geometric falloff of
  // LENGTH_RATIO_BASE over `levels` segments, so total reach stays roughly
  // constant regardless of level count -- otherwise a bushier tree (more
  // descendants -> more levels) compounds on top of a taller one, and the
  // two multiply into wildly oversized trees instead of adding cleanly.
  // Growth shows up as branchiness/density; height stays depth's job.
  const expectedReach = (1 - Math.pow(LENGTH_RATIO_BASE, geometry.levels)) / (1 - LENGTH_RATIO_BASE);
  const trunkLength = (groundY * geometry.heightScale) / expectedReach;

  ctx.fillStyle = `hsla(${geometry.color.hue}, ${geometry.color.saturation}%, 58%, 0.85)`;

  walkBranch(ctx, geometry.canopy, width / 2, groundY, -Math.PI / 2, trunkLength, geometry.levels, geometry.color, geometry.shape, sizeScale, time, growth);
}
