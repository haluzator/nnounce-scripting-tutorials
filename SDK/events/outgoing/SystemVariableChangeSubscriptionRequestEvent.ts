import { INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";

/**
 * Represents an event for subscribing to system variable change notifications.
 * This event requires the specification of a response tag to indicate the subscription's context.
 *
 * It extends the `INnounceClientRequestEvent` interface, which provides the base structure for client request events.
 *
 * The primary purpose of this event is to allow clients to subscribe to system variable changes.
 */
export interface SystemVariableChangeSubscriptionRequestEvent extends INnounceClientRequestEvent {
	responseTag: string
}