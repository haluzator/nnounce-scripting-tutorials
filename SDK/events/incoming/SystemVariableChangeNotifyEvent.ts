import { IEvent } from "../IEvent.ts";

export interface SystemVariableChangeNotifyEvent extends IEvent {
	name: string;
	value: string;
}