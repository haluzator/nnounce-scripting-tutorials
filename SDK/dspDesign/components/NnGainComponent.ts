import { ANnDspComponent } from "./NnDspComponent.ts";
import { NnComponentName } from "./NnComponentName.ts";
import { WebSocketCommunication } from "../../communication/WebSocketCommunication.ts";
import { NnLoggerConfig } from "../../utils/LoggerUtil.ts";
import { DesignUtil } from "../DesignUtil.ts";

/**
 * Represents a gain component extending the base `ANnDspComponent`.
 *
 * The `NnGainComponent` is identified by a unique `id` and relies on a WebSocket communication
 * layer for managing interactions and a logger configuration for operational monitoring.
 *
 * Class Inheritance:
 * - Extends the abstract base class `ANnDspComponent`.
 *
 * Constructor Parameters:
 * - `id`: A unique identifier for the component. Can be of type number or string.
 * - `webSocket`: An instance of `WebSocketCommunication` for managing communication.
 * - `loggerConfig`: An instance of `NnLoggerConfig` used to configure logging for the component.
 */
export class NnGainComponent extends ANnDspComponent {

	/**
	 * Creates an instance of the GainComponent class.
	 *
	 * @param {number | string} id - The unique identifier for the component.
	 * @param {WebSocketCommunication} webSocket - The WebSocket communication instance for handling data exchange.
	 * @param {designUtil} designUtil - Device design util
	 * @param {NnLoggerConfig} loggerConfig - The configuration object for the logger.
	 */
	constructor(id: number | string, webSocket: WebSocketCommunication, designUtil: DesignUtil, loggerConfig: NnLoggerConfig) {
		super(id, NnComponentName.GAIN_COMPONENT_NAME, webSocket, designUtil, loggerConfig);
	}

}