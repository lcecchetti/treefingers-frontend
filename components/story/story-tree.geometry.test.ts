import { describe, it, expect } from 'vitest';
import { buildTreeGeometry, type BranchNode, type StoryTreeStory } from './story-tree.geometry';

const baseStory: StoryTreeStory = {
  id: 'story-alder',
  descendentsCount: 4,
  childrenCount: 1,
  depth: 3,
  likesCount: 8,
  commentsCount: 3,
};

function countLeaves(node: BranchNode): number {
  return node.leaves.length + node.children.reduce((sum, child) => sum + countLeaves(child), 0);
}

function stripLeaves(node: BranchNode): unknown {
  return {
    level: node.level,
    angleSlot: node.angleSlot,
    jitter: node.jitter,
    lengthRatio: node.lengthRatio,
    phase: node.phase,
    children: node.children.map(stripLeaves),
  };
}

describe('buildTreeGeometry', () => {
  it('is fully deterministic for the same story', () => {
    const a = buildTreeGeometry(baseStory);
    const b = buildTreeGeometry(baseStory);
    expect(a).toEqual(b);
  });

  it('grows more levels for more descendants, capped at 7', () => {
    const quiet = buildTreeGeometry({ ...baseStory, descendentsCount: 0 });
    const grown = buildTreeGeometry({ ...baseStory, descendentsCount: 3 });
    const maxedOut = buildTreeGeometry({ ...baseStory, descendentsCount: 1000 });
    expect(quiet.levels).toBeLessThan(grown.levels);
    expect(maxedOut.levels).toBe(7);
  });

  it('widens the branch factor for more children, capped at 3', () => {
    const narrow = buildTreeGeometry({ ...baseStory, childrenCount: 0 });
    const wide = buildTreeGeometry({ ...baseStory, childrenCount: 10 });
    expect(narrow.branchFactor).toBe(2);
    expect(wide.branchFactor).toBe(3);
  });

  it('grows taller with more depth, capped at 1.45x', () => {
    const shallow = buildTreeGeometry({ ...baseStory, depth: 0 });
    const deep = buildTreeGeometry({ ...baseStory, depth: 20 });
    const deeper = buildTreeGeometry({ ...baseStory, depth: 1000 });
    expect(shallow.heightScale).toBeCloseTo(0.55);
    expect(deep.heightScale).toBeCloseTo(1.45);
    expect(deeper.heightScale).toBe(deep.heightScale);
  });

  it('grows fuller foliage with more reception, from sparse to dense', () => {
    const bare = buildTreeGeometry({ ...baseStory, likesCount: 0, commentsCount: 0 });
    const loved = buildTreeGeometry({ ...baseStory, likesCount: 200, commentsCount: 200 });
    expect(countLeaves(loved.canopy)).toBeGreaterThan(countLeaves(bare.canopy) * 3);
  });

  it('keeps branch structure unchanged when only reception changes', () => {
    const bare = buildTreeGeometry({ ...baseStory, likesCount: 0, commentsCount: 0 });
    const loved = buildTreeGeometry({ ...baseStory, likesCount: 200, commentsCount: 200 });
    expect(stripLeaves(bare.canopy)).toEqual(stripLeaves(loved.canopy));
  });

  it('picks shape and color independently of stats, but consistently for the same id', () => {
    const quiet = buildTreeGeometry({ ...baseStory, descendentsCount: 0, likesCount: 0, commentsCount: 0 });
    const loud = buildTreeGeometry({ ...baseStory, descendentsCount: 50, likesCount: 500, commentsCount: 500 });
    expect(quiet.shape).toBe(loud.shape);
    expect(quiet.color).toEqual(loud.color);
  });

  it('gives different stories different identities', () => {
    const alder = buildTreeGeometry({ ...baseStory, id: 'story-alder' });
    const birch = buildTreeGeometry({ ...baseStory, id: 'story-birch' });
    expect(alder.shape !== birch.shape || alder.color.name !== birch.color.name).toBe(true);
  });
});
