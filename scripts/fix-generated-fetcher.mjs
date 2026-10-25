import { readFileSync, writeFileSync } from 'node:fs'

// Codegen's react-query plugin emits `import type { fetchGraphQL }` when
// useTypeImports is enabled, but the fetcher is a runtime value. Rewrite that
// single import to a value import so the generated hooks can call it.
const file = 'src/graphql/generated/graphql.ts'
const source = readFileSync(file, 'utf8')
const fixed = source.replace(
  /import type \{ fetchGraphQL \} from '\.\.\/fetcher';/,
  "import { fetchGraphQL } from '../fetcher';",
)

if (fixed !== source) {
  writeFileSync(file, fixed)
  console.log('fix-generated-fetcher: patched fetcher import')
}
