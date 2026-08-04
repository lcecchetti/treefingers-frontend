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
  time: number | null
): void {
  const swayTerm = time === null
    ? 0
    : SWAY_AMPLITUDE * Math.pow(node.level / levels, 1.4) * Math.sin(time * SWAY_SPEED + node.phase);
  const rawAngle = angle + node.jitter + swayTerm;
  const segmentAngle = UP + (rawAngle - UP) * ANGLE_DAMPING;
  const segmentLength = length * node.lengthRatio;
  const nextX = x + Math.cos(segmentAngle) * segmentLength;
  const nextY = y + Math.sin(segmentAngle) * segmentLength;
  const ratio = node.level / levels;

  ctx.lineCap = 'butt';
  ctx.lineWidth = Math.max(1, (TRUNK_WIDTH - (TRUNK_WIDTH - TIP_WIDTH) * ratio) * sizeScale);
  ctx.strokeStyle = `hsl(${color.hue}, 14%, ${28 + 45 * (1 - ratio)}%)`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(nextX, nextY);
  ctx.stroke();

  for (const leaf of node.leaves) {
    const leafX = x + (nextX - x) * leaf.fraction + leaf.offsetX * sizeScale;
    const leafY = y + (nextY - y) * leaf.fraction + leaf.offsetY * sizeScale;
    drawLeaf(ctx, leafX, leafY, leaf.size * sizeScale, leaf.rotation, shape);
  }

  for (const child of node.children) {
    walkBranch(ctx, child, nextX, nextY, segmentAngle + child.angleSlot, segmentLength, levels, color, shape, sizeScale, time);
  }
}

export function renderTree(
  ctx: CanvasRenderingContext2D,
  geometry: TreeGeometry,
  width: number,
  height: number,
  time: number | null
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

  walkBranch(ctx, geometry.canopy, width / 2, groundY, -Math.PI / 2, trunkLength, geometry.levels, geometry.color, geometry.shape, sizeScale, time);
}
