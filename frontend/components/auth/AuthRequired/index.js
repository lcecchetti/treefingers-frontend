import { useUser } from 'lib/auth';
import { Text, Button, Link } from 'components/ui';
import { getLoginUrl } from 'lib/helper';
import { useRouter } from 'next/router';

const AuthRequired = ({ children, text }) => {
  const user = useUser();
  const router = useRouter();

  text = text ?? "Hey, it looks like you are not logged in. Login or create an account and you'll be ready to go.";

  return (
    <>
      {!user && 
        <div className="my-md flex flex-col gap-sm items-center p-lg border-t-2 border-b-2">
          <Text variant="p">{text}</Text>
          <Button as={Link} href={getLoginUrl(router.asPath)}>Login / Register</Button>
        </div>
      }

      {user &&
        children
      }
    </>
  );
};

export default AuthRequired;