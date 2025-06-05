import { IEvent } from "../IEvent.ts";
import { IoPinType } from "../../ioControl/IoPinType.ts";

/**
 * Represents an event for setting the raw output value of an I/O pin.
 *
 * This event is used to configure or alter the state of a specific I/O pin,
 * allowing for direct manipulation of the pin's output.
 *
 * The `IoPinOutputSetRawEvent` contains the following properties:
 * - `pinType`: Specifies the type of the I/O pin.
 * - `pin`: Indicates the pin number being targeted by this event, numbered from 1.
 * - `value`: Represents the raw value to set for the specified pin (e.g., HIGH or LOW state).
 *
 * This interface extends the `IEvent` base interface, inheriting the general structure for event objects.
 */
export interface IoPinOutputSetRawEvent extends IEvent {
	pinType: IoPinType;
	pin: number;
	value: number;
}