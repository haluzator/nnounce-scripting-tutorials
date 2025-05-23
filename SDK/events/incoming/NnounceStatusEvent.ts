import { INnounceClientResultEvent } from "../INnounceClientResultEvent.ts";

export interface NnounceStatusEvent extends INnounceClientResultEvent {
	temperature: Array<number>;
	firmwareVersion: string;
	network: Array<NetworkStatusDto>;
	hwInfo: HwInfoDto;
	hostname: string;
}

export interface NetworkStatusDto {
	name: string;
	mac: string;
	inet4: Array<string>;
	inet6: Array<string>;
}

export interface HwInfoDto {
	modelType: string;
	model: string;
	version: string;
	serialNumber: string;
}