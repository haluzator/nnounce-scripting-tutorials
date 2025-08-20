import { ANnDspComponent } from "./NnDspComponent.ts";
import { NnComponentName } from "./NnComponentName.ts";
import { WebSocketCommunication } from "../../communication/WebSocketCommunication.ts";
import { NnLoggerConfig } from "../../utils/LoggerUtil.ts";
import { DesignUtil } from "../DesignUtil.ts";

/**
 * Represents a network receive component that extends the base `ANnDspComponent` class.
 * This component is responsible for managing network receive functionality
 * while supporting WebSocket communication and logging configurations.
 *
 * @extends ANnDspComponent
 */
export class NnNetRxComponent extends ANnDspComponent {

	/**
	 * Constructs an instance of the class with the specified component ID, WebSocket communication instance, and logger configuration.
	 *
	 * @param {number|string} componentId - The unique identifier for the component, which can be either a number or a string.
	 * @param {WebSocketCommunication} webSocket - The WebSocket communication instance used for network communication.
	 * @param {DesignUtil} designUtil - Device design util.
	 * @param {NnLoggerConfig} loggerConfig - The configuration object for the logger to manage logging behavior.
	 */
	constructor(componentId: number | string, webSocket: WebSocketCommunication, designUtil: DesignUtil, loggerConfig: NnLoggerConfig) {
		super(componentId, NnComponentName.NET_RX_COMPONENT_NAME, webSocket, designUtil, loggerConfig);
	}

}