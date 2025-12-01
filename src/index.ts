import { registerPlugin } from '@capacitor/core'
import type { MotionPlugin } from './definitions'

export * from './definitions'

export const Motion = registerPlugin<MotionPlugin>('Motion', {
  web: () => ({
    // Optional web fallback (browser events); can be omitted.
    async start() {},
    async stop() {},
    async calibrateYaw() {},
    async addListener() { return { remove: () => {} } },
    async removeAllListeners() {}
  })
})
