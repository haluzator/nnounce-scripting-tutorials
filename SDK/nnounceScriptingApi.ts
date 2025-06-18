import { NnSystemDefinition } from "./nnSystem.ts";
import { NnControlInputsDefinition } from "./nnControlInputs.ts";
import { NnControlOutputsDefinition } from "./nnControlOutputs.ts";
import { NnDspDefinition } from "./nnDsp.ts";
import { logger, LoggerInterface, NnLoggerConfig } from "./utils/LoggerUtil.ts";
import { NnSnmpDefinition } from "./nnSnmp.ts";
import { NnUtilDefinition } from "./utils/NnUtil.ts";
import { NnPagingRouterDefinition } from "./nnPagingRouter.ts";
import { WebSocketCommunication } from "./communication/WebSocketCommunication.ts";
import { SystemVariablesControlDefinition } from "./nnSystem/SystemVariablesControlDefinition.ts";
import { SystemDefinition } from "./nnSystem/SystemDefinition.ts";
import { IOControlStates } from "./ioControl/IOControlStates.ts";
import { DesignUtil } from "./dspDesign/DesignUtil.ts";
import { NnButtonsDefinition } from "./nnButtons.ts";
import { ButtonStates } from "./buttons/ButtonStates.ts";

/**
 * Nnounce scripting interface.
 * Its fields control/manage different parts/modules of nnounce device.
 */
export interface NnounceScriptingApi {
	/**
	 * Play local or remote file.
	 * see {@link NnPagingRouterDefinition}
	 */
	pagingRouter: NnPagingRouterDefinition;
	/**
	 * Handle control inputs in analog or digital mode.
	 * Input pins are numbered from 1.
	 * see {@link NnControlInputsDefinition}
	 */
	controlInputs: NnControlInputsDefinition;
	/**
	 * Handle control outputs in relay or digital mode.
	 * Output pins are numbered from 1.
	 * see {@link NnControlOutputsDefinition}
	 */
	controlOutputs: NnControlOutputsDefinition;
	/**
	 * Handle DSP - control ducker, gain, net Rx and net Tx components.
	 * see {@link NnDspDefinition}
	 * */
	dsp: NnDspDefinition
	/**
	 * Use this for logging.
	 * see {@link LoggerInterface}
	 */
	logger: LoggerInterface;
	/**
	 * Logger configuration. Disable/enable logs from internal code.
	 * see {@link NnLoggerConfig}
	 */
	loggerConfig: NnLoggerConfig;
	/**
	 * Handle SNMP traps.
	 * see {@link NnSnmpDefinition}
	 */
	snmp: NnSnmpDefinition;
	/**
	 * System information.
	 * Get network interfaces status, hardware info and system variables.
	 *  see {@link NnSystemDefinition}
	 */
	system: NnSystemDefinition;
	/**
	 * Some convenient utility functions.
	 * see {@link NnUtilDefinition}
	 */
	util: NnUtilDefinition;
	/**
	 * Handle buttons in momentary or toggle mode.
	 */
	buttons: NnButtonsDefinition;
	/**
	 * Function to tell if the device is connected.
	 */
	isConnected: () => boolean;
	/**
	 * Promise of device connection. If you want to block and wait for the device connection, await on this promise.
	 */
	connectionPromise: () => Promise<NnounceScriptingApi>;
}

/**
 * Represents the configuration options for a connection.
 *
 * @property {boolean} [enableInternalLogging] - A flag to indicate whether internal logging is enabled.
 */
export interface ConnectionOptions {
	enableInternalLogging?: boolean;
}

/**
 * Represents an NnounceDevice that provides access to various APIs and functionalities
 * for managing and interacting with an Nnounce device. The class is responsible for
 * establishing a WebSocket communication, initializing services, and managing key
 * features such as control inputs, outputs, DSP, logging, and system definitions.
 * Implements the NnounceScriptingApi interface.
 */
