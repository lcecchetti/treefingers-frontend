import type { ReactNode } from 'react';
import { StoryTreeOverlay } from '@/components/story/story-tree-overlay';

export default function StoryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StoryTreeOverlay />
      {children}
    </>
  );
}
