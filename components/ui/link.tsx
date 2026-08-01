import clsx from 'clsx';
import NextLink from 'next/link';

export interface LinkProps extends Omit<React.ComponentPropsWithoutRef<typeof NextLink>, 'className'> {
  className?: string;
  underline?: boolean;
}

export const Link = ({ className, children, underline, href = '#', ...rest }: LinkProps) => {
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