export class NnounceDevice implements NnounceScriptingApi {
	private connectionOptions: ConnectionOptions;
	private webSocket: WebSocketCommunication;

	private _connectionPromise: Promise<NnounceScriptingApi>;
	private initDone: boolean = false;

	public pagingRouter: NnPagingRouterDefinition;
	public controlInputs: NnControlInputsDefinition;
	public controlOutputs: NnControlOutputsDefinition;
	public dsp: NnDspDefinition
	public logger: LoggerInterface;
	public loggerConfig: NnLoggerConfig;
	public snmp: NnSnmpDefinition;
	public system: NnSystemDefinition;
	public buttons: NnButtonsDefinition;
	public util: NnUtilDefinition;

	/**
	 * Constructs an instance of the service to manage Nnounce device communication and functionality.
	 *
	 * @param {string} hostname - The hostname of the Nnounce device to connect to.
	 * @param {string | null} apiKey - The API key for authentication with the Nnounce device. Null if no API key is required.
	 * @param {ConnectionOptions} [connectionOptions] - Optional configuration settings for the connection, such as enabling internal logging.
	 */
	public constructor(hostname: string, apiKey: string | null, connectionOptions?: ConnectionOptions) {
		const nnLoggerConfig = NnLoggerConfig.getInstance();
		nnLoggerConfig.setEnabledInternal(connectionOptions?.enableInternalLogging ?? false);

		this.connectionOptions = connectionOptions;
		if (apiKey) {
			logger.info("Connecting to Nnounce device {} with api key {}", hostname, apiKey);
		} else {
			logger.info("Connecting to Nnounce device {} without api key", hostname);
		}
		const webSocket = new WebSocketCommunication(hostname, apiKey, nnLoggerConfig);
		this.webSocket = webSocket;
		const ioControlStates = IOControlStates.getInstance(webSocket, nnLoggerConfig);
		const buttonStates = ButtonStates.getInstance(webSocket);
		this.pagingRouter = NnPagingRouterDefinition.getInstance(webSocket, nnLoggerConfig);
		this.controlInputs = NnControlInputsDefinition.getInstance(ioControlStates);
		this.controlOutputs = NnControlOutputsDefinition.getInstance(webSocket, nnLoggerConfig, ioControlStates);
		this.dsp = NnDspDefinition.getInstance(webSocket, nnLoggerConfig);
		this.logger = logger;
		this.loggerConfig = nnLoggerConfig;
		this.snmp = NnSnmpDefinition.getInstance(webSocket);
		this.system = NnSystemDefinition.getInstance(SystemVariablesControlDefinition.getInstance(webSocket), SystemDefinition.getInstance(webSocket));
		this.buttons = NnButtonsDefinition.getInstance(buttonStates)
		this.util = NnUtilDefinition.getInstance();
		this._connectionPromise =
			Promise.all([
					SystemVariablesControlDefinition.initInstance(),
					SystemDefinition.initInstance(),
					IOControlStates.initInstance(),
					DesignUtil.initDesign(webSocket),
					ButtonStates.initInstance(),
				]
			).then(() => {
				logger.info("Init mandatory services finished.");
				this.initDone = true;
				return this;
			});
	}

	/**
	 * Determines whether the WebSocket connection is currently established.
	 *
	 * @return {boolean} True if the WebSocket is connected, false otherwise.
	 */
	public isConnected(): boolean {
		return this.webSocket.connected();
	}

	/**
	 * Checks whether the initialization process has been completed.
	 *
	 * @return {boolean} Returns true if initialization is complete, otherwise false.
	 */
	public isInitialized(): boolean {
		return this.initDone;
	}

	/**
	 * Returns a promise that resolves to an instance of the NnounceScriptingApi.
	 * This Promise resolves once the WebSocket connection is successful.
	 *
	 * @return {Promise<NnounceScriptingApi>} A promise that resolves to the NnounceScriptingApi object.
	 */
	public connectionPromise(): Promise<NnounceScriptingApi> {
		return this._connectionPromise;
	}

}
