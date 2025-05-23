/**
 * Nnounce useful utils
 */
export class NnUtilDefinition {
	private static INSTANCE: NnUtilDefinition;

	private constructor() {
		// no code
	}

	/**
	 * Return singleton instance
	 */
	public static getInstance() {
		if (!this.INSTANCE) {
			this.INSTANCE = new NnUtilDefinition();
		}
		return this.INSTANCE;
	}

	/**
	 * Try to convert string value to number.
	 * If value is not a number, then the returned result is 'undefined'
	 * @param stringValue
	 */
	public toNumber(stringValue: string): number|undefined {
		if (!stringValue) {
			return undefined;
		}
		const numberValue = Number(stringValue);
		if (isNaN(numberValue)) {
			console.warn(`Value is not a number`);
			return undefined;
		}
		return numberValue
	}

	/**
	 * Try to convert string value to boolean.
	 * If value is not 'true' or 'false', then the returned result is 'undefined'
	 * @param stringValue
	 */
	public toBoolean(stringValue: string): boolean|undefined {
		if (!stringValue) {
			return undefined;
		}

		if (stringValue.toLowerCase() === "false") {
			return false;
		}
		if (stringValue?.toLowerCase() === "true") {
			return true
		}
		console.warn(`Value is not a boolean`);
		return undefined;
	}

	/**
	 * The sleep method pauses execution for a specified duration.
	 * @param durationMs
	 */
	public sleep(durationMs: number) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(void 0)
			}, durationMs)
		})
	}
}
