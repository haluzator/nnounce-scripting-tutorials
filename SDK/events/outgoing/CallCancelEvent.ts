import { IEvent } from "../IEvent.ts";

export interface CallCancelEvent extends IEvent {
	actionId: string;
}

export function createCallCancelEvent(actionId: string): CallCancelEvent {
	return {
		actionId: actionId,
		type: "callCancelEvent"

	}
}