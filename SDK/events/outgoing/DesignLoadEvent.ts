import { createRequestId, INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";

export interface DesignLoadEvent extends INnounceClientRequestEvent {

}
export function createDesignLoadEvent(): DesignLoadEvent{
	return {
		type: "designLoadEvent",
		requestId: createRequestId()
	}
}