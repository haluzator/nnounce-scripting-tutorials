// bootstrap ts serves as a point to globally read and set environment variables.
import { toFileUrl } from "std/path/mod.ts";
import { nnounceDevice } from "nnounceDevice";

const entry = Deno.args[0];
if (!entry) {
  throw new Error("❗ No entry file passed to bootstrap.");
}

const entryUrl = toFileUrl(entry);
// nnApi gets underlined as an error, because property 'nnApi' does not exist on globalThis.
// That is correct, we are setting it now and you can ignore the error.
// Javascript and Deno runtime will handle it and snippets will run without problems.
const nnApi = await nnounceDevice().connectionPromise();
globalThis.nnApi = nnApi;
const { default: main } = await import(entryUrl.href);
