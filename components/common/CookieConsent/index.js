import clsx from 'clsx';
import { Button, Text, Container } from 'components/ui';
import { useCookies } from 'react-cookie';
import * as gtag from 'lib/gtag';
import { useState, useEffect } from 'react';

const cookieName = 'cookie-consent';
const CookieConsent = ({ className }) => {
  const [visible, setVisible] = useState(false);
  const [cookie, setCookie] = useCookies([cookieName]);

  useEffect(() => {
    if (!cookie[cookieName]) {
      setVisible(true);
    }
  }, [cookie[cookieName]]);

  const acceptCookieConsent = () => {
    gtag.event({
      action: 'accept-cookie-consent',
      category: 'cookie-consent',
    });
    setCookie(cookieName, true, { path: '/', maxAge: 365 * 24 * 60 * 60 });
    setVisible(false);
  };

  return (visible &&
    <div className={clsx('fixed bottom-0 left-0 w-full p-md border-t-2 bg-base', className)}>
      <Container className="flex flex-row gap-md justify-center items-center">
        <Text>
          This site uses cookies to improve your experience.
        </Text>
        <Button onClick={() => acceptCookieConsent()}>ACCEPT</Button>
      </Container>
    </div>
  );
}

export default CookieConsent;