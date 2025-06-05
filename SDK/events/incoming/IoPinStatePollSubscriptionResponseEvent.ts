import { INnounceClientResultEvent } from "../INnounceClientResultEvent.ts";
import { IoControl } from "./IoPinStateSubscriptionNotify.ts";

/**
 * Represents an event response for subscription to state of I/O pins
 * in a subscription-based system.
 *
 * This event extends the base interface `INnounceClientResultEvent`
 * and provides additional information about the states of multiple
 * I/O pins as part of the polling response.
 *
 * @interface IoPinStatePollSubscriptionResponseEvent
 * @extends INnounceClientResultEvent
 *
 * @property {Array<IoControl>} states - An array containing the state information
 * of I/O pins in the form of `IoControl` instances.
 */
export interface IoPinStatePollSubscriptionResponseEvent extends INnounceClientResultEvent {
	states: Array<IoControl>;
}