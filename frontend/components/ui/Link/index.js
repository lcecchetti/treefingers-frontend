import clsx from 'clsx';
import NextLink from 'next/link';

const Link = ({ className, children, target, hreflang, rel, styleAsLink = true, ...rest }) => {

  return (
    <NextLink {...rest} >
      <a
        className={clsx(
          {
            ['transition-colors underline hover:text-primary-light']: styleAsLink,
          },
          className
        )}
        target={target}
        hreflang={hreflang}
        rel={rel}>
        {children}
      </a>
    </NextLink>
  );
};

export default Link;

