import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { UserEditForm } from '@/components/user';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My details - Treefingers',
};

export default function ProfileDetailsPage() {
  return (
    <>
      <PageIntro>
        <Text variant="pageTitle">My details</Text>
        <Text variant="p">Here you can edit your profile details.</Text>
      </PageIntro>
      <UserEditForm/>
    </>
  );
}
