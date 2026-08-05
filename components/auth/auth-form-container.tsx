import { Text } from '@/components/ui';

interface AuthFormContainerProps {
  children: React.ReactNode;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AuthFormContainer = ({ children, title, icon }: AuthFormContainerProps) => {
  const Icon = icon;

  return (
    <div className="lg:max-w-(--container-sm) lg:w-1/4 p-md m-md border-2 rounded-xl flex flex-col gap-md">
      <Text variant="pageTitle" className="flex justify-between items-center">
        {title}
        <Icon className="w-9 h-9" />
      </Text>
      {children}
    </div>
  );
};
