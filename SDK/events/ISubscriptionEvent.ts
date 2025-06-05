import { IEvent } from "./IEvent.ts";

/**
 * Represents a subscription event in the system.
 */
export interface ISubscriptionEvent extends IEvent {
	/**
	 * If the value is 0, the subscription will remain active until the websocket is disconnected.
	 * Otherwise, the subscription will be removed if another subscription request is not sent before this value timeout.
	 */
	keepAliveMs: number;
	/**
	 * Subscription tag to indicate the intended recipient.
	 */
	responseTag: string;
}