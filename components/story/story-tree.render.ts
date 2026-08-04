import type { BranchNode, LeafShape, PaletteColor, TreeGeometry } from './story-tree.geometry';

// quiet wind: trunk barely moves, tips sway the most, each branch has its
// own phase so the canopy doesn't move as one rigid unit
const SWAY_AMPLITUDE = 0.065;
const SWAY_SPEED = 0.0006;
// the validated mockup was tuned against a ~300px-tall canvas; every
// pixel-based constant below is scaled from that baseline so the same
// renderer looks proportionally right at both flyout and full-screen sizes
const SIZE_SCALE_BASELINE = 300;

function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, shape: LeafShape): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  } else if (shape === 'diamond') {
    ctx.rect(-size / 2, -size / 2, size, size);
  } else if (shape === 'triangle') {
    ctx.moveTo(0, -size / 1.6);
    ctx.lineTo(size / 1.7, size / 2.2);
    ctx.lineTo(-size / 1.7, size / 2.2);
    ctx.closePath();
  } else if (shape === 'plus') {
    const thickness = size * 0.34;
    ctx.rect(-size / 2, -thickness / 2, size, thickness);
    ctx.rect(-thickness / 2, -size / 2, thickness, size);
  } else if (shape === 'hexagon') {
    for (let i = 0; i < 6; i++) {
      const cornerAngle = (i * Math.PI) / 3;
      const px = Math.cos(cornerAngle) * (size / 2);
      const py = Math.sin(cornerAngle) * (size / 2);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else if (shape === 'star') {
    for (let i = 0; i < 10; i++) {
      const cornerAngle = (i * Math.PI) / 5 - Math.PI / 2;
      const radius = i % 2 === 0 ? size / 2 : size / 4.5;
      const px = Math.cos(cornerAngle) * radius;
      const py = Math.sin(cornerAngle) * radius;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
  ctx.fill();
  ctx.restore();
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
  const segmentAngle = angle + node.jitter + swayTerm;
  const segmentLength = length * node.lengthRatio;
  const nextX = x + Math.cos(segmentAngle) * segmentLength;
  const nextY = y + Math.sin(segmentAngle) * segmentLength;
  const ratio = node.level / levels;

  ctx.lineCap = 'butt';
  ctx.lineWidth = Math.max(1, (levels - node.level + 1) * 1.1 * sizeScale);
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
  const trunkLength = (groundY / (geometry.levels * 0.62)) * geometry.heightScale;

  ctx.fillStyle = `hsla(${geometry.color.hue}, ${geometry.color.saturation}%, 58%, 0.85)`;

  walkBranch(ctx, geometry.canopy, width / 2, groundY, -Math.PI / 2, trunkLength, geometry.levels, geometry.color, geometry.shape, sizeScale, time);
}
