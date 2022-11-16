import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import { themes, useUI } from 'lib/ui/context';
import { useState, useEffect } from 'react';

const iconComponents = {
  [themes.dark]: FaMoon,
  [themes.light]: FaSun,
 }

const ThemeIcon = ({ className }) => {
  const { theme } = useTheme();
  const [icon, setIcon] = useState(themes.light);
  const { getToggledTheme } = useUI();

  useEffect(() => {
    setIcon(getToggledTheme(theme));
  }, [theme]);
  
  const Icon = iconComponents[icon];

  return <Icon className={className} />;
}

export default ThemeIcon;