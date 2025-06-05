import { INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";
import { IPollSubscriptionEvent } from "../IPollSubscriptionEvent.ts";

/**
 * Represents an event that subscribes for IO pin state changes.
 *
 * The `IoPinStatePollSubscriptionRequestEvent` interface extends the functionality of
 * `INnounceClientRequestEvent` and `IPollSubscriptionEvent`, inheriting the basic structure
 * and behavior required for client request events and polling subscriptions.
 *
 * This interface does not include additional properties beyond those inherited.
 */
export interface IoPinStatePollSubscriptionRequestEvent extends INnounceClientRequestEvent, IPollSubscriptionEvent {
}