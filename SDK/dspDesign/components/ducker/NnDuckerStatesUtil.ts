import { Consumer } from "../../../utils/FunctionalInterfaces.ts";
import { WebSocketCommunication } from "../../../communication/WebSocketCommunication.ts";
import { logger, NnLoggerConfig } from "../../../utils/LoggerUtil.ts";
import { DuckerPriorityActiveChangeNotify } from "../../../events/incoming/DuckerPriorityActiveChangeNotify.ts";

export class NnDuckerStatesUtil {

	private activeChangeListeners: Map<string, Array<Consumer<boolean /*priorityActive*/>>> = new Map();
	private webSocket: WebSocketCommunication;
	private loggerConfig: NnLoggerConfig;

	constructor(webSocket: WebSocketCommunication) {
		this.webSocket = webSocket;
		this.webSocket.subscribeToLiveEvent(
			"duckerPriorityActiveChangeSubscriptionRequest",
			"duckerPriorityActiveChangeNotify",
			(event) => this.onPrimaryActiveChangeEvent(event as DuckerPriorityActiveChangeNotify)
		);
	}

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