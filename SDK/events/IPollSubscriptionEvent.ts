import { ISubscriptionEvent } from "./ISubscriptionEvent.ts";

/**
 * Represents an event for subscription notifications.
 * Extends the functionality of a base subscription event to include
 * additional properties specific to poll-based notifications.
 */
export interface IPollSubscriptionEvent extends ISubscriptionEvent {
	/**
	 * Interval in milliseconds between notifications specified by this subscription
	 */
	dataEveryMs: number;
}