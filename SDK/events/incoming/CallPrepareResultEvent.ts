import { IEvent } from "../IEvent.ts";

/**
 * Represents the result of a call preparation in the system.
 * This event extends the base `IEvent` interface and provides additional details
 * regarding the outcome of the call preparation process.
 *
 * The `CallPrepareResultEvent` includes an identifier for the associated action
 * and a reason for failure, if applicable.
 *
 * @interface CallPrepareResultEvent
 * @extends IEvent
 *
 * @property {string} actionId - The unique identifier associated with the action being prepared.
 * @property {string} failReason - A description of the reason for the failure, if the preparation was unsuccessful.
 */
export interface CallPrepareResultEvent extends IEvent {
	actionId: string;
	failReason: string;
}