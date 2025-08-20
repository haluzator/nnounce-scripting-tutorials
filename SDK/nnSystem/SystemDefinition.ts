import { WebSocketCommunication } from "../communication/WebSocketCommunication.ts";
import { NnounceStatusEvent } from "../events/incoming/NnounceStatusEvent.ts";
import { createRequestId, INnounceClientRequestEvent } from "../events/INnounceClientRequestEvent.ts";
import { NetworkChangeSubscriptionNotifyEvent } from "../events/incoming/NetworkChangeSubscriptionNotifyEvent.ts";
import { logger } from "../utils/LoggerUtil.ts";

/**
 * The SystemDefinition class provides methods to retrieve system-related information
 * such as firmware version, hardware details, and network status using a WebSocket communication channel.
 */
export class SystemDefinition {
	private webSocket: WebSocketCommunication;
	private status: NnounceStatusEvent;
	private initialized: boolean = false;

	/**
	 * Creates a new instance of SystemDefinition with the provided WebSocket communication channel.
	 *
	 * @param webSocket - The WebSocket communication instance used to interact with the device
	 */
	constructor(webSocket: WebSocketCommunication) {
		this.webSocket = webSocket;
	}

	/**
	 * Returns a new instance of SystemDefinition.
	 *
	 * @param webSocket - The WebSocket communication instance used to interact with the device
	 * @returns New instance of SystemDefinition
	 */
	public static getInstance(webSocket: WebSocketCommunication) {
		return new SystemDefinition(webSocket)
	}

	/**
	 * Initialize the system definition instance and set the current status, which will be automatically updated whenever a change occurs
	 */
	public async init() {
		if (this.initialized) {
			return;
		}

		try {
			const requestEvent: INnounceClientRequestEvent = {
				type: "statusRequestEvent",
				requestId: createRequestId()
			}

			this.setStatus(await this.webSocket.sendEventWithResponse<INnounceClientRequestEvent, NnounceStatusEvent>(requestEvent));
			const subscriptionPromise = new Promise<void>((resolve) => {
				let resolved = false;
				this.webSocket.subscribeToLiveEvent("networkChangeSubscriptionRequest", "networkChangeSubscriptionNotify", (event) => {
					this.onNetworkChangeEvent(event as NetworkChangeSubscriptionNotifyEvent)
					if (!resolved) {
						resolved = true;
						resolve();
					}
				});
			});
			await subscriptionPromise;
			this.initialized = true;
		} catch (e) {
			logger.error("Error during init system definitions. Error: ", String(e));
			throw e;
		}
	}

	/**
	 * Sets the current status of the system from a status event.
	 *
	 * @param status - The status event containing system information
	 * @private
	 */
	private setStatus(status: NnounceStatusEvent) {
		this.status = status;
	}

	/**
	 * Returns the firmware version of the device.
	 *
	 * @returns The firmware version as a string
	 */
	public getFirmwareVersion(): string {
		return this.status.firmwareVersion
	}

	/**
	 * Returns the model of the device.
	 *
	 * @returns The device model as a string
	 */
	public getModel(): string {
		return this.status.hwInfo.model
	}

	/**
	 * Returns the model type of the device.
	 *
	 * @returns The device model type as a string
	 */
	public getModelType(): string {
		return this.status.hwInfo.modelType
	}

	/**
	 * Returns the version of the device system.
	 *
	 * @returns The system version as a string
	 */
	public getVersion(): string {
		return this.status.hwInfo.version
	}

	/**
	 * Returns the serial number of the device.
	 *
	 * @returns The serial number as a string
	 */
	public getSerialNumber(): string  {
		return this.status.hwInfo.serialNumber
	}

	/**
	 * Returns the names of all network interfaces available on the device.
	 *
	 * @returns An array of interface names
	 */
	public getInterfaces(): string[] {
		return this.status.network.map(n => n.name);
	}

	/**
	 * Returns the first IPv4 address for the specified network interface.
	 *
	 * @param interfaceName - The name of the network interface
	 * @returns The IPv4 address as a string, or undefined if not available
	 */
	public getIp4Address(interfaceName: string): string | undefined {
		return this.status.network.find(n => n.name === interfaceName)?.inet4?.[0];
	}

	/**
	 * Returns the first IPv6 address for the specified network interface.
	 *
	 * @param interfaceName - The name of the network interface
	 * @returns The IPv6 address as a string, or undefined if not available
	 */
	public getIp6Address(interfaceName: string): string | undefined {
		return this.status.network.find(n => n.name === interfaceName)?.inet6?.[0];
	}

	/**
	 * Returns the MAC address for the specified network interface.
	 *
	 * @param interfaceName - The name of the network interface
	 * @returns The MAC address as a string, or undefined if not available
	 */
	public getMacAddress(interfaceName: string): string | undefined {
		return this.status.network.find(n => n.name === interfaceName)?.mac;
	}

	/**
	 * Returns the hostname of the device.
	 *
	 * @returns The hostname as a string
	 */
	public getHostname(): string {
		return this.status.hostname;
	}

	/**
	 * Handles network change events by updating the network information in the system status.
	 *
	 * @param event - The network change notification event
	 * @private
	 */
	private onNetworkChangeEvent(event: NetworkChangeSubscriptionNotifyEvent) {
		this.status.network = event.network;
	}
}
