import clsx from 'clsx';
import NextLink from 'next/link';

const Link = ({ className, children, target, hrefLang, rel, styleAsLink = true, ...rest }) => {

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
        hrefLang={hrefLang}
        rel={rel}
      >
        {children}
      </a>
    </NextLink>
  );
};

export default Link;

