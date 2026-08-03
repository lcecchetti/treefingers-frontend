import { Container, Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { UserList } from '@/components/user';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authors | Treefingers',
  description: 'A list of the most popular authors on Treefingers',
};

export const revalidate = 1;

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
      <UserList className="grid gap-md xl:grid-cols-3 md:grid-cols-2 grid-cols-1" filter={{ storiesCount: { gt: 0 } }} sort={{ followersCount: 'DESC' }} />
    </Container>
  );
}
