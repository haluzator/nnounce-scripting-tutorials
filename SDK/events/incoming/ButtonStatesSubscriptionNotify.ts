import { IEvent } from "../IEvent.ts";

export interface ButtonStatesSubscriptionNotify extends IEvent {
	data: Array<ButtonState>,
	responseTags: Array<string>
}

export interface ButtonState {
	name: string,
	active: boolean
}