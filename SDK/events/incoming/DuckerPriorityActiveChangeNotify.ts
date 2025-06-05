import { IEvent } from "../IEvent.ts";

/**
 * Represents the notification event triggered when there is an update regarding the priority input active status
 * for a specific component in the Ducker system.
 *
 * This interface extends IEvent and provides additional information about the affected component,
 * its priority input status, and any related response tags.
 *
 * Members:
 * @property {number} componentId - A unique identifier for the component associated with the notification.
 * @property {boolean} priorityActive - Indicates whether the priority input for the specified component is active (true) or inactive (false).
 * @property {Array<string>} responseTags - An array of response tags associated with the notification, providing additional context or metadata.
 */
export interface DuckerPriorityActiveChangeNotify extends IEvent {
	componentId: number;
	priorityActive: boolean;
	responseTags: Array<string>;
}