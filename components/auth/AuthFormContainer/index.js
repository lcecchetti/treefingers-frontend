import { Text } from 'components/ui';

const AuthFormContainer = ({ children, title, icon }) => {
  const Icon = icon;

  return (
    <div className="lg:max-w-sm lg:w-1/4 p-md m-md border-2 rounded-xl flex flex-col gap-md">
      <Text variant="pageTitle" className="flex justify-between items-center">
        {title}
        <Icon />
      </Text>
      {children}
    </div>
  );
};

export default AuthFormContainer;