'use client';

import clsx from 'clsx';
import { Button, Text, Container } from '@/components/ui';
import { useCookies } from 'react-cookie';
import * as gtag from '@/lib/gtag';
import { useState, useEffect } from 'react';
import { COOKIE_CONSENT_NAME, COOKIE_CONSENT_ACCEPTED, COOKIE_CONSENT_DECLINED } from '@/lib/helper/cookie-consent';

const CONSENT_MAX_AGE = 365 * 24 * 60 * 60;

export interface CookieConsentProps {
  className?: string;
}

export const CookieConsent = ({ className }: CookieConsentProps) => {
  const [visible, setVisible] = useState(false);
  const [cookie, setCookie] = useCookies([COOKIE_CONSENT_NAME]);

  useEffect(() => {
    // only prompt when no choice has been made yet; declining should stick too
    if (cookie[COOKIE_CONSENT_NAME] === undefined) {
      setVisible(true);
    }
  }, [cookie[COOKIE_CONSENT_NAME]]);

  const setCookieConsent = (accepted: boolean) => {
    gtag.event({
      action: accepted ? 'accept-cookie-consent' : 'decline-cookie-consent',
      category: 'cookie-consent',
    });
    setCookie(COOKIE_CONSENT_NAME, accepted ? COOKIE_CONSENT_ACCEPTED : COOKIE_CONSENT_DECLINED, { path: '/', maxAge: CONSENT_MAX_AGE });
    setVisible(false);
  };

  return (visible &&
    <div className={clsx('fixed bottom-0 left-0 w-full p-md border-t-2 bg-base z-50', className)}>
      <Container className="flex flex-row gap-md justify-center items-center">
        <Text>
          This site uses cookies to improve your experience. Analytics cookies are only set if you accept.
        </Text>
        <Button variant="outlined" onClick={() => setCookieConsent(false)}>DECLINE</Button>
        <Button onClick={() => setCookieConsent(true)}>ACCEPT</Button>
      </Container>
    </div>
  );
}
