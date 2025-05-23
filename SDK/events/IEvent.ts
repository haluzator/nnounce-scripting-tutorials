/**
 * Represents a general event with a specific type.
 *
 * This interface is a base or contract for implementing
 * events driving this API.
 *
 * @interface IEvent
 */
export interface IEvent {
	/**
	 * Specific event type.
	 */
	type: string;
}