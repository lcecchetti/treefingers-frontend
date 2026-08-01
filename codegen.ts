import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // absolute path: this plan executes inside a git worktree
  // (.worktrees/typescript-migration/), where a relative '../treefingers-backend'
  // would resolve outside the actual treefingers-backend checkout
  schema: '/Users/luca/workspace/treefingers/treefingers-backend/schema.gql',
  documents: ['**/*.{ts,tsx}', '!node_modules/**', '!.next/**'],
  generates: {
    'lib/graphql/generated/': {
      preset: 'client',
      config: {
        // both are plain strings on the wire (hashed id / ISO datetime); without
        // this they default to `unknown`, which breaks every id/date usage (React
        // `key`, formatDate, etc.) across all generated query/mutation types
        scalars: {
          HashedID: 'string',
          DateTime: 'string',
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
