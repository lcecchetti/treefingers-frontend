import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Absolute path so it also resolves correctly from git worktrees.
  schema: '/Users/luca/workspace/treefingers/treefingers-backend/schema.gql',
  documents: ['**/*.{ts,tsx}', '!node_modules/**', '!.next/**'],
  generates: {
    'lib/graphql/generated/': {
      preset: 'client',
      config: {
        // Both are plain strings on the wire; without this they default to `unknown`.
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
