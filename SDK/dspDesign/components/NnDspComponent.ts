import { ANpdConfig, DesignMetadata, DspDesignRuntime, NpdComponentGainConfig, NpdComponentMuteConfig } from "../../events/dto/DspDesign.ts";
import { WebSocketCommunication } from "../../communication/WebSocketCommunication.ts";
import { createRuntimeUpdateEvent, RuntimeUpdateEvent } from "../../events/outgoing/RuntimeUpdateEvent.ts";
import { logger, NnLoggerConfig } from "../../utils/LoggerUtil.ts";
import { Processor } from "../../utils/FunctionalInterfaces.ts";
import { DesignUtil } from "../DesignUtil.ts";
import { INnounceClientResultEvent } from "../../events/INnounceClientResultEvent.ts";
import { NnDspComponentControl } from "./NnDspComponentControl.ts";

const CHECK_DESIGN_UPDATE_ATTEMPT: number = 5;

class NpdComponentMetadata{

	/**
	 * Runtime component
	 *
	 */
	public readonly npdComponentConfig: ANpdConfig;


	/**
	 * Design runtime part for update
	 * @protected
	 */
	public readonly designRuntime: { [p: string]: ANpdConfig };
	/**
	 * Design metadata part for update
	 * @protected
	 */
	public readonly designMetadata: DesignMetadata;

	constructor(npdComponentConfig: ANpdConfig, designRuntime: { [p: string]: ANpdConfig }, designMetadata: DesignMetadata) {
		this.npdComponentConfig = npdComponentConfig;
		this.designRuntime = designRuntime;
		this.designMetadata = designMetadata;
	}
}

export class ANnDspComponent implements NnDspComponentControl {
	private readonly id: number | string;
	private readonly componentType: string;
	private componentId: string;
	private webSocket: WebSocketCommunication;
	private loggerConfig: NnLoggerConfig;

	constructor(id: number | string, componentType: string, webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig) {
		this.id = id;
		this.componentId = `${id}`;
		this.componentType = componentType;
		this.webSocket = webSocket;
		this.loggerConfig = loggerConfig;
	}

	/**
	 * @return gain value of component with current id | name
	 */
	public getGain() {
		if (!this.webSocket.connected()) {
			throw new Error("WebSocket is not connected");
		}
		const npdComponentData = this.getNpdComponentData(this.id, this.componentType);
		if (!npdComponentData) {
			return undefined;
		}
		const gainComponent = (npdComponentData.npdComponentConfig as NpdComponentGainConfig);
		return gainComponent.gain
	}

	/**
	 * The method updates the 'gain' field of the component and sends a runtime update request.
	 * After sending the update, the new design is loaded to compare if the new value has changed.
	 * This operation will retry if the field update is not applied, with a maximum of 5 attempts.
	 * @param value
	 */
	public async setGain(value: number) {
		if (!this.webSocket.connected()) {
			throw new Error("WebSocket is not connected");
		}
		if (typeof value !== "number") {
			this.loggerConfig.isEnabledInternal() && logger.warn("The provided parameter is not a number");
			return;
		}

		return await this.setGainInternal(value, CHECK_DESIGN_UPDATE_ATTEMPT);
	}

	/**
	 * @return mute value of component with current id | name
	 */
	public isMute() {
		if (!this.webSocket.connected()) {
			throw new Error("WebSocket is not connected");
		}
		const npdComponentData = this.getNpdComponentData(this.id, this.componentType);
		if (!npdComponentData) {
			return undefined;
		}
		const muteComponent = (npdComponentData.npdComponentConfig as NpdComponentMuteConfig);
		return muteComponent.mute
	}

	/**
	 * The method updates the 'mute' field of the component and sends a runtime update request.
	 * After sending the update, the new design is loaded to compare if the new value has changed.
	 * This operation will retry if the field update is not applied, with a maximum of 5 attempts.
	 * @param mute
	 */
	public async setMute(mute: boolean) {
		if (!this.webSocket.connected()) {
			throw new Error("WebSocket is not connected");
		}
		if (typeof mute !== "boolean") {
			this.loggerConfig.isEnabledInternal() && logger.warn("The provided parameter is not a boolean");
			return;
		}

		return await this.setMuteInternal(mute, CHECK_DESIGN_UPDATE_ATTEMPT);
	}

