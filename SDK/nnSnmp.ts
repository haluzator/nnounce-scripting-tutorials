import { WebSocketCommunication } from "./communication/WebSocketCommunication.ts";
import { SnmpTrapSubscriptionNotify } from "./events/incoming/SnmpTrapSubscriptionNotify.ts";
import { Consumer } from "./utils/FunctionalInterfaces.ts";

/**
 * Define API for working with snmp traps
 */
export class NnSnmpDefinition {
	public static INSTANCE: NnSnmpDefinition;

	private webSocket: WebSocketCommunication;

	private constructor(webSocket: WebSocketCommunication) {
		this.webSocket = webSocket;
	}

	/**
	 * Return singleton instance
	 */
	public static getInstance(webSocket: WebSocketCommunication) {
		if (!this.INSTANCE) {
			this.INSTANCE = new NnSnmpDefinition(webSocket);
		}
		return this.INSTANCE;
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
