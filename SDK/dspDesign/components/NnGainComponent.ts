import { ANnDspComponent } from "./NnDspComponent.ts";
import { NnComponentName } from "./NnComponentName.ts";
import { WebSocketCommunication } from "../../communication/WebSocketCommunication.ts";
import { NnLoggerConfig } from "../../utils/LoggerUtil.ts";


export class NnGainComponent extends ANnDspComponent {

	constructor(id: number | string, webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig) {
		super(id, NnComponentName.GAIN_COMPONENT_NAME, webSocket, loggerConfig);
	}

}