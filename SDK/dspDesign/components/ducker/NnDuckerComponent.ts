import { NnDuckerStatesUtil } from "./NnDuckerStatesUtil.ts";
import { Consumer } from "../../../utils/FunctionalInterfaces.ts";
import { DesignUtil } from "../../DesignUtil.ts";
import { NnDspDuckerControl } from "../../../nnDsp.ts";
import { WebSocketCommunication } from "../../../communication/WebSocketCommunication.ts";

/**
 * Represents a component that manages and interacts with ducker functionality. It communicates via WebSocket
 * and utilizes a utility class to handle the ducker states and events.
 *
 * The `NnDuckerComponent` implements the `NnDspDuckerControl` interface and acts as an abstraction layer.
 */
export class NnDuckerComponent implements NnDspDuckerControl {
	private readonly id: number | string;
	private readonly webSocket: WebSocketCommunication;
	private readonly duckerStatesUtil: NnDuckerStatesUtil;

	/**
	 * Constructor for initializing an instance with an identifier and WebSocket communication.
	 *
	 * @param {number|string} id - The unique identifier for the instance, which can be a number or a string.
	 * @param {WebSocketCommunication} webSocket - The WebSocket communication instance used for establishing communication.
	 * @return {void}
	 */
	constructor(id: number | string, webSocket: WebSocketCommunication) {
		this.id = id;
		this.webSocket = webSocket;
		this.duckerStatesUtil = new NnDuckerStatesUtil(this.webSocket);
	}

	/**
	 * Registers a listener for the ducker priority active change event.
	 * @param activeChangeCb The callback function to be invoked each time the ducker priority state changes. Consumed boolean indicates whather priority input is active.
	 */
	public async onActiveChange(activeChangeCb: Consumer<boolean>): Promise<void> {
		const dspDesign = await DesignUtil.loadDesign(this.webSocket);
		if (dspDesign == null) {
			return;
		}
		const componentId = DesignUtil.getComponentId(dspDesign, this.id);
		this.duckerStatesUtil.onActiveChange(componentId, activeChangeCb);
	}

}