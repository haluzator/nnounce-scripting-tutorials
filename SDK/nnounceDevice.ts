import { ConnectionOptions, NnounceScriptingApi } from "./nnounceScriptingApi.ts";
import { API_KEY, HOSTNAME } from "./communication/getUrlAddress.ts";
import { connectDevice } from "./nnounceConnector.ts";

/**
 * Tries to connect to the nnounce device. If successful, an instance of {@link NnounceScriptingApi} is returned.
 *
 * Hostname and api-key are searched for environment variables as {@link HOSTNAME} and {@link API_KEY} respectively:
 * If no hostname is provided, "localhost" is used.
 * If no api-key is provided, null is used.
 *
 * @param connectionOptions Connection options object
 */
export function nnounceDevice(connectionOptions?: ConnectionOptions): NnounceScriptingApi {
	// @ts-ignore Deno - couldn't generate typings file
	const hostname = Deno.env.has(HOSTNAME) ? Deno.env.get(HOSTNAME) : "localhost";
	// @ts-ignore Deno - couldn't generate typings file
	const apiKey = Deno.env.has(API_KEY) ? Deno.env.get(API_KEY) : null;
	return connectDevice(hostname, apiKey, connectionOptions);
}
