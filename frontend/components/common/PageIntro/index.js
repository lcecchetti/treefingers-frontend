import { Text } from 'components/ui';

const PageIntro = ({ title, children }) => {
  return (
    <div className="mb-md">
      <Text variant="pageTitle">{title}</Text>
      {children}
    </div>
  );
};

export default PageIntro;