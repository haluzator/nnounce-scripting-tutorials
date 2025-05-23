import { IEvent } from "../IEvent.ts";
import { IoPinType } from "../../ioControl/IoPinType.ts";

export interface IoPinOutputSetRawEvent extends IEvent {
	pinType: IoPinType;
	pin: number;
	value: number;
}