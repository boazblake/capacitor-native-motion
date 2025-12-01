import { registerPlugin } from '@capacitor/core';
export * from './definitions';
export const Motion = registerPlugin('Motion', {
    web: () => ({
        // Optional web fallback (browser events); can be omitted.
        async start() { },
        async stop() { },
        async calibrateYaw() { },
        async addListener() { return { remove: () => { } }; },
        async removeAllListeners() { }
    })
});
//# sourceMappingURL=index.js.map