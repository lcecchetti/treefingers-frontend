import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MAINTENANCE_MODE: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: z.url(),
    NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
  },
  runtimeEnv: {
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  },
});
