import { IEvent } from "../IEvent.ts";

/**
 * Represents an event that notifies when a system variable changes.
 *
 * This interface extends the `IEvent` interface and provides specific details
 * regarding the name and the new value of the changed system variable.
 *
 * Map keys hold the names of the system variables that were modified,
 * and the corresponding values contain its updated value.
 *
 */
export interface SystemVariableChangeNotifyEvent extends IEvent {
	data: Map<string, string>;
	fullState: boolean;
}