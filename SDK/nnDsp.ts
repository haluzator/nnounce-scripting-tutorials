import { NnGainComponent } from "./dspDesign/components/NnGainComponent.ts";
import { NnNetRxComponent } from "./dspDesign/components/NnNetRxComponent.ts";
import { NnNetTxComponent } from "./dspDesign/components/NnNetTxComponent.ts";
import { NnDuckerComponent } from "./dspDesign/components/ducker/NnDuckerComponent.ts";
import { NnDspComponentControl } from "./dspDesign/components/NnDspComponentControl.ts";
import { WebSocketCommunication } from "./communication/WebSocketCommunication.ts";
import { NnLoggerConfig } from "./utils/LoggerUtil.ts";


export interface NnDspDuckerControl {
	/**
	 * Registers a listener for the ducker priority input active change event.
	 * @param onActiveChangeCb The callback function to be invoked each time the ducker priority input state changes. Consumed boolean indicates whether priority input is active.
	 */
	onActiveChange: { (onActiveChangeCb: { (priorityActive: boolean): void }): void };
}

/**
 * Define API for updating components
 */
export class NnDspDefinition {
	private static INSTANCE: NnDspDefinition;

	private _components: NnDspComponent;

	private constructor(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig) {
		this._components = NnDspComponent.getInstance(webSocket, loggerConfig);
	}

	/**
	 * Components holder
	 */
	public get components(): NnDspComponent {
		return this._components;
	}

	public static getInstance(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig) {
		if (!this.INSTANCE) {
			this.INSTANCE = new NnDspDefinition(webSocket, loggerConfig);
		}
		return this.INSTANCE;
	}
}

/**
 * Util for working with components
 */
export class NnDspComponent {
	private static INSTANCE: NnDspComponent;

	private webSocket: WebSocketCommunication;
	private loggerConfig: NnLoggerConfig;

	private constructor(websocket: WebSocketCommunication, loggerConfig: NnLoggerConfig) {
		this.webSocket = websocket;
		this.loggerConfig = loggerConfig;
	}

	/**
	 * Return singleton instance
	 */
	public static getInstance(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig) {
		if (!this.INSTANCE) {
			this.INSTANCE = new NnDspComponent(webSocket, loggerConfig);
		}
		return this.INSTANCE;
	}

	/**
	 * Method return gain component by its ID/name or null if none exists
	 * @param id number|string
	 * - number - id of the component
	 * - string - name of the component
	 */
	public gain(id: number | string): NnDspComponentControl {
		return new NnGainComponent(id, this.webSocket, this.loggerConfig);
	}

	/**
	 * Method return net RX component by its ID/name or null if none exists
	 * @param id number|string
	 * - number - id of the component
	 * - string - name of the component
	 */
	public netRx(id: number | string): NnDspComponentControl {
		return new NnNetRxComponent(id, this.webSocket, this.loggerConfig);
	}

	/**
	 * Method return net TX component by its ID/name or null if none exists
	 * @param id number|string
	 * - number - id of the component
	 * - string - name of the component
	 */
	public netTx(id: number | string): NnDspComponentControl {
		return new NnNetTxComponent(id, this.webSocket, this.loggerConfig);
	}

	/**
	 * Method returns ducker component by its ID/name or null if none exist
	 * @param id number|string
	 * - number - id of the component
	 * - string - name of the component
	 */
	public ducker(id: number | string): NnDspDuckerControl {
		return new NnDuckerComponent(id, this.webSocket);
	}
}
