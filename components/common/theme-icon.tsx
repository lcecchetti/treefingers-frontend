'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { themes } from '@/lib/ui/context';
import { useState, useEffect } from 'react';

const iconComponents = {
  [themes.light]: Sun,
  [themes.dark]: Moon,
 }

export interface ThemeIconProps {
  className?: string;
}

export const ThemeIcon = ({ className }: ThemeIconProps) => {
  const { resolvedTheme } = useTheme();
  const [icon, setIcon] = useState(themes.light);

  useEffect(() => {
    if (resolvedTheme) {
      setIcon(resolvedTheme);
    }
  }, [resolvedTheme]);

  const Icon = iconComponents[icon as keyof typeof iconComponents] || Sun;

  return <Icon className={className} />;
}
