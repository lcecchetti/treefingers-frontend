import { DefaultLayout } from 'components/layout';
import { Hero } from 'components/common'

const HomePage = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

HomePage.Layout = DefaultLayout;

export default HomePage;