import { IEvent } from "./IEvent.ts";

/**
 * Interface for outgoing request events, which expects response with result.
 */
export interface INnounceClientRequestEvent extends IEvent {
	/**
	 * Unique request identifier, which is sent back in the response event to pair request and response.
	 */
	requestId: string;
}

/**
 * Generates a unique request identifier string.
 *
 * Combines a fixed prefix, the current timestamp, and a randomly generated string segment
 * to produce a unique ID suitable for tracking requests or transactions.
 *
 * @return {string} A unique request ID string.
 */
export function createRequestId(): string {
	return `nnScriptApi__${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
}