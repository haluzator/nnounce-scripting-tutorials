import { ANnDspComponent } from "./NnDspComponent.ts";
import { NnComponentName } from "./NnComponentName.ts";
import { WebSocketCommunication } from "../../communication/WebSocketCommunication.ts";
import { NnLoggerConfig } from "../../utils/LoggerUtil.ts";

export class NnNetRxComponent extends ANnDspComponent {

	constructor(componentId: number | string, webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig) {
		super(componentId, NnComponentName.NET_RX_COMPONENT_NAME, webSocket, loggerConfig);
	}

}