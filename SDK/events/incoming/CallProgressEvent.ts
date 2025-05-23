import { IEvent } from "../IEvent.ts";

/**
 * Interface representing a call progress event.
 * This event contains information about the current progress of a call.
 *
 * @interface CallProgressEvent
 * @extends IEvent
 *
 * @property {string} actionId - The unique identifier associated with the call being processed.
 * @property {CallProgressStatus} state - A state of the call.
 * @property {Map<string, string>} undeliveredOutputs - A map of output IDs and reasons why the call was not played in them.
 */
export interface CallProgressEvent extends IEvent {
	actionId: string;
	state: CallProgressStatus;
	undeliveredOutputs: Map<string /*outputId*/, string /*undeliveredReason*/>
}

/**
 * Enum representing the different statuses for call progress.
 *
 * This enum is used to define constants that represent the progress status of a call.
 *
 * Enum members:
 * - PARTIAL: Indicates that the call is playing, but was not delivered to all outputs.
 * - PLAYING: Indicates that the call is playing to all outputs.
 *
 */
export enum CallProgressStatus {
	PARTIAL = "PARTIAL",
	PLAYING = "PLAYING",
}