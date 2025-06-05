import { IEvent } from "../IEvent.ts";

/**
 * Represents an event that notifies when a system variable changes.
 *
 * This interface extends the `IEvent` interface and provides specific details
 * regarding the name and the new value of the changed system variable.
 *
 * The `name` property holds the name of the system variable that was modified,
 * and the `value` property contains its updated value.
 *
 */
export interface SystemVariableChangeNotifyEvent extends IEvent {
	name: string;
	value: string;
}