import { WebSocketCommunication } from "./communication/WebSocketCommunication.ts";
import { IoPinOutputSetRawEvent } from "./events/outgoing/IoPinOutputSetRawEvent.ts";
import { IOControlStates } from "./ioControl/IOControlStates.ts";
import { IoPinType } from "./ioControl/IoPinType.ts";
import { logger, NnLoggerConfig } from "./utils/LoggerUtil.ts";

/**
 * Represents a control interface for output pin in digital mode.
 */
export type DigitalOutputPinControl = {
	/**
	 * Returns the state of the control pin based on the detected voltage.
	 *
	 * If the voltage at the control pin is at least 60% of the reference voltage, this method
	 * returns ```true```; otherwise, it returns ```false```.
	 */

	getValue: { (): boolean };
	/**
	 * Sets the control pin state based on the provided boolean value.
	 *
	 * If ```true``` is passed, the control pin is set to the rail voltage. If ```false``` is passed,
	 * the control pin is set to 0 volts.
	 *
	 * @param value the desired state of the control pin
	 */
	setValue: { (value: boolean): void };
}

/**
 * Represents a control interface for output pin in relay mode.
 */
export type RelayOutputPinControl = {
	/**
	 * Opens the relay, setting its state to open.
	 *
	 * This method activates the relay, allowing the circuit to be broken (i.e., no current flows through).
	 */
	open: { (): void };
	/**
	 * Closes the relay, setting its state to closed.
	 *
	 * This method activates the relay to complete the circuit, allowing current to flow through.
	 */
	close: { (): void };
	/**
	 * Checks if the relay is currently open.
	 *
	 * @return ```true``` if the relay is open (circuit is broken), ```false``` otherwise.
	 */
	isOpen: { (): boolean };
	/**
	 * Checks if the relay is currently closed.
	 *
	 * @return ```true``` if the relay is closed (circuit is complete), ```false``` otherwise.
	 */
	isClosed: { (): boolean };
}

/**
 * Fixed pins - hardcoded in hardware and cannot be changed
 *
 * outputs:
 * - digital | analog | relay
 */
export class NnControlOutputsDefinition {
	private static INSTANCE: NnControlOutputsDefinition;

	private webSocket: WebSocketCommunication;
	private loggerConfig: NnLoggerConfig;
	private ioControlStates: IOControlStates;

	private constructor(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig, ioControlStates: IOControlStates) {
		this.webSocket = webSocket;
		this.ioControlStates = ioControlStates;
	}

	/**
	 * Return singleton instance
	 */
	public static getInstance(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig, ioControlStates: IOControlStates) {
		if (!this.INSTANCE) {
			this.INSTANCE = new NnControlOutputsDefinition(webSocket, loggerConfig, ioControlStates);
		}
		return this.INSTANCE;
	}

	/**
	 * digital:
	 * - \>=0.6 - pin is high (has rail voltage) - true
	 * - 0.0 - pin is low (has 0 voltage) - false
	 * @param pin numbered from 1
	 */
	public digital(pin: number): DigitalOutputPinControl {
		return {
			getValue: () => this.getOutputValue(pin) >= 0.6,
			setValue: (value) => this.setOutputValue(pin, value ? 1 : 0)
		}
	}

	/**
	 * relay SPST On-Off:
	 * - 1.0 - relay is closed
	 * - 0.0 - relay is open
	 *
	 * relay SPDT On-On:
	 * - 1.0 - relay is closed (C connected to NO)
	 * - 0.0 - relay is open (C connected to NC)
	 * @param pin numbered from 1
	 */
	public relay(pin: number): RelayOutputPinControl {
		return {
			open: () => this.setOutputValue(pin, 0),
			close: () => this.setOutputValue(pin, 1),
			isOpen: () => this.getOutputValue(pin) == 0,
			isClosed: () => this.getOutputValue(pin) == 1
		}
	}

	private setOutputValue(pin: number, value: number): void {
		const ioPinOutputSet: IoPinOutputSetRawEvent = {
			type: "ioPinOutputSetRawEvent",
			pinType: IoPinType.CONTROL,
			pin: pin,
			value: value
		}
		this.webSocket.sendEvent(ioPinOutputSet);
	}

	private getOutputValue(pin: number): number {
		const output = this.ioControlStates.getOutputValue(pin);
		if (output == null) {
			this.loggerConfig.isEnabledInternal() && logger.warn(`Output pin '${pin}' was not found`);
			return 0;
		}
		return output.value;
	}
}

