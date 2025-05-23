import { Supplier } from "./FunctionalInterfaces.ts";

export class RetryUtil {

	/**
	 * Asynchronously runs a process with retry logic which return T.
	 * @param processInfo - Error message
	 * @param process - A function that returns a Promise of generic type T representing the process to be executed.
	 * @param retryCount - The maximum number of retry attempts. Default is -1 -> infinite
	 * @param  retryDelayMs - The delay in milliseconds between retry attempts. Default is 1000
	 * @returns {Promise<T>} A Promise that resolves with the generic <T> result of the process.
	 * @throws {Error} If the process fails after all retry attempts.
	 */
	public static async runAsync<T>(processInfo: string, process: Supplier<Promise<T>>, retryCount: number = -1, retryDelayMs = 1000): Promise<T> {
		while(true) {
			try {
				return await process();
			} catch (e) {
				if (retryCount > 0) {
					retryCount--;
				}
				if (retryCount == 0) {
					throw e;
				}
				console.error(`Error during run process: '${processInfo}'. Next attempt in ${retryDelayMs}ms. ${retryCount > 0 ? "Remain " + retryCount+" attempt(s) " : ""}. Error: `, e);
				await new Promise<void>(resolve => setTimeout(() => resolve(), retryDelayMs));
			}
		}
	}
}