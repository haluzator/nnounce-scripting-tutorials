import { DspDesignRuntime } from "../dto/DspDesign.ts";
import { createRequestId, INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";

export interface RuntimeUpdateEvent extends INnounceClientRequestEvent {
	data: DspDesignRuntime;
}

export function createRuntimeUpdateEvent(data: DspDesignRuntime): RuntimeUpdateEvent {
	return {
		data: data,
		requestId: createRequestId(),
		type: "runtimeUpdateEvent"
	}
}