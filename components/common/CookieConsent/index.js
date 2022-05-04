import clsx from 'clsx';
import { Button, Text, Container } from 'components/ui';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import * as gtag from 'lib/gtag';

const cookieName = 'cookie-consent';
const CookieConsent = ({ className }) => {
  const [accepted, setAccepted] = useState(false);
  const [cookie, setCookie] = useCookies([cookieName]);

  useEffect(() => {
    if (cookie[cookieName]) {
      gtag.event({
        action: 'accept-cookie-consent',
        category: 'cookie-consent',
      });
      setAccepted(true);
    }
  }, [cookie[cookieName]]);

  return (!accepted &&
    <div className={clsx('fixed bottom-0 left-0 w-full p-md border-t-2 bg-base', className)}>
      <Container className="flex flex-row gap-md justify-center items-center">
        <Text>
          This site uses cookies to improve your experience.
        </Text>
        <Button onClick={() => setCookie(cookieName, true, { path: '/', maxAge: 365 * 24 * 60 * 60 })}>ACCEPT</Button>
      </Container>
    </div>
  );
}

export default CookieConsent;