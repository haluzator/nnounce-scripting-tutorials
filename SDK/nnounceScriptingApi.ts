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

	isConnected: () => boolean;

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

export class NnounceDevice implements NnounceScriptingApi {
	// private hostname: string;
	// private apiKey: string | null;
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
	public util: NnUtilDefinition;

	public constructor(hostname: string, apiKey: string | null, connectionOptions?: ConnectionOptions) {
		const nnLoggerConfig = NnLoggerConfig.getInstance();
		nnLoggerConfig.setEnabledInternal(connectionOptions?.enableInternalLogging ?? false);

		// this.hostname = hostname;
		// this.apiKey = apiKey;
		this.connectionOptions = connectionOptions;
		logger.info("Connecting to Nnounce device {} with api key {}", hostname, apiKey);
		const webSocket = new WebSocketCommunication(hostname, apiKey, nnLoggerConfig);
		this.webSocket = webSocket;
		const ioControlStates = IOControlStates.getInstance(webSocket, nnLoggerConfig);
		this.pagingRouter = NnPagingRouterDefinition.getInstance(webSocket, nnLoggerConfig);
		this.controlInputs = NnControlInputsDefinition.getInstance(ioControlStates);
		this.controlOutputs = NnControlOutputsDefinition.getInstance(webSocket, nnLoggerConfig, ioControlStates);
		this.dsp = NnDspDefinition.getInstance(webSocket, nnLoggerConfig);
		this.logger = logger;
		this.loggerConfig = nnLoggerConfig;
		this.snmp = NnSnmpDefinition.getInstance(webSocket);
		this.system = NnSystemDefinition.getInstance(SystemVariablesControlDefinition.getInstance(webSocket), SystemDefinition.getInstance(webSocket));
		this.util = NnUtilDefinition.getInstance();
		this._connectionPromise =
			Promise.all([
					SystemVariablesControlDefinition.initInstance(),
					SystemDefinition.initInstance(),
					IOControlStates.initInstance(),
					DesignUtil.initDesign(webSocket),
				]
			).then(() => {
				logger.info("Init mandatory services finished.");
				this.initDone = true;
				return this;
			});
	}

	public isConnected(): boolean {
		return this.webSocket.connected();
	}

	public isInitialized(): boolean {
		return this.initDone;
	}

	public connectionPromise(): Promise<NnounceScriptingApi> {
		return this._connectionPromise;
	}

}
