import { ConnectionOptions, NnounceDevice, NnounceScriptingApi } from "./nnounceScriptingApi.ts";

/**
 * Tries to connect to the nnounce device. If successful, an instance of {@link NnounceScriptingApi} is returned.
 *
 * @param hostname Hostname or IP address of the device.
 * @param apiKey API key to be used for authentication (can be null).
 * @param connectionOptions Connection options object
 */
export function connectDevice(hostname: string, apiKey: string | null, connectionOptions?: ConnectionOptions): NnounceScriptingApi {
	return new NnounceDevice(hostname, apiKey, connectionOptions);
}
