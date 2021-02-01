import clsx from 'clsx';
import NextLink from 'next/link';

const Link = ({ className, children, target, hrefLang, rel, underline = true, styleAsLink = true, ...rest }) => {

  return (
    <NextLink {...rest} >
      <a
        className={clsx(
          {
            ['transition-colors hover:text-primary-light']: styleAsLink,
            ['underline']: styleAsLink && underline,
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

