import { cache, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Container, Spinner } from '@/components/ui';
import { query } from '@/lib/apollo/client';
import { QUERY_USER, UserView } from '@/components/user';
import type { Metadata } from 'next';

export const revalidate = 1;

export function generateStaticParams() {
  return [];
}

const loadUser = cache(async (username: string) => {
  const { data } = await query({
    query: QUERY_USER,
    variables: { filter: { username: { eq: username } } },
  });

  return data?.user ?? null;
});

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await loadUser(username);
  if (!user) return {};

  return {
    title: `${user.username} | User | Treefingers`,
    description: `${user.username} - ${user.bio}`,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const user = await loadUser(username);
  if (!user) notFound();

  return (
    <Container>
      <Suspense fallback={<Spinner className="my-lg" />}>
        <UserView user={{ id: user.id }} />
      </Suspense>
    </Container>
  );
}
