import { INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";
import { ISubscriptionEvent } from "../ISubscriptionEvent.ts";

/**
 * Represents an event for a subscription to runtime design changes.
 * This interface extends both INnounceClientRequestEvent and ISubscriptionEvent, encapsulating
 * the properties and behaviors of these base types related to a design runtime change.
 *
 * @interface DesignRuntimeChangedSubscriptionRequestEvent
 * @extends INnounceClientRequestEvent
 * @extends ISubscriptionEvent
 *
 * @property {Array<string>} componentNames - A list of component names for which we want to be notified about runtime changes.
 */
export interface DesignRuntimeChangedSubscriptionRequestEvent extends INnounceClientRequestEvent, ISubscriptionEvent {
	componentNames: Array<string> // set
}