	private async setGainInternal(value: number, setAndCheckAttempt: number) {
		if (setAndCheckAttempt === 0) {
			this.loggerConfig.isEnabledInternal() && logger.warn("There is no attempt to check runtime component with ID '{}' of type '{}'", this.componentId, this.componentType);
			return;
		}

		const npdComponentData = await this.getMostRecentlyNpdComponentData(this.id, this.componentType);
		if (npdComponentData == null) {
			return;
		}

		const gainComponent = (npdComponentData.npdComponentConfig as NpdComponentGainConfig);
		gainComponent.gain = value;
		await this.sendRuntimeUpdate(
			npdComponentData,
			async (error) => {
				logger.warn("Gain of runtime component with ID '{}' of type '{}' wasn't updated. Reason: '{}', try again", this.componentId, this.componentType, error)
				await this.setGainInternal(value, --setAndCheckAttempt)
			},
		)
	}
	private async setMuteInternal(mute: boolean, setAndCheckAttempt: number) {
		if (setAndCheckAttempt === 0) {
			this.loggerConfig.isEnabledInternal() && logger.warn("There is no attempt to check runtime component with ID '{}' of type '{}'", this.componentId, this.componentType);
			return;
		}

		const npdComponentData = await this.getMostRecentlyNpdComponentData(this.id, this.componentType);
		if (npdComponentData == null) {
			return;
		}
		const muteComponent = (npdComponentData.npdComponentConfig as NpdComponentMuteConfig);
		muteComponent.mute = mute;
		await this.sendRuntimeUpdate(
			npdComponentData,
			async (error) => {
				logger.warn("Mute of runtime component with ID '{}' of type '{}' wasn't updated. Reason: '{}', try again", this.componentId, this.componentType, error)
				await this.setMuteInternal(mute, --setAndCheckAttempt)
			},
		)
	}

	/**
	 * Create update event and check if update was successful
	 * @param npdComponentData
	 * @param notChangedCallback - callback for retry update
	 * * @protected
	 */
	protected async sendRuntimeUpdate(npdComponentData: NpdComponentMetadata, notChangedCallback: Processor<string, Promise<void>>) {
		npdComponentData.designMetadata.last_modified_runtime = new Date().getTime();
		const data: DspDesignRuntime = {
			metadata: npdComponentData.designMetadata,
			runtime: npdComponentData.designRuntime
		}

		try {
			await this.webSocket.sendEventWithResponse<INnounceClientResultEvent, RuntimeUpdateEvent>(createRuntimeUpdateEvent(data));
			this.loggerConfig.isEnabledInternal() && logger.debug("Runtime component with ID '{}' of type '{}' was successfully updated", this.componentId, this.componentType);
		} catch(e) {
			await notChangedCallback(e);
		}
	}

	private async getMostRecentlyNpdComponentData(id: number | string, type: string): Promise<null | NpdComponentMetadata> {
		if (await DesignUtil.loadDesign(this.webSocket) == null) {
			return null;
		}

		return this.getNpdComponentData(id, type);
	}

	private getNpdComponentData(id: number | string, type: string) {
		if (DesignUtil.designMetadata.partialDesign == null) {
			return null;
		}

		this.componentId = DesignUtil.getComponentId(DesignUtil.designMetadata.partialDesign, id);

		const npdComponentConfig =  DesignUtil.designMetadata.partialDesign.runtime?.[this.componentId] ?? null;

		if (npdComponentConfig?.type === type) {
			return new NpdComponentMetadata(npdComponentConfig,  DesignUtil.designMetadata.partialDesign.runtime, DesignUtil.designMetadata.partialDesign.metadata);
		}

		let available: string[] = [];
		if ( DesignUtil.designMetadata.partialDesign.runtime) {
			available = Object.entries( DesignUtil.designMetadata.partialDesign.runtime)
				.filter(entry => entry[1].type === type)
				.map(entry => entry[0]);
		}
		const identifierText = id === this.componentId ? "name" : "ID";
		logger.error("Cannot find runtime {} component with {} '{}'. Available IDs are {}", type,  identifierText, this.componentId, available.join(", "));
		return null;
	}
}

