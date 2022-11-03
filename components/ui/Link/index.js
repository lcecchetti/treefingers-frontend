import clsx from 'clsx';
import NextLink from 'next/link';

const Link = ({ className, children, underline, href = '/#', ...rest }) => {
  return (
    <NextLink
      className={clsx(
        'transition-opacity hover:opacity-80',
        underline && 'underline',
        className
      )}
      href={href}
      {...rest}
    >
      {children}
    </NextLink>
  );
};

export default Link;

