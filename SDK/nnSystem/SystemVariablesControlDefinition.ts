import { WebSocketCommunication } from "../communication/WebSocketCommunication.ts";
import { SystemVariableChangeNotifyEvent } from "../events/incoming/SystemVariableChangeNotifyEvent.ts";
import { SystemVariableChangeSubscriptionResponseEvent } from "../events/incoming/SystemVariableChangeSubscriptionResponseEvent.ts";
import { createRequestId } from "../events/INnounceClientRequestEvent.ts";
import { SystemVariableChangeSubscriptionRequestEvent } from "../events/outgoing/SystemVariableChangeSubscriptionRequestEvent.ts";
import { logger } from "../utils/LoggerUtil.ts";

/**
 * System variables control to manage variables from server
 */
export class SystemVariablesControlDefinition {
	private static INSTANCE: SystemVariablesControlDefinition;

	private webSocket: WebSocketCommunication;
	private systemVariablesMap: Map<string, string>;
	private initialized: boolean = false;

	/**
	 * Private constructor for initializing the instance with WebSocket communication and system variables map.
	 *
	 * @param {WebSocketCommunication} webSocket - The WebSocket communication instance for handling WebSocket connections.
	 * @param {Map<string, string>} systemVariablesMap - A map containing key-value pairs of system variables.
	 */
	private constructor(webSocket: WebSocketCommunication, systemVariablesMap: Map<string, string>) {
		this.webSocket = webSocket;
		this.systemVariablesMap = systemVariablesMap;
	}

	/**
	 * Returns the singleton instance of the SystemVariablesControlDefinition.
	 * If the instance does not exist, it creates one using the provided WebSocketCommunication.
	 *
	 * @param {WebSocketCommunication} webSocket - The WebSocketCommunication object used to initialize the instance if it does not exist.
	 * @return {SystemVariablesControlDefinition} The singleton instance of the SystemVariablesControlDefinition.
	 */
	public static getInstance(webSocket: WebSocketCommunication) {
		if (!this.INSTANCE) {
			this.INSTANCE = new SystemVariablesControlDefinition(webSocket, new Map());
		}
		return this.INSTANCE;
	}

	/**
	 * Initialize system variables control instance and set current system variables to map
	 */
	public static async initInstance() {
		if (this.INSTANCE.initialized) {
			return;
		}
		try {
			const requestEvent: SystemVariableChangeSubscriptionRequestEvent = {
				type: "systemVariableChangeSubscriptionRequest",
				requestId: createRequestId(),
				responseTag: "deno-script-api"
			}
			const response = await this.INSTANCE.webSocket.sendEventWithResponse<SystemVariableChangeSubscriptionResponseEvent, SystemVariableChangeSubscriptionRequestEvent>(requestEvent, true);

			this.INSTANCE.systemVariablesMap = new Map(Object.entries(response.data));
			this.INSTANCE.webSocket.addEventHandler("systemVariableChangeNotify", (event) => this.INSTANCE.systemVariableChange(event as SystemVariableChangeNotifyEvent))
			this.INSTANCE.initialized = true;
		} catch (e) {
			logger.error("Error during init system variable control. Error: ", String(e));
			throw e;
		}
	}

	/**
	 * Get variable value by name
	 * @param name
	 */
	public get(name: string): string | undefined {
		return this.getVariableValue(name);
	}

	/**
	 * Get system variable value.
	 * If system variables wasn't initialized before, then load all system variables before return value
	 * @param name
	 * @private
	 */
	private getVariableValue(name: string): string | undefined {
		return this.systemVariablesMap.get(name);
	}

	/**
	 * Handle processing system variable change event
	 * @param event
	 * @private
	 */
	private systemVariableChange(event: SystemVariableChangeNotifyEvent) {
		if (event.value == null) {
			this.systemVariablesMap.delete(event.name);
		} else {
			this.systemVariablesMap.set(event.name, event.value);
		}
	}
}
