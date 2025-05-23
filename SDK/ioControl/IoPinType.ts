/**
 * Represents the different types of I/O pins that can be configured in a hardware interface.
 *
 * Enum IoPinType provides a set of predefined constants to define the type of the pin.
 *
 * Types include:
 * - CONTROL: Represents a pin configured for control operations with set direction (input or output).
 * - GPIO: Represents a pin configured as a General Purpose Input/Output (GPIO) which can be dynamically switched between input and output.
 */
export enum IoPinType {
	CONTROL = "control",
	GPIO = "gpio"
}
