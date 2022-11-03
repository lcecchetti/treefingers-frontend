import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import { themes } from 'lib/ui/context';
import { useState, useEffect } from 'react';

const iconComponents = {
  [themes.dark]: FaMoon,
  [themes.light]: FaSun,
 }

const ThemeIcon = ({ className }) => {
  const { theme } = useTheme();
  const [icon, setIcon] = useState(themes.light);

  useEffect(() => {
    setIcon(theme);
  }, [theme]);
  
  const Icon = iconComponents[icon];

  return <Icon className={className} />;
}

export default ThemeIcon;