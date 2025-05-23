import { IEvent } from "./IEvent.ts";

/**
 * Interface for incoming events, which are response for request.
 */
export interface INnounceClientResultEvent extends IEvent  {
	/**
	 * Unique request identifier to pair request with response.
	 */
	requestId: string;
	/**
	 * Request result. It can have value OK or FAILED.
	 */
	state: string; // OK, FAILED
	/**
	 * Reason of the request fail, if applicable.
	 */
	failReason: string;
}