import { forwardRef } from 'react';
import clsx from 'clsx';
import NextLink from 'next/link';

const HtmlA = forwardRef(({ children, className, target, hrefLang, href, rel, styleAsLink, underline, ...rest }, ref) => {
  return (
    <a className={clsx(
        {
          ['transition-colors hover:text-primary-light']: styleAsLink,
          ['underline']: styleAsLink && underline,
        },
        className
      )}
      target={target}
      hrefLang={hrefLang}
      href={href}
      rel={rel}
      {...rest}
    >
      {children}
    </a>
  );
});

const Link = ({ className, children, target, hrefLang, rel, underline = true, styleAsLink = true, href = '#', ...rest }) => {

  // props to pass to a tag
  const aProps = {
    className,
    target, 
    hrefLang,
    rel,
    underline,
    styleAsLink,
  };

  // fix for # links, avoiding server/client mismatch
  if (href === '#') {
    return (<HtmlA href={href} {...aProps} {...rest}>{children}</HtmlA>);
  }

  return (
    <NextLink {...rest} href={href} passHref={true} >
      <HtmlA {...aProps}>{children}</HtmlA>
    </NextLink>
  );
};

export default Link;

