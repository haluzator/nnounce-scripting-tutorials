/**
 * Enumeration representing the available modes for an I/O pin.
 *
 * This enum is used to define whether an I/O pin is set up for
 * receiving input signals or sending output signals.
 *
 * Members:
 * - INPUT: Indicates that the pin is configured for receiving input.
 * - OUTPUT: Indicates that the pin is configured for sending output.
 */
export enum IoPinMode {
	INPUT = "input",
	OUTPUT = "output"
}