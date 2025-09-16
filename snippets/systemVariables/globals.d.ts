// globals.d.ts (or put at top of bootstrap.ts)

import type { nnounceDevice } from "jsr:@nnounce/scripting-api"; 
// adjust the import so it matches the actual type returned by `await nnounceDevice().connectionPromise()`

declare global {
  // This augments the `globalThis` type
  var nnApi: Awaited<ReturnType<typeof nnounceDevice>>;
}

// This ensures the file is treated as a module
export {};
