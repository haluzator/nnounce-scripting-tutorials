import { SystemVariablesControlDefinition } from "./nnSystem/SystemVariablesControlDefinition.ts";
import { SystemDefinition } from "./nnSystem/SystemDefinition.ts";

/**
 * Represents a utility for retrieving network-related information such as
 * available interfaces and corresponding IP addresses, MAC addresses,
 * and system hostname.
 */
export type NetworkStatus = {
	/**
	 * Returns an array of available network interface IDs.
	 *
	 * @return a ```String[]``` of network interface IDs.
	 */

	getInterfaces: () => string[];
	/**
	 * First IPv4 routing address for given interface
	 * @param interfaceName
	 */
	getIp4Address: (interfaceName: string) => string | undefined;
	/**
	 * First IPv6 routing address for given interface
	 * @param interfaceName
	 */
	getIp6Address: (interfaceName: string) => string | undefined;
	/**
	 * MAC address for given interface
	 * @param interfaceName
	 */
	getMacAddress: (interfaceName: string) => string | undefined;
	/**
	 * Configured hostname of device
	 * @param interfaceName
	 */
	getHostname: () => string;
}

/**
 * Represents an object with all info about hardware.
 */
export type HwInfo = {
	/**
	 * Device installed firmware version
	 * E.g. 1.4.0-1111
	 */
	getFirmwareVersion: () => string;
	/**
	 * Device model
	 * E.g. ionode4
	 */
	getModel: () => string;
	/**
	 * Device model
	 * E.g. IO4
	 */
	getModelType: () => string;
	/**
	 * Device system version
	 * E.g. 1.0
	 */
	getVersion: () => string;
	/**
	 * Device serial number
	 * E.g. IO40001
	 */
	getSerialNumber: () => string;
}

/**
 * Represents an interface for accessing system variables.
 */
export type SystemVariables = {
	/**
	 * Retrieves the value of a system variable by its name.
	 *
	 * @param variableName The name of the variable to retrieve
	 * @return The value of the variable as a string, or undefined if the variable doesn't exist
	 */
	get: (variableName: string) => string|undefined;
}

/**
 * Provides access to Nnounce device system information
 */
export class NnSystemDefinition {
	/**
	 * Control interface for system variables
	 */
	private systemVariablesControl: SystemVariablesControlDefinition;

	/**
	 * Definition for device network config
	 */
	private systemNetwork: SystemDefinition;

	/**
	 * Private constructor to enforce singleton pattern
	 *
	 * @param systemVariablesControl The system variables control definition
	 * @param systemNetwork The system network definition
	 */
	private constructor(systemVariablesControl: SystemVariablesControlDefinition, systemNetwork: SystemDefinition) {
		this.systemVariablesControl = systemVariablesControl;
		this.systemNetwork = systemNetwork;
	}

	/**
	 * Create new instance
	 */
	public static getInstance(systemVariablesControl: SystemVariablesControlDefinition, systemNetwork: SystemDefinition) {
		return new NnSystemDefinition(systemVariablesControl, systemNetwork);
	}

	/**
	 * Returns network status of the device:
	 *  - interfaces
	 *  - IP4 address (first routing address)
	 *  - IP6 address (first routing address)
	 *  - mac address
	 *  - hostname
	 *  @return {@link NetworkStatus} object
	 */
	public network: NetworkStatus = {
		getInterfaces: () => this.systemNetwork.getInterfaces(),
		getIp4Address: (interfaceName: string) => this.systemNetwork.getIp4Address(interfaceName),
		getIp6Address: (interfaceName: string) => this.systemNetwork.getIp6Address(interfaceName),
		getMacAddress: (interfaceName: string) => this.systemNetwork.getMacAddress(interfaceName),
		getHostname: () => this.systemNetwork.getHostname()
	}

	/**
	 * Returns hardware info of the device:
	 * - firmware version
	 * - model
	 * - model type
	 * - serial number
	 * - version
	 * @return {@link HwInfo} object
	 */
	public hw: HwInfo = {
		getFirmwareVersion: () => this.systemNetwork.getFirmwareVersion(),
		getModel: () => this.systemNetwork.getModel(),
		getModelType: () => this.systemNetwork.getModelType(),
		getVersion: () => this.systemNetwork.getVersion(),
		getSerialNumber: () => this.systemNetwork.getSerialNumber()
	}

	/**
	 * Returns configured system variables:
	 * - get - if present, return variable as string
	 * @return {@link SystemVariables} object
	 */
	public variables: SystemVariables = {
		get: (variableName: string) => this.systemVariablesControl.get(variableName)
	}
}
