import { Logo } from 'components/common';
import { EmptyLayout } from 'components/layout';
import { Text } from 'components/ui';
import type { GetServerSideProps } from 'next';
import type { NextPageWithLayout } from 'lib/types/next';

const Maintenance: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col gap-md p-lg justify-center items-center fixed h-full w-full">
      <Logo/>
      <Text variant="h2">Hey, we are watering your stories!</Text>
      <Text variant="p">No worries, we'll be back soon</Text>
    </div>
  );
};

Maintenance.Layout = EmptyLayout;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 503;
  return {
    props: {},
  };
}

export default Maintenance;
