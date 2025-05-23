// bootstrap ts serves as a point to globally read and set environment variables.
import { toFileUrl } from "std/path/mod.ts";
import { nnounceDevice } from "nnounceDevice";

// cannot use dotenv's load function, because our .env file contains variable with dash in its name - that is not valid.
const envFile = await Deno.readTextFile("../.env");

for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const [key, ...rest] = trimmed.split("=");
  if (!key || rest.length === 0) continue;

  const value = rest.join("=").trim().replace(/^["']|["']$/g, "");
  Deno.env.set(key.trim(), value);
}


const entry = Deno.args[0];
if (!entry) {
  throw new Error("❗ No entry file passed to bootstrap.");
}

const entryUrl = toFileUrl(entry);
const nnApi = await nnounceDevice().connectionPromise();
globalThis.nnApi = nnApi;
const { default: main } = await import(entryUrl.href);
