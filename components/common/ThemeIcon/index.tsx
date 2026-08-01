import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import { themes } from 'lib/ui/context';
import { useState, useEffect } from 'react';

const iconComponents = {
  [themes.light]: FaSun,
  [themes.dark]: FaMoon,
 }

export interface ThemeIconProps {
  className?: string;
}

const ThemeIcon = ({ className }: ThemeIconProps) => {
  const { resolvedTheme } = useTheme();
  const [icon, setIcon] = useState(themes.light);

  useEffect(() => {
    if (resolvedTheme) {
      setIcon(resolvedTheme);
    }
  }, [resolvedTheme]);

  const Icon = iconComponents[icon as keyof typeof iconComponents] || FaSun;

  return <Icon className={className} />;
}

export default ThemeIcon;
