import { track } from '@vercel/analytics';

interface AnalyticsEventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: AnalyticsEventParams): void => {
  track(action, {
    category,
    ...(label !== undefined && { label }),
    ...(value !== undefined && { value }),
  });
};
