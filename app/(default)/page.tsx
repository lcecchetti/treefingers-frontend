import { Hero } from '@/components/common';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Treefingers | Collaborative writing',
  description: 'Treefingers is a collaborative writing app to tell never-ending stories.',
};

export default function HomePage() {
  return <Hero />;
}
