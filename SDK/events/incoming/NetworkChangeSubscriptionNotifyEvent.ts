import { IEvent } from "../IEvent.ts";
import { NetworkStatusDto } from "./NnounceStatusEvent.ts";

/**
 * Represents an event triggered when there is a change in network configuration.
 * This event provides updated network status information and associated response tags.
 *
 * @interface NetworkChangeSubscriptionNotifyEvent
 * @extends IEvent
 *
 * @property {Array<NetworkStatusDto>} network - An array containing information about the current network status or changes.
 * @property {Array<string>} responseTags - An array of response tags that are associated with the event notification.
 */
export interface NetworkChangeSubscriptionNotifyEvent extends IEvent {
	network: Array<NetworkStatusDto>;
	responseTags: Array<string>;
}