import { IEvent } from "../IEvent.ts";

/**
 * Represents an event sent to start a call. A unique identifier for the call's action id to
 * start the call is provided.
 *
 * @interface CallStartEvent
 * @extends IEvent
 *
 * @property {string} actionId - A unique identifier representing the call.
 */
export interface CallStartEvent extends IEvent {
	actionId: string;
}

/**
 * Creates a CallStartEvent object with the specified action ID.
 *
 * @param {string} actionId - The unique identifier associated with the call.
 * @return {CallStartEvent} An object representing the call start event, including the action ID and event type.
 */
export function createCallStartEvent(actionId: string): CallStartEvent {
	return {
		actionId: actionId,
		type: "callStartEvent"
	}
}