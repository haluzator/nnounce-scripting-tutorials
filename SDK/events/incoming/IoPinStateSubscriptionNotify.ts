import { IEvent } from "../IEvent.ts";
import { IoPinType } from "../../ioControl/IoPinType.ts";
import { IoPinMode } from "../../ioControl/IoPinMode.ts";

export interface IoPinStateSubscriptionNotify extends IEvent {
	states: Array<IoControl>;
	responseTags: Array<string>;
}

/**
 * Represents the configuration and control of an I/O pin.
 *
 * This interface defines a structure for managing I/O pins, including their type, mode, pin number, and value.
 *
 * Properties:
 * - pinType: Specifies the type of I/O pin.
 * - pinMode: Defines the mode of the pin, such as input or output.
 * - pin: The number of the pin.
 * - value: The current state or value of the pin (e.g., HIGH/LOW or analog value).
 */
export interface IoControl {
	pinType: IoPinType,
	pinMode: IoPinMode,
	pin: number,
	value: number
}