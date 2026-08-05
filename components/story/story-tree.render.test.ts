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

  describe('growth', () => {
    it('defaults to a fully-grown tree, matching a render with no growth argument', () => {
      const trunk = leafNode(0);
      trunk.children.push({ ...leafNode(1), angleSlot: 0.2 });
      const geometry = buildFixture(trunk);

      const implicit = createMockContext();
      renderTree(implicit.ctx, geometry, 200, 300, null);
      const explicit = createMockContext();
      renderTree(explicit.ctx, geometry, 200, 300, null, 1);

      expect(explicit.calls).toEqual(implicit.calls);
    });

    it('draws nothing but the clear before the trunk has started growing', () => {
      const trunk = leafNode(0, [{ fraction: 0.5, size: 4, rotation: 0, offsetX: 0, offsetY: 0 }]);
      trunk.children.push({ ...leafNode(1), angleSlot: 0.2 });
      const geometry = buildFixture(trunk);

      const { ctx, calls } = createMockContext();
      renderTree(ctx, geometry, 200, 300, null, 0);

      expect(calls).toEqual([['clearRect', [0, 0, 200, 300]]]);
    });

    it('does not draw a child branch before its own growth window begins', () => {
      const trunk = leafNode(0);
      trunk.children.push({ ...leafNode(1), angleSlot: 0.2 });
      const geometry = buildFixture(trunk); // levels: 3 -> 4 growth slots, each 0.25 wide

      const { ctx } = createMockContext();
      renderTree(ctx, geometry, 200, 300, null, 0.2); // trunk (slot 0) growing, child (slot 1) not yet

      expect(ctx.moveTo).toHaveBeenCalledTimes(1);
      expect(ctx.stroke).toHaveBeenCalledTimes(1);
    });

    it('starts blooming a leaf alongside its branch rather than waiting for the branch to finish', () => {
      const trunk = leafNode(0, [{ fraction: 0.5, size: 4, rotation: 0, offsetX: 0, offsetY: 0 }]);
      const geometry = buildFixture(trunk);

      const justStarted = createMockContext();
      renderTree(justStarted.ctx, geometry, 200, 300, null, 0.02); // trunk barely growing, window is [0, 0.25)
      expect(justStarted.ctx.fill).toHaveBeenCalledTimes(1);
    });

    it('blooms a leaf from its center point rather than popping in at full size', () => {
      const trunk = leafNode(0, [{ fraction: 0.5, size: 4, rotation: 0, offsetX: 0, offsetY: 0 }]);
      const geometry: TreeGeometry = { ...buildFixture(trunk), shape: 'circle' };

      const early = createMockContext();
      renderTree(early.ctx, geometry, 200, 300, null, 0.05);
      const earlyRadius = early.calls.find(([name]) => name === 'arc')![1][2] as number;

      const full = createMockContext();
      renderTree(full.ctx, geometry, 200, 300, null, 1);
      const fullRadius = full.calls.find(([name]) => name === 'arc')![1][2] as number;

      expect(earlyRadius).toBeGreaterThan(0);
      expect(earlyRadius).toBeLessThan(fullRadius);
    });

    it('finishes blooming every leaf by the time growth reaches 1, even at the outermost level', () => {
      // levels: 7 puts the tip's growth window right up against the 1.0 ceiling,
      // the tightest case for a bloom span that must still land fully open by growth: 1
      const tip = leafNode(7, [{ fraction: 1, size: 4, rotation: 0.9, offsetX: 3, offsetY: -2 }]);
      let node = tip;
      for (let level = 6; level >= 0; level--) {
        const parent = leafNode(level);
        parent.children.push(node);
        node = parent;
      }
      const geometry: TreeGeometry = { ...buildFixture(node), levels: 7, shape: 'circle' };

      const { ctx, calls } = createMockContext();
      renderTree(ctx, geometry, 200, 300, null, 1);

      const radius = calls.find(([name]) => name === 'arc')![1][2] as number;
      expect(radius).toBeCloseTo(2); // leaf.size (4) / 2, at full bloom (sizeScale is 1 at height 300)
    });

    it('draws a growing branch as a shorter segment than its fully-grown length', () => {
      const trunk = leafNode(0);
      const geometry = buildFixture(trunk);

      const full = createMockContext();
      renderTree(full.ctx, geometry, 200, 300, null, 1);
      const fullEnd = full.calls.find(([name]) => name === 'lineTo')![1];

      const partial = createMockContext();
      renderTree(partial.ctx, geometry, 200, 300, null, 0.1); // partway through the trunk's [0, 0.25) window
      const partialEnd = partial.calls.find(([name]) => name === 'lineTo')![1];

      expect(partialEnd).not.toEqual(fullEnd);
    });
  });
});
