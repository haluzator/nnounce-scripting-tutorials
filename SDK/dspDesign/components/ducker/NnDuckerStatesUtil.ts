import { Consumer } from "../../../utils/FunctionalInterfaces.ts";
import { WebSocketCommunication } from "../../../communication/WebSocketCommunication.ts";
import { logger, NnLoggerConfig } from "../../../utils/LoggerUtil.ts";
import { DuckerPriorityActiveChangeNotify } from "../../../events/incoming/DuckerPriorityActiveChangeNotify.ts";

/**
 * Utility class for managing and notifying state changes related to Ducker priority activation.
 */
export class NnDuckerStatesUtil {

	private activeChangeListeners: Map<string, Array<Consumer<boolean /*priorityActive*/>>> = new Map();
	private webSocket: WebSocketCommunication;
	private loggerConfig: NnLoggerConfig;

	/**
	 * Constructs an instance of the class.
	 *
	 * @param {WebSocketCommunication} webSocket - The WebSocket communication instance used for subscribing to and handling live events.
	 */
	constructor(webSocket: WebSocketCommunication) {
		this.webSocket = webSocket;
		this.webSocket.subscribeToLiveEvent(
			"duckerPriorityActiveChangeSubscriptionRequest",
			"duckerPriorityActiveChangeNotify",
			(event) => this.onPrimaryActiveChangeEvent(event as DuckerPriorityActiveChangeNotify)
		);
	}

	/**
	 * Registers a listener for changes in active state for a given component.
	 *
	 * @param {string} componentId - The unique identifier of the component to track.
	 * @param {Consumer<boolean>} listener - A callback function to execute when the active state of the component changes.
	 * @return {Object} An object with a `removeListener` method that allows the listener to be unregistered.
	 */
	public onActiveChange(componentId: string, listener: Consumer<boolean>) {
		const changeCbs = this.activeChangeListeners.get(componentId) ?? [];
		changeCbs.push(listener);
		this.activeChangeListeners.set(componentId, changeCbs);
		return {
			removeListener: () => {
				const inputChangeCbs = this.activeChangeListeners.get(componentId) ?? [];
				const index = inputChangeCbs.indexOf(listener);
				inputChangeCbs.splice(index, 1);
				this.activeChangeListeners.set(componentId, inputChangeCbs);
			}
		}
	}

	private onPrimaryActiveChangeEvent(event: DuckerPriorityActiveChangeNotify) {
		this.loggerConfig.isEnabledInternal() && logger.debug("Ducker priority active changed to '{}'", event.priorityActive);
		const onChangeCallbacks = this.activeChangeListeners.get(event.componentId.toString());
		onChangeCallbacks?.forEach(cb => cb(event.priorityActive));
	}

}