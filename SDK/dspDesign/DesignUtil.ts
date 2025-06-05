import { ANpdConfig, DesignMetadata } from "../events/dto/DspDesign.ts";
import { RetryUtil } from "../utils/RetryUtil.ts";
import { WebSocketCommunication } from "../communication/WebSocketCommunication.ts";
import { createDesignLoadEvent } from "../events/outgoing/DesignLoadEvent.ts";
import { logger } from "../utils/LoggerUtil.ts";
import { DesignLoadResultEvent } from "../events/incoming/DesignLoadResultEvent.ts";
import { Consumer } from "../utils/FunctionalInterfaces.ts";
import { DesignRuntimeChangedSubscriptionResponseEvent } from "../events/incoming/DesignRuntimeChangedSubscriptionResponseEvent.ts";
import { DesignRuntimeChangedSubscriptionRequestEvent } from "../events/outgoing/DesignRuntimeChangedSubscriptionRequestEvent.ts";
import { createRequestId } from "../events/INnounceClientRequestEvent.ts";
import { DesignRuntimeChangedSubscriptionNotifyEvent } from "../events/incoming/DesignRuntimeSubscriptionNotify.ts";
import { NnComponentName } from "./components/NnComponentName.ts";

/**
 * Enum representing the possible states of a design loading process.
 *
 * @enum {number}
 * @property {number} NONE - Represents the initial or default state where no loading has started.
 * @property {number} DONE - Indicates that the loading process was completed successfully.
 * @property {number} LOADING - Denotes that the loading process is currently in progress.
 * @property {number} ERROR - Signifies that an error occurred during the loading process.
 */
enum LoadDesignState {
	NONE,
	DONE,
	LOADING,
	ERROR
}

/**
 * Partial design holding only supported runtime data (for components NetTx. NetRx, Gain),
 * which are updated on change, design metadata and map for component name to component ID
 */
interface PartialDesign {
	metadata: DesignMetadata;
	runtime: {[key: string]: ANpdConfig};
	nameToId: Map<string, number>;
}

/**
 * The DesignHelper class provides functionality to assist with the design loading process.
 * It tracks the state of design loading, handles events, and manages runtime processing logic.
 *
 * Properties:
 * - partialDesign: The loaded partial design object, if applicable.
 * - timestamp: A numeric timestamp indicating the last update time for the design.
 * - state: The current state of the design loading process, represented by an enum of type LoadDesignState.
 * - loadFinishConsumers: An array of consumer functions that are triggered upon the completion of design loading.
 * - loaderIdentifier: An optional identifier for the design loader being used.
 * - processingRuntime: A boolean flag indicating whether runtime processing is currently active.
 */
class DesignHelper {
	public partialDesign?: PartialDesign;
	public timestamp: number;
	public state: LoadDesignState;
	public loadFinishConsumers: Array<Consumer<Error|null>>;
	public loaderIdentifier?: string;
	public processingRuntime: boolean

	/**
	 * Initializes a new instance of the class with default properties.
	 * The `timestamp` is set to 0, `state` is set to `LoadDesignState.NONE`,
	 * `loadFinishConsumers` is initialized as an empty array, and
	 * `processingRuntime` is set to false.
	 *
	 * @return {Object} An instance of the class with default values for all properties.
	 */
	constructor() {
		this.timestamp = 0;
		this.state = LoadDesignState.NONE;
		this.loadFinishConsumers = [];
		this.processingRuntime = false;
	}
}

/**
 * Utility class for managing the design metadata and communicating with a WebSocket for design-related operations.
 * This class handles loading, initializing, and maintaining design state and metadata, and it facilitates communication
 * between the client application and a remote WebSocket server for real-time design updates.
 */
export class DesignUtil {
	public static designMetadata = new DesignHelper();
	private static readonly DESIRED_COMPONENT_TYPES: string[] = [
		NnComponentName.GAIN_COMPONENT_NAME,
		NnComponentName.NET_RX_COMPONENT_NAME,
		NnComponentName.NET_TX_COMPONENT_NAME,
		NnComponentName.DUCKER_COMPONENT_NAME
	];

	/**
	 * Initializes the design by subscribing to necessary events and loading design metadata.
	 *
	 * @param {WebSocketCommunication} webSocket - The WebSocketCommunication instance used for event handling and communication.
	 * @return {Promise<void>} A Promise that resolves when the design initialization is complete.
	 * @throws {Error} If an error occurs during the initialization process.
	 */
	public static async initDesign(webSocket: WebSocketCommunication) {
		if (this.designMetadata.state !== LoadDesignState.NONE) {
			return;
		}
		try {
			await this.loadDesign(webSocket);
			const requestEvent: DesignRuntimeChangedSubscriptionRequestEvent = {
				type: "designRuntimeChangedSubscriptionRequest",
				requestId: createRequestId(),
				keepAliveMs: 0,
				responseTag: "deno-script-api",
				componentNames: DesignUtil.DESIRED_COMPONENT_TYPES
			}
			const event = await webSocket.sendEventWithResponse<DesignRuntimeChangedSubscriptionResponseEvent, DesignRuntimeChangedSubscriptionRequestEvent>(requestEvent);
			this.processRuntimeChangedResponseEvent(event)
			webSocket.addEventHandler("designRuntimeChangedSubscriptionNotify", event => {
				this.processRuntimeChangedNotifyEvent(event as DesignRuntimeChangedSubscriptionNotifyEvent)
			})

			webSocket.subscribeToLiveEvent("designChangeSubscriptionRequest", "designChangeNotify", (event) => {
				this.designMetadata.partialDesign = undefined;
				this.designMetadata.state = LoadDesignState.NONE;
				this.loadDesign(webSocket);
			})

		} catch (e) {
			logger.error("Error during init DSP design. Error: ", String(e));
			throw e;
		}
	}

