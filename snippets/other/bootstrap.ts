// bootstrap ts serves as a point to globally read and set environment variables.
import { toFileUrl } from "std/path/mod.ts";
import { nnounceDevice } from "jsr:@nnounce/scripting-api";

const entry = Deno.args[0];
if (!entry) {
  throw new Error("❗ No entry file passed to bootstrap.");
}

const entryUrl = toFileUrl(entry);
const nnApi = await nnounceDevice().connectionPromise();
globalThis.nnApi = nnApi;
const { default: main } = await import(entryUrl.href);
