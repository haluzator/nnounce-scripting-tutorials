import { IEvent } from "../IEvent.ts";

/**
 * Represents a notification for an SNMP Trap subscription event.
 * This interface extends the base event structure provided by `IEvent`.
 */
export interface SnmpTrapSubscriptionNotify extends IEvent {
	/**
	 * Represents the name or identifier of a trap.
	 */
	trap: string;
	/**
	 * Array of recipient tags.
	 * Subscribers can specify tags when subscribing to later know which notifications are intended for them.
	 */
	responseTags: Array<string>;
}