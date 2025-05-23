import { RuntimeUpdateComponentData } from "../dto/DspDesign.ts";
import { IEvent } from "../IEvent.ts";

/**
 * Represents an event notification for a change in the design runtime.
 * It carries the updated data and relevant response tags.
 *
 * @interface DesignRuntimeChangedSubscriptionNotifyEvent
 * @extends IEvent
 *
 * @property {Array<RuntimeUpdateComponentData>} data - An array containing updated runtime component data.
 * @property {Array<string>} responseTags - An array of response tags associated with the event notification.
 */
export interface DesignRuntimeChangedSubscriptionNotifyEvent extends IEvent{
	data: Array<RuntimeUpdateComponentData>
	responseTags: Array<string>
}