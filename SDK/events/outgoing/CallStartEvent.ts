import { IEvent } from "../IEvent.ts";

export interface CallStartEvent extends IEvent {
	actionId: string;
}

export function createCallStartEvent(actionId: string): CallStartEvent {
	return {
		actionId: actionId,
		type: "callStartEvent"

	}
}