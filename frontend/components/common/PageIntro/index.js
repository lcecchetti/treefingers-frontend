import { Text } from 'components/ui';

const PageIntro = ({ title, children }) => {
  return (
    <div className="my-sm md:mb-lg ">
      <Text variant="pageTitle">{title}</Text>
      {children}
    </div>
  );
};

export default PageIntro;