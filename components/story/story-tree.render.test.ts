import { describe, it, expect, vi } from 'vitest';
import { renderTree } from './story-tree.render';
import type { BranchNode, TreeGeometry } from './story-tree.geometry';

function createMockContext() {
  const calls: Array<[string, unknown[]]> = [];
  const record = (name: string) => (...args: unknown[]) => { calls.push([name, args]); };
  const ctx = {
    clearRect: vi.fn(record('clearRect')),
    beginPath: vi.fn(record('beginPath')),
    moveTo: vi.fn(record('moveTo')),
    lineTo: vi.fn(record('lineTo')),
    stroke: vi.fn(record('stroke')),
    closePath: vi.fn(record('closePath')),
    save: vi.fn(record('save')),
    restore: vi.fn(record('restore')),
    translate: vi.fn(record('translate')),
    rotate: vi.fn(record('rotate')),
    rect: vi.fn(record('rect')),
    arc: vi.fn(record('arc')),
    fill: vi.fn(record('fill')),
    lineCap: '',
    lineWidth: 0,
    strokeStyle: '',
    fillStyle: '',
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

function leafNode(level: number, leaves: BranchNode['leaves'] = []): BranchNode {
  return { level, angleSlot: 0, jitter: 0, lengthRatio: level === 0 ? 1 : 0.8, phase: 0.4, leaves, children: [] };
}

function buildFixture(canopy: BranchNode): TreeGeometry {
  return {
    levels: 3,
    branchFactor: 2,
    heightScale: 1,
    receptionNorm: 0,
    shape: 'diamond',
    color: { name: 'coral', hue: 6, saturation: 68 },
    canopy,
  };
}

describe('renderTree', () => {
  it('clears the canvas before drawing', () => {
    const { ctx, calls } = createMockContext();
    renderTree(ctx, buildFixture(leafNode(0)), 200, 300, null);
    expect(calls[0]).toEqual(['clearRect', [0, 0, 200, 300]]);
  });

  it('renders identically across two static (time: null) calls', () => {
    const trunk = leafNode(0);
    trunk.children.push({ ...leafNode(1), angleSlot: 0.2 });
    const geometry = buildFixture(trunk);

    const first = createMockContext();
    renderTree(first.ctx, geometry, 200, 300, null);
    const second = createMockContext();
    renderTree(second.ctx, geometry, 200, 300, null);

    expect(second.calls).toEqual(first.calls);
  });

  it('sways branch endpoints differently at different animation times', () => {
    const trunk = leafNode(0);
    trunk.children.push({ ...leafNode(1), angleSlot: 0.2 });
    const geometry = buildFixture(trunk);

    const atStart = createMockContext();
    renderTree(atStart.ctx, geometry, 200, 300, 0);
    const later = createMockContext();
    renderTree(later.ctx, geometry, 200, 300, 4000);

    expect(later.calls).not.toEqual(atStart.calls);
  });

  it('draws one fill per leaf, and none when there are no leaves', () => {
    const bare = createMockContext();
    renderTree(bare.ctx, buildFixture(leafNode(0)), 200, 300, null);
    expect(bare.ctx.fill).not.toHaveBeenCalled();

    const leafy = createMockContext();
    const trunkWithLeaf = leafNode(0, [{ fraction: 0.5, size: 4, rotation: 0, offsetX: 0, offsetY: 0 }]);
    renderTree(leafy.ctx, buildFixture(trunkWithLeaf), 200, 300, null);
    expect(leafy.ctx.fill).toHaveBeenCalledTimes(1);
  });
});
