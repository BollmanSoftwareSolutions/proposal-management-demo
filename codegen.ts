import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/schema.graphql',
  documents: 'src/graphql/operations/**/*.graphql',
  generates: {
    'src/graphql/generated/graphql.ts': {
      plugins: ['typescript-operations', 'typescript-react-query'],
      config: {
        reactQueryVersion: 5,
        fetcher: {
          func: '../fetcher#fetchGraphQL',
          isReactHook: false,
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
        useTypeImports: true,
        dedupeFragments: true,
        enumsAsTypes: true,
        skipTypename: false,
        scalars: {
          JSON: 'unknown',
          ID: 'string',
        },
      },
    },
  },
  hooks: {
    // The react-query plugin imports the runtime fetcher as a type under
    // useTypeImports; rewrite it to a value import so it can be called.
    afterAllFileWrite: ['node scripts/fix-generated-fetcher.mjs'],
  },
}

export default config
