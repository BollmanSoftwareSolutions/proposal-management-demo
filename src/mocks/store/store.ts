import { seed } from './seed'
import type { DemoStore } from './types'

let store: DemoStore = seed()

/** Current in-memory store. Resolvers read and mutate this directly. */
export const getStore = (): DemoStore => store

/** Re-seed the store. Backs the UI "reset demo data" action. */
export const resetStore = (): void => {
  store = seed()
}
