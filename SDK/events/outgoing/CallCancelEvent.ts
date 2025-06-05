import { IEvent } from "../IEvent.ts";

/**
 * Represents an event sent when cancelling a call.
 *
 * This interface extends the base IEvent interface and includes
 * an actionId property used to identify the specific action to cancel.
 */
export interface CallCancelEvent extends IEvent {
	actionId: string;
}

/**
 * Creates a CallCancelEvent object with the given action ID.
 *
 * @param {string} actionId - The unique identifier for the action associated with the call cancel event.
 * @return {CallCancelEvent} The created CallCancelEvent object containing the action ID and event type.
 */
export function createCallCancelEvent(actionId: string): CallCancelEvent {
	return {
		actionId: actionId,
		type: "callCancelEvent"
	}
}