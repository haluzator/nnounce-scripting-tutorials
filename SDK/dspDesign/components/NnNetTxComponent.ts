import { ANnDspComponent } from "./NnDspComponent.ts";
import { NnComponentName } from "./NnComponentName.ts";
import { WebSocketCommunication } from "../../communication/WebSocketCommunication.ts";
import { NnLoggerConfig } from "../../utils/LoggerUtil.ts";

/**
 * Represents a network transmit component that extends the base `ANnDspComponent` class.
 * This component is responsible for managing network transmit functionality
 * while supporting WebSocket communication and logging configurations.
 *
 * @extends ANnDspComponent
 */
export class NnNetTxComponent extends ANnDspComponent {

	/**
	 * Constructs an instance of the class by initializing the necessary properties and calling the superclass constructor.
	 *
	 * @param {number|string} componentId - The unique identifier for the component.
	 * @param {WebSocketCommunication} webSocket - The WebSocket communication instance to be used for this component.
	 * @param {NnLoggerConfig} loggerConfig - The configuration settings for the logger.
	 */
	constructor(componentId: number | string, webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig) {
		super(componentId, NnComponentName.NET_TX_COMPONENT_NAME, webSocket, loggerConfig);
	}

}