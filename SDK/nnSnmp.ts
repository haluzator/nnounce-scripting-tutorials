import { WebSocketCommunication } from "./communication/WebSocketCommunication.ts";
import { SnmpTrapSubscriptionNotify } from "./events/incoming/SnmpTrapSubscriptionNotify.ts";
import { Consumer } from "./utils/FunctionalInterfaces.ts";

/**
 * Define API for working with snmp traps
 */
export class NnSnmpDefinition {
	private webSocket: WebSocketCommunication;

	/**
	 * Creates an instance of the class with a specified WebSocketCommunication object.
	 *
	 * @param {WebSocketCommunication} webSocket - The WebSocketCommunication instance used for communication.
	 */
	private constructor(webSocket: WebSocketCommunication) {
		this.webSocket = webSocket;
	}

	/**
	 * Create new instance
	 */
	public static getInstance(webSocket: WebSocketCommunication) {
		return new NnSnmpDefinition(webSocket);
	}

	/**
	 * Method will create subscription for SNMP traps.
	 * @param eventConsumer {@link Consumer} of {@link SnmpTrapSubscriptionNotify}
	 */
	public subscribeForTrap(eventConsumer: Consumer<SnmpTrapSubscriptionNotify>): void {
		this.webSocket.subscribeToEvent("snmpTrapSubscriptionRequest", "snmpTrapSubscriptionNotify", 100,
			(event) => eventConsumer(event as SnmpTrapSubscriptionNotify));
	}
}
