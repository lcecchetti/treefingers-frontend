import { useTheme } from "next-themes";
import { FaSun, FaMoon } from 'react-icons/fa';
import { themes } from 'lib/ui/context';

const ThemeIcon = ({ className }) => {
  const { theme } = useTheme();

  const Icon = (theme === themes.dark) ? FaMoon : FaSun;

  return <Icon className={className} />;
}

export default ThemeIcon;