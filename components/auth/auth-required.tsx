import { useCurrentUser } from '@/lib/auth/current-user';
import { Text, Button, Link } from '@/components/ui';
import { getLoginUrl } from '@/lib/helper/auth';
import { useRouter } from 'next/router';

interface AuthRequiredProps {
  children: React.ReactNode;
  text?: string;
}

export const AuthRequired = ({ children, text }: AuthRequiredProps) => {
  const { currentUser } = useCurrentUser();
  const router = useRouter();

  text = text ?? "Hey, it looks like you are not logged in. Login or create an account and you'll be ready to go.";

  return (
    <>
      {!currentUser &&
        <div className="my-md flex flex-col gap-sm items-center p-lg border-t-2 border-b-2">
          <Text variant="p">{text}</Text>
          <Button as={Link} href={getLoginUrl(router.asPath)}>Login / Register</Button>
        </div>
      }

      {currentUser &&
        children
      }
    </>
  );
};
