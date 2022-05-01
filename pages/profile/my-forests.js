import { ProfileLayout } from 'components/layout';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import { ForestList } from 'components/forest';
import { useCurrentUser } from 'lib/auth/currentUser';

const ProfileMyForestsPage = () => {
  const currentUser = useCurrentUser();

  return (
    <>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">My forests</Text>
        </div>
        <Text variant="p">
          Here is a list of the forests you've created.
        </Text>
      </PageIntro>
      <ForestList className="grid md:grid-cols-2 gap-md" filter={{ founder: { eq: currentUser._id } }}/>
    </>
  );
};

ProfileMyForestsPage.Layout = ProfileLayout;

export default ProfileMyForestsPage;