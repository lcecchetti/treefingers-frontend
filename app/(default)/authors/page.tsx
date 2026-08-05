import { Container, Text } from '@/components/ui';
import { ClientOnly, PageIntro } from '@/components/common';
import { UserListContent } from '@/components/user';
import { UserListStatic } from '@/components/user/user-list-static';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authors | Treefingers',
  description: 'A list of the most popular authors on Treefingers',
};

export const revalidate = 3600;

const GRID_CLASS_NAME = 'grid gap-md xl:grid-cols-3 md:grid-cols-2 grid-cols-1';

export default function AuthorsPage() {
  return (
    <Container>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Authors</Text>
        </div>
        <Text variant="p">
          Here is a list of popular authors.
        </Text>
      </PageIntro>
      <ClientOnly fallback={<UserListStatic className={GRID_CLASS_NAME} filter={{ storiesCount: { gt: 0 } }} sort={{ followersCount: 'DESC' }} />}>
        <UserListContent className={GRID_CLASS_NAME} filter={{ storiesCount: { gt: 0 } }} sort={{ followersCount: 'DESC' }} />
      </ClientOnly>
    </Container>
  );
}