	/**
	 * This method loads the design data using the provided WebSocketCommunication instance.
	 *
	 * @param {WebSocketCommunication} webSocket - An instance of WebSocketCommunication used for communication during the design loading process.
	 * @return {Object} The partial design metadata loaded during the process.
	 * @throws Will throw an error if the loading process fails.
	 */
	public static async loadDesign(webSocket: WebSocketCommunication) {
		const identifier = this.getIdentifier();
		try{
			await this.loadDesignInternal(identifier, webSocket);
			return this.designMetadata.partialDesign;
		} catch (e) {
			logger.error("Error during loading design: {}", e);
			this.notifyAllDesignConsumers(e);
			throw e;
		}
	}

	/**
	 * Retrieves the component identifier as a string. If the input ID is a string, it attempts to map it
	 * to a numerical ID using the provided design. Otherwise, it converts the numerical ID directly to a string.
	 *
	 * @param {PartialDesign} dspDesign - The design object containing the mapping between component names and IDs.
	 * @param {number | string} id - The component identifier, which can either be a number or a string.
	 * @return {string} The component identifier represented as a string. If a matching ID is not found for a string input, returns the input string.
	 */
	public static getComponentId(dspDesign: PartialDesign, id: number | string): string {
		if (typeof id === "string") {
			const id_number = dspDesign.nameToId.get(id);
			return id_number ? `${id_number}` : id
		}

		return `${id}`;
	}

	private static processRuntimeChangedResponseEvent(event: DesignRuntimeChangedSubscriptionResponseEvent) {
		if (this.designMetadata.processingRuntime) {
			return;
		}
		this.designMetadata.processingRuntime = true;
		try {
			if (!this.designMetadata.partialDesign) {
				if (Object.keys(event.metadata).length == 0) {
					return;
				}
				// design should be loaded due to initialization or change
				return;
			}
			this.designMetadata.partialDesign.runtime = event.runtime;
			this.designMetadata.partialDesign.metadata = event.metadata;
		} finally {
			this.designMetadata.processingRuntime = false;
		}
	}

	private static processRuntimeChangedNotifyEvent(event: DesignRuntimeChangedSubscriptionNotifyEvent) {
		if (!this.designMetadata.partialDesign) {
			// design should be loaded due to initialization or change
			return;
		}
		for (const componentRuntime of event.data) {
			this.designMetadata.partialDesign.runtime[`${componentRuntime.index}`] = {
				type: componentRuntime.cmpType,
				... componentRuntime.data

			}
		}
	}

	private static async loadDesignInternal(identifier: string, webSocket: WebSocketCommunication) {
		if (this.designMetadata.state == LoadDesignState.LOADING && this.designMetadata.loaderIdentifier !== identifier) {
			// some ask for design before. wait for its completion
			return new Promise<void>((resolve, reject) => {
				if (this.designMetadata.state == LoadDesignState.LOADING) {
					this.designMetadata.loadFinishConsumers.push((loadingError => {
						if (loadingError) {
							reject()
							return;
						}
						resolve();
					}))
				} else {
					// main loader finish design load before creating this promise, finish the promise new design is already loaded
					resolve();
				}

			})
		}

		// set this thread as main loader. Other load request which will come until the design is not loaded will be registered as
		// consumers and these will wait for main loader result
		this.designMetadata.state = LoadDesignState.LOADING;
		this.designMetadata.loaderIdentifier = identifier;
		const event = await RetryUtil.runAsync("Loading design", () => webSocket.sendEventWithResponse(createDesignLoadEvent()))
		const dspDesign = (event as DesignLoadResultEvent).data;

		if (!dspDesign) {
			this.designMetadata.state = LoadDesignState.NONE
			throw new Error('Design is missing');
		}
		const nameToIdMap: Map<string, number> = new Map();
		const runtime: { [key: string]: ANpdConfig } = {};

		Object.entries(dspDesign.runtime)
			.filter(entry => DesignUtil.DESIRED_COMPONENT_TYPES.indexOf(entry[1].type) > -1)
			.forEach(entry => {
				const key = entry[0]
				runtime[key] = entry[1];
			});

		Object.values(dspDesign.drawflow.Home.data)
			.filter(entry => DesignUtil.DESIRED_COMPONENT_TYPES.indexOf(entry.type) > -1)
			.forEach(node => {
				nameToIdMap.set(node.name, node.id);
			});
		this.designMetadata.partialDesign = {
			nameToId: nameToIdMap,
			metadata: dspDesign.metadata,
			runtime: runtime

		};
		this.designMetadata.timestamp = Date.now();
		this.notifyAllDesignConsumers(null);
	}

	private static notifyAllDesignConsumers(error: Error|null) {
		this.designMetadata.loadFinishConsumers.forEach(consumer => consumer(error));
		this.designMetadata.loadFinishConsumers = [];
		this.designMetadata.state = error ? LoadDesignState.ERROR : LoadDesignState.DONE
	}

	private static getIdentifier() {
		return `${Date.now()}_${Math.random().toString(36).slice(2,6)}`
	}
}

