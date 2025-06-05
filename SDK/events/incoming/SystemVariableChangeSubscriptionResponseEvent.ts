import { INnounceClientResultEvent } from "../INnounceClientResultEvent.ts";

/**
 * Represents the response event for a subscription to system variable changes.
 *
 * This interface is used to handle events emitted when there is a change in
 * system variables that the client has subscribed to. It provides access to
 * the updated system variables as a map of key-value pairs.
 *
 * Extends:
 * - `INnounceClientResultEvent`: Base interface for client result events.
 *
 * Properties:
 * - `data`: A map containing the updated system variables. The map's keys
 * represent the variable names, while the values represent their updated values.
 */
export interface SystemVariableChangeSubscriptionResponseEvent extends INnounceClientResultEvent {
	data: Map<string, string>;
}