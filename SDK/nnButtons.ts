import { Consumer } from "./utils/FunctionalInterfaces.ts";
import { logger } from "./utils/LoggerUtil.ts";
import { ButtonStates } from "./buttons/ButtonStates.ts";


/**
 * Control for button in momentary mode.
 */
type MomentaryButtonControl = {
	/**
	 * Represents a callback function that will be executed when an associated
	 * button press event occurs.
	 *
	 * @type {function}
	 * @param {function} onPressCb - A callback function to be invoked when the press action is triggered.
	 *                               The callback accepts no parameters and returns no value.
	 */
	onPress: { (onPressCb: { (): void }): void };
	/**
	 * Represents a callback function that will be executed when an associated
	 * button release event occurs.
	 *
	 * @type {function}
	 * @param {function} onReleaseCb - A callback function to be invoked when the release action is triggered.
	 *                               	The callback accepts no parameters and returns no value.
	 */
	onRelease: { (onReleaseCb: { (): void }): void };
	/**
	 * Retrieves a boolean value, <true> if associated button is pressed.
	 *
	 * @returns {boolean} A boolean value indicating if button is pressed.
	 */
	getValue: () => boolean;
}

/**
 * Control for button in toggle mode.
 */
type ToggleButtonControl = {
	/**
	 * Callback function that is triggered when a change event occurs.
	 *
	 * @param {Function} onChangeCb - The callback function to handle the change event.
	 * @param {boolean} onChangeCb.value - The boolean value indicating the state after the change event.
	 * @returns {void} This function does not return any value.
	 */
	onChange: { (onChangeCb: { (value: boolean): void }): void };
	/**
	 * Retrieves a boolean value, <true> if associated button is pressed.
	 *
	 * @returns {boolean} A boolean value indicating if button is pressed.
	 */
	getValue: () => boolean;
}

export class NnButtonsDefinition {
	private static INSTANCE: NnButtonsDefinition;

	private buttonStates: ButtonStates;

	private constructor(buttonStates: ButtonStates) {
		this.buttonStates = buttonStates;
	}

	/**
	 * Return singleton instance
	 */
	public static getInstance(buttonStates: ButtonStates) {
		if (!this.INSTANCE) {
			this.INSTANCE = new NnButtonsDefinition(buttonStates);
		}
		return this.INSTANCE;
	}

	/**
	 * Retrieves an array containing the names of available buttons.
	 *
	 * @return {Array<string>} An array of available button names.
	 */
	public names(): Array<string> {
		return this.buttonStates.getButtonNames();
	}

	/**
	 * Returns control for button in momentary mode.
	 * @param buttonName Name of button to be controlled.
	 */
	public momentary(buttonName: string): MomentaryButtonControl {
		if (buttonName && !buttonName.toLowerCase().startsWith("ptt")) {
			logger.warn(`Button ${buttonName} is not configured in momentary mode!`);
		}
		return {
			getValue(): boolean {
				return this.buttonStates.getButtonActive(buttonName);
			},
			onPress: (onPressCb) => {
				this.reactOnButtonState(buttonName, active => {
					if (active) {
						onPressCb();
					}
				})
			},
			onRelease: (onReleaseCb) => {
				this.reactOnButtonState(buttonName, active => {
					if (!active) {
						onReleaseCb();
					}
				})
			}
		}
	}

	/**
	 * Returns control for button in toggle mode.
	 * @param buttonName Name of button to be controlled.
	 */
	public toggle(buttonName: string): ToggleButtonControl {
		if (buttonName && buttonName.toLowerCase().startsWith("ptt")) {
			logger.warn(`Button ${buttonName} is not configured in toggle mode!`);
		}
		return {
			getValue(): boolean {
				return this.buttonStates.getButtonActive(buttonName);
			},
			onChange: (onChangeCb) => {
				this.reactOnButtonState(buttonName, onChangeCb)
			}

		}
	}

	private reactOnButtonState(buttonName: string, changeCallback: Consumer<boolean>) {
		return this.buttonStates.onButtonChange(buttonName, changeCallback);
	}

	private getButtonState(buttonName: string): boolean {
		return this.buttonStates.getButtonActive(buttonName);
	}
}