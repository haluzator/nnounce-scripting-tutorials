const nnApi: NnounceScriptingApi;
/**
 * Represents a control interface for input pin in analog mode.
 * Pins are numbered from 1.
 *
 * Analog mode returns ratio between voltage on pin and rail voltage:
 * - 1.0 - pin is high (has rail voltage)
 * - 0.5 - pin has half of the rail voltage
 * - 0.0 - pin is low (has 0 voltage)
 */
type AnalogInputPinControl = {
    /**
     * Returns the current voltage on the pin.
     */
    getValue: () => number;
    /**
     * Registers a callback to be invoked when the voltage on the pin changes.
     *
     * The callback is triggered whenever there is a change in the pin's voltage. It provides
     * the new voltage and the previous voltage as parameters.
     *
     * @param changeCb the callback function that receives two parameters:
     *                 the new voltage (```value```) and the previous voltage (```oldValue```).
     */
    onChange: {
        (changeCb: {
            (value: number, oldValue: number): void;
        }): void;
    };
};

/**
 * Represents a function that accepts two input arguments and does not return a result.
 *
 * @template T - The type of the first input argument to the operation.
 * @template R - The type of the second input argument to the operation.
 */
type BiConsumer<T, R> = {
    (data1: T, data2: R): void;
};

class ButtonStates {
    private static INSTANCE;
    private buttonStates;
    private buttonChangeListeners;
    private webSocket;
    private initialized;
    constructor(webSocket: WebSocketCommunication);
    static initInstance(): Promise<void>;
    /**
     * Return singleton instance
     */
    static getInstance(webSocket: WebSocketCommunication): ButtonStates;
    getButtonNames(): string[];
    getButtonActive(buttonName: string): boolean | undefined;
    onButtonChange(buttonName: string, listener: Consumer<boolean>): void;
    private onButtonStateEvent;
}

/**
 * Represents a callback function type that takes no arguments and returns no value.
 */
type Callback = {
    (): void;
};


declare module 'nnounceConnector' {
/**
 * Tries to connect to the nnounce device. If successful, an instance of {@link NnounceScriptingApi} is returned.
 *
 * @param hostname Hostname or IP address of the device.
 * @param apiKey API key to be used for authentication (can be null).
 * @param connectionOptions Connection options object
 */
export function connectDevice(hostname: string, apiKey: string | null, connectionOptions?: ConnectionOptions): NnounceScriptingApi;
}


/**
 * Represents the configuration options for a connection.
 *
 * @property {boolean} [enableInternalLogging] - A flag to indicate whether internal logging is enabled.
 */
interface ConnectionOptions {
    enableInternalLogging?: boolean;
}

/**
 * A type definition for a Consumer function.
 *
 * @template T - The type of the input parameter that the Consumer function accepts.
 * @typedef {function} Consumer
 * @param {T} data - The input data to be consumed by the function.
 */
type Consumer<T> = {
    (data: T): void;
};

/**
 * Represents a control interface for input pin in digital mode, capable of reading the pin state and monitoring changes in its state.
 * Pins are numbered from 1.
 *
 * Digital mode returns true or false based on voltage on pin compared to rail voltage.
 * - \>=0.6 - pin is high (has rail voltage) - true
 * - 0.0 - pin is low (has 0 voltage) - false
 */
type DigitalInputPinControl = {
    /**
     * Returns the state of the input pin based on detected voltage.
     *
     * If the voltage at the pin is at least 60% of the reference voltage, this method returns ```true```;
     * otherwise, it returns ```false```.
     */
    getValue: () => boolean;
    /**
     * Registers a callback to listen for changes in the pin's voltage state.
     *
     * The change is evaluated as a boolean transition: when the voltage crosses the threshold of 60%
     * of the reference voltage. This means the voltage either rises from below 60% to above 60%, or
     * falls from above 60% to below 60%. The callback is invoked with the new boolean value representing
     * the pin's digital state.
     *
     * @param changeCb the callback function that receives the new pin state as a boolean value
     */
    onChange: {
        (changeCb: {
            (value: boolean): void;
        }): void;
    };
};

/**
 * Represents a control interface for output pin in digital mode.
 * Pins are numbered from 1
 *
 * Digital mode returns true or false based on voltage on pin compared to rail voltage.
 * - \>=0.6 - pin is high (has rail voltage) - true
 * - 0.0 - pin is low (has 0 voltage) - false
 */
type DigitalOutputPinControl = {
    /**
     * Returns the state of the control pin based on the detected voltage.
     *
     * If the voltage at the control pin is at least 60% of the reference voltage, this method
     * returns ```true```; otherwise, it returns ```false```.
     */
    getValue: {
        (): boolean;
    };
    /**
     * Sets the control pin state based on the provided boolean value.
     *
     * If ```true``` is passed, the control pin is set to the rail voltage. If ```false``` is passed,
     * the control pin is set to 0 volts.
     *
     * @param value the desired state of the control pin
     */
    setValue: {
        (value: boolean): void;
    };
};

/**
 * Represents an object with all info about hardware.
 */
type HwInfo = {
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
};

/**
 * Represents a general event with a specific type.
 *
 * This interface is a base or contract for implementing
 * events driving this API.
 *
 * @interface IEvent
 */
interface IEvent {
    /**
     * Specific event type.
     */
    type: string;
}

/**
 * Interface for outgoing request events, which expects response with result.
 */
interface INnounceClientRequestEvent extends IEvent {
    /**
     * Unique request identifier, which is sent back in the response event to pair request and response.
     */
    requestId: string;
}

/**
 * Interface for incoming events, which are response for request.
 */
interface INnounceClientResultEvent extends IEvent {
    /**
     * Unique request identifier to pair request with response.
     */
    requestId: string;
    /**
     * Request result. It can have value OK or FAILED.
     */
    state: string;
    /**
     * Reason of the request fail, if applicable.
     */
    failReason: string;
}

/**
 * This interface is designed to handle the removal of event listeners associated with input controls.
 *
 * @interface InputControl
 * @property {Callback} removeListener - A callback used for removing a listener associated with the input control.
 */
interface InputControl {
    removeListener: Callback;
}

/**
 * Represents the configuration and control of an I/O pin.
 *
 * This interface defines a structure for managing I/O pins, including their type, mode, pin number, and value.
 *
 * Properties:
 * - pinType: Specifies the type of I/O pin.
 * - pinMode: Defines the mode of the pin, such as input or output.
 * - pin: The number of the pin.
 * - value: The current state or value of the pin (e.g., HIGH/LOW or analog value).
 */
interface IoControl {
    pinType: IoPinType;
    pinMode: IoPinMode;
    pin: number;
    value: number;
}

/**
 * A class responsible for managing and tracking the states of input and output controls.
 * This includes managing state updates and notifying listeners of input changes.
 */
class IOControlStates {
    private static INSTANCE;
    /**
     * Represents a mapping of output pin numbers to their respective IoControl instances.
     *
     * This map is used for managing and controlling output states, where the key is the pin
     * number (of type number) and the value is an instance of IoControl, which provides
     * functionalities or configurations associated with that specific pin.
     *
     * The `outputStates` variable allows developers to track and manipulate the state
     * of various output pins efficiently.
     *
     * @type {Map<number, IoControl>}
     */
    private outputStates;
    /**
     * Stores the current state values of input pins.
     * The key is the pin number and the value is the input level.
     *
     * @type {Map<number, number>}
     */
    private inputStates;
    /**
     * Maps input pins to their associated change listeners.
     * When an input pin's state changes, all registered listeners for that pin are notified.
     *
     * @type {Map<number, Array<BiConsumer<number, number>>>}
     */
    private inputChangeListeners;
    /**
     * WebSocket communication instance used for sending/receiving IO control events.
     *
     * @type {WebSocketCommunication}
     */
    private webSocket;
    /**
     * Configuration for the logger, controls internal logging behavior.
     *
     * @type {NnLoggerConfig}
     */
    private loggerConfig;
    /**
     * Flag indicating whether the instance has been fully initialized.
     *
     * @type {boolean}
     */
    private initialized;
    /**
     * Creates a new instance of IOControlStates.
     * Initializes the WebSocket communication and sets up event handlers for IO pin state notifications.
     *
     * @param {WebSocketCommunication} webSocket - WebSocket communication instance for sending/receiving events
     * @param {NnLoggerConfig} loggerConfig - Configuration for logging
     */
    constructor(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig);
    /**
     * Returns the singleton instance of IOControlStates.
     * If the instance doesn't exist, it creates a new one with the provided parameters.
     *
     * @param {WebSocketCommunication} webSocket - WebSocket communication instance for sending/receiving events
     * @param {NnLoggerConfig} loggerConfig - Configuration for logging
     * @return {IOControlStates} The singleton instance of IOControlStates
     */
    static getInstance(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig): IOControlStates;
    /**
     * Initializes the already created singleton instance by setting up WebSocket
     * subscriptions for IO pin state updates.
     *
     * This method must be called after getInstance() and before using any IO control
     * functionality. It sends a subscription request to receive regular updates of
     * pin states and initializes internal state tracking.
     *
     * @throws {Error} If the instance hasn't been created yet via getInstance()
     * @throws {Error} If the initialization process fails
     * @return {Promise<void>} A promise that resolves when initialization is complete
     */
    static initInstance(): Promise<void>;
    /**
     * Retrieves the IoControl instance for a specified output pin.
     *
     * @param {number} pin - The pin number to get the output value for
     * @return {IoControl | undefined} The IoControl instance for the pin or undefined if not found
     */
    getOutputValue(pin: number): IoControl | undefined;
    /**
     * Retrieves the current value of a specified input pin.
     *
     * @param {number} pin - The pin number to get the input value for
     * @return {number} The current value of the input pin (defaults to 0 if not found)
     */
    getInputValue(pin: number): number;
    /**
     * Registers a callback function to be called when an input pin's value changes.
     *
     * @param {number} input - The pin number to listen for changes on
     * @param {BiConsumer<number, number>} listener - Callback function that receives the new value and old value
     * @return {InputControl} An object with a removeListener method to unregister the callback
     */
    onInputChange(input: number, listener: BiConsumer<number, number>): InputControl;
    /**
     * Processes an array of IoControl states received from the hardware.
     * Updates internal state maps and triggers callbacks for changed inputs.
     *
     * @param {Array<IoControl>} states - Array of IoControl objects containing pin state information
     */
    private onControlStateEvent;
    /**
     * Determines if a change in input value is significant enough to trigger callbacks.
     *
     * @param {number} currentLevelState - The current value of the input
     * @param {number} lastState - The previous value of the input
     * @return {boolean} True if the change is significant (> 0.1), false otherwise
     */
    private isChangeOnInput;
    /**
     * Updates the internal map of output states based on received IoControl states.
     *
     * @param {Array<IoControl>} states - Array of IoControl objects containing pin state information
     */
    private updateOutputValues;
}

/**
 * Enumeration representing the available modes for an I/O pin.
 *
 * This enum is used to define whether an I/O pin is set up for
 * receiving input signals or sending output signals.
 *
 * Members:
 * - INPUT: Indicates that the pin is configured for receiving input.
 * - OUTPUT: Indicates that the pin is configured for sending output.
 */
enum IoPinMode {
    INPUT = "input",
    OUTPUT = "output"
}

/**
 * Represents the different types of I/O pins that can be configured in a hardware interface.
 *
 * Enum IoPinType provides a set of predefined constants to define the type of the pin.
 *
 * Types include:
 * - CONTROL: Represents a pin configured for control operations with set direction (input or output).
 * - GPIO: Represents a pin configured as a General Purpose Input/Output (GPIO) which can be dynamically switched between input and output.
 */
enum IoPinType {
    CONTROL = "control",
    GPIO = "gpio"
}

/**
 * Log with desired level. Pass format string and arguments separately.
 * @example
 * // log at info level:
 * device.logger.info("Today's weather is {}, number of days since last accident: {}", "sunny", 42);
 */
interface LoggerInterface {
    /** Log at DEBUG level. */
    debug: (format: string, ...args: unknown[]) => void;
    /** Log at INFO level. */
    info: (format: string, ...args: unknown[]) => void;
    /** Log at WARN level. */
    warn: (format: string, ...args: unknown[]) => void;
    /** Log at ERROR level. */
    error: (format: string, ...args: unknown[]) => void;
    /** Log at CRITICAL level. */
    critical: (format: string, ...args: unknown[]) => void;
}

/**
 * Control for button in momentary mode.
 */
type MomentaryButtonControl = {
    /**
     * Represents a callback function that will be executed when an associated
     * button press event occurs.
     *
     * @type {function}
     * @param {function} onPressCb - A callback function to be invoked when the press action is triggered.
     *                               The callback accepts no parameters and returns no value.
     */
    onPress: {
        (onPressCb: {
            (): void;
        }): void;
    };
    /**
     * Represents a callback function that will be executed when an associated
     * button release event occurs.
     *
     * @type {function}
     * @param {function} onReleaseCb - A callback function to be invoked when the release action is triggered.
     *                               	The callback accepts no parameters and returns no value.
     */
    onRelease: {
        (onReleaseCb: {
            (): void;
        }): void;
    };
    /**
     * Retrieves a boolean value, <true> if associated button is pressed.
     *
     * @returns {boolean} A boolean value indicating if button is pressed.
     */
    getValue: () => boolean;
};

/**
 * Represents a utility for retrieving network-related information such as
 * available interfaces and corresponding IP addresses, MAC addresses,
 * and system hostname.
 */
type NetworkStatus = {
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
};

class NnButtonsDefinition {
    private static INSTANCE;
    private buttonStates;
    private constructor();
    /**
     * Return singleton instance
     */
    static getInstance(buttonStates: ButtonStates): NnButtonsDefinition;
    /**
     * Retrieves an array containing the names of available buttons.
     *
     * @return {Array<string>} An array of available button names.
     */
    names(): Array<string>;
    /**
     * Returns control for button in momentary mode.
     * @param buttonName Name of button to be controlled.
     */
    momentary(buttonName: string): MomentaryButtonControl;
    /**
     * Returns control for button in toggle mode.
     * @param buttonName Name of button to be controlled.
     */
    toggle(buttonName: string): ToggleButtonControl;
    private reactOnButtonState;
    private getButtonState;
}

/**
 * Fixed pins - hardcoded in hardware and cannot be changed
 *
 * inputs:
 * - digital | analog
 */
class NnControlInputsDefinition {
    private static INSTANCE;
    private ioControlStates;
    /**
     * Constructor for initializing an instance of the class with the given IO control states.
     * @param {IOControlStates} ioControlStates - The initial IO control states to be set for the instance.
     */
    private constructor();
    /**
     * Return singleton instance
     */
    static getInstance(ioControlStates: IOControlStates): NnControlInputsDefinition;
    /**
     * Get pin control in digital mode. Method param indicates which pin is controlled.
     * Pins are numbered from 1.
     *
     * Digital mode returns true or false based on voltage on pin compared to rail voltage.
     * - \>=0.6 - pin is high (has rail voltage) - true
     * - 0.0 - pin is low (has 0 voltage) - false
     * @param pin numbered from 1
     */
    digital(pin: number): DigitalInputPinControl;
    /**
     * Get pin control in analog mode. Method param indicates which pin is controlled.
     * Pins are numbered from 1.
     *
     * Analog mode returns ratio between voltage on pin and rail voltage:
     * - 1.0 - pin is high (has rail voltage)
     * - 0.5 - pin has half of the rail voltage
     * - 0.0 - pin is low (has 0 voltage)
     * @param pin numbered from 1
     */
    analog(pin: number): AnalogInputPinControl;
    private reactOnInputChange;
    private getInputValue;
}

/**
 * Fixed pins - hardcoded in hardware and cannot be changed
 *
 * outputs:
 * - digital | analog | relay
 */
class NnControlOutputsDefinition {
    private static INSTANCE;
    private webSocket;
    private loggerConfig;
    private ioControlStates;
    /**
     * Constructs a new instance of the class.
     *
     * @param {WebSocketCommunication} webSocket - Instance of the WebSocketCommunication for managing WebSocket communication.
     * @param {NnLoggerConfig} loggerConfig - Configuration settings for the logger.
     * @param {IOControlStates} ioControlStates - The IO control states required for managing input/output.
     */
    private constructor();
    /**
     * Return singleton instance
     */
    static getInstance(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig, ioControlStates: IOControlStates): NnControlOutputsDefinition;
    /**
     * Get pin control in digital mode. Method param indicates which pin is controlled.
     * Pins are numbered from 1.
     *
     * Digital mode returns true or false based on voltage on pin compared to rail voltage.
     * - \>=0.6 - pin is high (has rail voltage) - true
     * - 0.0 - pin is low (has 0 voltage) - false
     * @param pin numbered from 1
     */
    digital(pin: number): DigitalOutputPinControl;
    /**
     * Get pin control in relay mode. Method param indicates which pin is controlled.
     * Pins are numbered from 1.
     *
     * relay SPST On-Off:
     * - 1.0 - relay is closed
     * - 0.0 - relay is open
     *
     * relay SPDT On-On:
     * - 1.0 - relay is closed (C connected to NO)
     * - 0.0 - relay is open (C connected to NC)
     * @param pin numbered from 1
     */
    relay(pin: number): RelayOutputPinControl;
    private setOutputValue;
    private getOutputValue;
}

/**
 * Util for working with components
 */
class NnDspComponent {
    private static INSTANCE;
    private webSocket;
    private loggerConfig;
    /**
     * Constructs an instance of the class with the specified WebSocket communication handler and logger configuration.
     *
     * @param {WebSocketCommunication} websocket - The WebSocket communication handler used for data transmission.
     * @param {NnLoggerConfig} loggerConfig - The configuration settings for the logger.
     */
    private constructor();
    /**
     * Return singleton instance
     */
    static getInstance(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig): NnDspComponent;
    /**
     * Method return gain component by its ID/name or null if none exists
     * @param id number|string
     * - number - id of the component
     * - string - name of the component
     */
    gain(id: number | string): NnDspComponentControl;
    /**
     * Method return net RX component by its ID/name or null if none exists
     * @param id number|string
     * - number - id of the component
     * - string - name of the component
     */
    netRx(id: number | string): NnDspComponentControl;
    /**
     * Method return net TX component by its ID/name or null if none exists
     * @param id number|string
     * - number - id of the component
     * - string - name of the component
     */
    netTx(id: number | string): NnDspComponentControl;
    /**
     * Method returns ducker component by its ID/name or null if none exist
     * @param id number|string
     * - number - id of the component
     * - string - name of the component
     */
    ducker(id: number | string): NnDspDuckerControl;
}

/**
 * Interface to control component gain value and output mute state.
 */
interface NnDspComponentControl {
    /**
     * Set gain of component.
     * @param value - gain value in dB.
     */
    setGain: {
        (value: number): Promise<void>;
    };
    /**
     * Get gain of component.
     * @return gain value in dB.
     */
    getGain: {
        (): number | undefined;
    };
    /**
     * Un/mute component output.
     * @param mute - true to mute component output, false to unmute
     */
    setMute: {
        (mute: boolean): Promise<void>;
    };
    /**
     * Get mute state of component output.
     * @return true if component output is muted, false otherwise.
     */
    isMute: {
        (): boolean | undefined;
    };
}

/**
 * Define API for updating components
 */
class NnDspDefinition {
    private static INSTANCE;
    private _components;
    /**
     * Private constructor for initializing the components using the provided WebSocket communication and logger configuration.
     *
     * @param {WebSocketCommunication} webSocket - The WebSocket communication instance used for message exchange.
     * @param {NnLoggerConfig} loggerConfig - Configuration instance for logger settings.
     */
    private constructor();
    /**
     * Components holder
     */
    get components(): NnDspComponent;
    /**
     * Retrieves the singleton instance of the NnDspDefinition class. If the instance does not exist, it initializes a new one
     * using the provided WebSocketCommunication and logger configuration.
     *
     * @param {WebSocketCommunication} webSocket - The WebSocket communication instance to be used.
     * @param {NnLoggerConfig} loggerConfig - The logger configuration for the instance.
     * @return {NnDspDefinition} The singleton instance of NnDspDefinition.
     */
    static getInstance(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig): NnDspDefinition;
}

/**
 * Represents the control interface for managing a DSP Ducker's behavior.
 */
interface NnDspDuckerControl {
    /**
     * Registers a listener for the ducker priority input active change event.
     * @param onActiveChangeCb The callback function to be invoked each time the ducker priority input state changes. Consumed boolean indicates whether priority input is active.
     */
    onActiveChange: {
        (onActiveChangeCb: {
            (priorityActive: boolean): void;
        }): void;
    };
}

/**
 * Config for global logger used in nnounce script API for logging.
 * By default, logging with global logger in nnounce script API is disabled.
 */
class NnLoggerConfig {
    private static INSTANCE;
    private constructor();
    /**
     * Return singleton instance
     */
    static getInstance(): NnLoggerConfig;
    private enabledInternal;
    /**
     * Return true, if script API logs are enabled
     */
    isEnabledInternal(): boolean;
    /**
     * Enable/disable script API logs
     * @param enable
     */
    setEnabledInternal(enable: boolean): void;
}


declare module 'nnounceDevice' {
/**
 * Tries to connect to the nnounce device. If successful, an instance of {@link NnounceScriptingApi} is returned.
 *
 * Hostname and api-key are searched for environment variables as {@link HOSTNAME} and {@link API_KEY} respectively:
 * If no hostname is provided, "localhost" is used.
 * If no api-key is provided, null is used.
 *
 * @param connectionOptions Connection options object
 */
export function nnounceDevice(connectionOptions?: ConnectionOptions): NnounceScriptingApi;
}


/**
 * Nnounce scripting interface.
 * Its fields control/manage different parts/modules of nnounce device.
 */
interface NnounceScriptingApi {
    /**
     * Play local or remote file.
     * see {@link NnPagingRouterDefinition}
     */
    pagingRouter: NnPagingRouterDefinition;
    /**
     * Handle control inputs in analog or digital mode.
     * Input pins are numbered from 1.
     * see {@link NnControlInputsDefinition}
     */
    controlInputs: NnControlInputsDefinition;
    /**
     * Handle control outputs in relay or digital mode.
     * Output pins are numbered from 1.
     * see {@link NnControlOutputsDefinition}
     */
    controlOutputs: NnControlOutputsDefinition;
    /**
     * Handle DSP - control ducker, gain, net Rx and net Tx components.
     * see {@link NnDspDefinition}
     * */
    dsp: NnDspDefinition;
    /**
     * Use this for logging.
     * see {@link LoggerInterface}
     */
    logger: LoggerInterface;
    /**
     * Logger configuration. Disable/enable logs from internal code.
     * see {@link NnLoggerConfig}
     */
    loggerConfig: NnLoggerConfig;
    /**
     * Handle SNMP traps.
     * see {@link NnSnmpDefinition}
     */
    snmp: NnSnmpDefinition;
    /**
     * System information.
     * Get network interfaces status, hardware info and system variables.
     *  see {@link NnSystemDefinition}
     */
    system: NnSystemDefinition;
    /**
     * Some convenient utility functions.
     * see {@link NnUtilDefinition}
     */
    util: NnUtilDefinition;
    /**
     * Handle buttons in momentary or toggle mode.
     */
    buttons: NnButtonsDefinition;
    /**
     * Function to tell if the device is connected.
     */
    isConnected: () => boolean;
    /**
     * Promise of device connection. If you want to block and wait for the device connection, await on this promise.
     */
    connectionPromise: () => Promise<NnounceScriptingApi>;
}

/**
 * Provides API for processing calls on a device.
 * Local or remote files can be played. Supported formats are:
 * <ul>
 *     <li>.mp3</li>
 *     <li>.flac</li>
 *     <li>.wav</li>
 * </ul>
 */
class NnPagingRouterDefinition {
    private static INSTANCE;
    private callPrepareWaitingMap;
    private callTimeoutMap;
    private webSocket;
    private loggerConfig;
    /**
     * Private constructor for initializing a new instance of the class.
     * The constructor sets up event handlers for WebSocket communication and assigns the provided logger configuration.
     *
     * @param {WebSocketCommunication} webSocket - The WebSocket communication instance used for event handling.
     * @param {NnLoggerConfig} loggerConfig - The configuration object for logger settings.
     */
    private constructor();
    /**
     * Return singleton instance
     */
    static getInstance(webSocket: WebSocketCommunication, loggerConfig: NnLoggerConfig): NnPagingRouterDefinition;
    /**
     * This method will start call, playing a local file from the File manager.
     * @return call actionId. It can be used for future actions (e.g. cancel call)
     * @param spec Local file specification, see {@link PlayLocalFileParam}
     */
    playLocalFile(spec: PlayLocalFileParam): string | null;
    /**
     * This method will start call, playing a remote file.
     * @return call actionId. It can be used for future actions (e.g. cancel call)
     * @param spec Remote file specification, see {@link PlayRemoteFileParam}
     */
    playRemoteFile(spec: PlayRemoteFileParam): string | null;
    /**
     * Cancel call with given actionId
     * @param actionId - unique identifier of the call
     */
    cancelCall(actionId: string): void;
    private onCallPrepareResultEvent;
    private onCallResultEvent;
    private onCallProgressEvent;
}

/**
 * Define API for working with snmp traps
 */
class NnSnmpDefinition {
    static INSTANCE: NnSnmpDefinition;
    private webSocket;
    /**
     * Creates an instance of the class with a specified WebSocketCommunication object.
     *
     * @param {WebSocketCommunication} webSocket - The WebSocketCommunication instance used for communication.
     */
    private constructor();
    /**
     * Return singleton instance
     */
    static getInstance(webSocket: WebSocketCommunication): NnSnmpDefinition;
    /**
     * Method will create subscription for SNMP traps.
     * @param eventConsumer {@link Consumer} of {@link SnmpTrapSubscriptionNotify}
     */
    subscribeForTrap(eventConsumer: Consumer<SnmpTrapSubscriptionNotify>): void;
}

/**
 * Provides access to Nnounce device system information
 */
class NnSystemDefinition {
    /**
     * Singleton instance of NnSystemDefinition
     */
    private static INSTANCE;
    /**
     * Control interface for system variables
     */
    private systemVariablesControl;
    /**
     * Definition for device network config
     */
    private systemNetwork;
    /**
     * Private constructor to enforce singleton pattern
     *
     * @param systemVariablesControl The system variables control definition
     * @param systemNetwork The system network definition
     */
    private constructor();
    /**
     * Return singleton instance
     */
    static getInstance(systemVariablesControl: SystemVariablesControlDefinition, systemNetwork: SystemDefinition): NnSystemDefinition;
    /**
     * Returns network status of the device:
     *  - interfaces
     *  - IP4 address (first routing address)
     *  - IP6 address (first routing address)
     *  - mac address
     *  - hostname
     *  @return {@link NetworkStatus} object
         */
     network: NetworkStatus;
     /**
      * Returns hardware info of the device:
      * - firmware version
      * - model
      * - model type
      * - serial number
      * - version
      * @return {@link HwInfo} object
          */
      hw: HwInfo;
      /**
       * Returns configured system variables:
       * - get - if present, return variable as string
       * @return {@link SystemVariables} object
           */
       variables: SystemVariables;
      }

      /**
       * Nnounce useful utils
       */
      class NnUtilDefinition {
          private static INSTANCE;
          private constructor();
          /**
           * Return singleton instance
           */
          static getInstance(): NnUtilDefinition;
          /**
           * Try to convert string value to number.
           * If value is not a number, then the returned result is 'undefined'
           * @param stringValue
           */
          toNumber(stringValue: string): number | undefined;
          /**
           * Try to convert string value to boolean.
           * If value is not 'true' or 'false', then the returned result is 'undefined'
           * @param stringValue
           */
          toBoolean(stringValue: string): boolean | undefined;
          /**
           * The sleep method pauses execution for a specified duration.
           * @param durationMs
           */
          sleep(durationMs: number): Promise<unknown>;
      }

      /**
       * Defines the parameters required for playing a local file.
       */
      type PlayLocalFileParam = {
          /**
           * Priority of the call. The lower the number, the higher the priority.
           */
          priority: number;
          /**
           * Name of the file saved in the file manager (include folder structure).
           */
          audioFilePath: string;
          /**
           * Router output names, where the call should be played.
           */
          outputs: Array<string>;
          /**
           * Unique identifier of the call.
           * If empty, the current timestamp will be used.
           */
          actionId?: string;
          /**
           * Whether the call is partial or not.
           * Partial call means that not all outputs need to be reached for the call to be successful.
           * Default is false.
           */
          partial?: boolean;
      };

      /**
       * Represents the parameters required to play a remote file.
       */
      type PlayRemoteFileParam = {
          /**
           * Priority of the call. The lower the number, the higher the priority.
           */
          priority: number;
          /**
           * Router output names, where the call should be played.
           */
          outputs: Array<string>;
          /**
           * Filename used for caching - should be unique for different content, same for same audio files.
           */
          filename: string;
          /**
           * Unique identifier of the call.
           * If empty, the current timestamp will be used
           */
          actionId?: string;
          /**
           * Whether the call is partial or not.
           * Partial call means that not all outputs need to be reached for the call to be successful.
           * Default is false.
           */
          partial?: boolean;
          /**
           * Audio source info.
           */
          audioSource: RemoteFileAudioSource;
      };

      /**
       * Represents a control interface for output pin in relay mode.
       * Pins are numbered from 1.
       *
       * relay SPST On-Off:
       * - 1.0 - relay is closed
       * - 0.0 - relay is open
       *
       * relay SPDT On-On:
       * - 1.0 - relay is closed (C connected to NO)
       * - 0.0 - relay is open (C connected to NC)
       */
      type RelayOutputPinControl = {
          /**
           * Opens the relay, setting its state to open.
           *
           * This method activates the relay, allowing the circuit to be broken (i.e., no current flows through).
           */
          open: {
              (): void;
          };
          /**
           * Closes the relay, setting its state to closed.
           *
           * This method activates the relay to complete the circuit, allowing current to flow through.
           */
          close: {
              (): void;
          };
          /**
           * Checks if the relay is currently open.
           *
           * @return ```true``` if the relay is open (circuit is broken), ```false``` otherwise.
           */
          isOpen: {
              (): boolean;
          };
          /**
           * Checks if the relay is currently closed.
           *
           * @return ```true``` if the relay is closed (circuit is complete), ```false``` otherwise.
           */
          isClosed: {
              (): boolean;
          };
      };

      /**
       * Represents a source for remote audio file playback, providing support for authentication, headers, and file validation.
       */
      interface RemoteFileAudioSource {
          /**
           * URL of the audio file to be played.
           */
          url: string;
          /**
           * Headers which will be set to HTTP request.
           */
          headers?: Map<string, string>;
          /**
           * Basic auth username
           * If empty or 'Authorization' header is present in headers, this field won't be applied
           */
          basicAuthUsername?: string;
          /**
           * Basic auth password
           * If empty or 'Authorization' header is present in headers, this field won't be applied
           */
          basicAuthPassword?: string;
          /**
           * File's checksum for validation that the file is not corrupted during download.
           * If empty, checksum validation won't be applied.
           */
          checksum?: string;
          /**
           * Checksum function used to generate checksum from downloaded file.
           * If empty, checksum validation won't be applied.
           * <p>
           * Supported algorithms:
           * <ul>
           *    <li>blake2b</li>
           *    <li>blake3</li>
           *    <li>sha2-256</li>
           *    <li>sha2-512</li>
           *    <li>sha3-256</li>
           *    <li>sha3-512</li>
           * </ul>
           */
          checksumMethod?: string;
      }

      /**
       * Represents a notification for an SNMP Trap subscription event.
       * This interface extends the base event structure provided by `IEvent`.
       */
      interface SnmpTrapSubscriptionNotify extends IEvent {
          /**
           * Represents the name or identifier of a trap.
           */
          trap: string;
          /**
           * Array of recipient tags.
           * Subscribers can specify tags when subscribing to later know which notifications are intended for them.
           */
          responseTags: Array<string>;
      }

      /**
       * The SystemDefinition class provides methods to retrieve system-related information
       * such as firmware version, hardware details, and network status using a WebSocket communication channel.
       */
      class SystemDefinition {
          private static INSTANCE;
          private webSocket;
          private status;
          private initialized;
          /**
           * Creates a new instance of SystemDefinition with the provided WebSocket communication channel.
           *
           * @param webSocket - The WebSocket communication instance used to interact with the device
           */
          constructor(webSocket: WebSocketCommunication);
          /**
           * Returns the singleton instance of SystemDefinition.
           * If the instance doesn't exist, creates a new one with the provided WebSocket.
           *
           * @param webSocket - The WebSocket communication instance used to interact with the device
           * @returns The singleton instance of SystemDefinition
           */
          static getInstance(webSocket: WebSocketCommunication): SystemDefinition;
          /**
           * Initialize the system definition instance and set the current status, which will be automatically updated whenever a change occurs
           */
          static initInstance(): Promise<void>;
          /**
           * Sets the current status of the system from a status event.
           *
           * @param status - The status event containing system information
           * @private
           */
          private setStatus;
          /**
           * Returns the firmware version of the device.
           *
           * @returns The firmware version as a string
           */
          getFirmwareVersion(): string;
          /**
           * Returns the model of the device.
           *
           * @returns The device model as a string
           */
          getModel(): string;
          /**
           * Returns the model type of the device.
           *
           * @returns The device model type as a string
           */
          getModelType(): string;
          /**
           * Returns the version of the device system.
           *
           * @returns The system version as a string
           */
          getVersion(): string;
          /**
           * Returns the serial number of the device.
           *
           * @returns The serial number as a string
           */
          getSerialNumber(): string;
          /**
           * Returns the names of all network interfaces available on the device.
           *
           * @returns An array of interface names
           */
          getInterfaces(): string[];
          /**
           * Returns the first IPv4 address for the specified network interface.
           *
           * @param interfaceName - The name of the network interface
           * @returns The IPv4 address as a string, or undefined if not available
           */
          getIp4Address(interfaceName: string): string | undefined;
          /**
           * Returns the first IPv6 address for the specified network interface.
           *
           * @param interfaceName - The name of the network interface
           * @returns The IPv6 address as a string, or undefined if not available
           */
          getIp6Address(interfaceName: string): string | undefined;
          /**
           * Returns the MAC address for the specified network interface.
           *
           * @param interfaceName - The name of the network interface
           * @returns The MAC address as a string, or undefined if not available
           */
          getMacAddress(interfaceName: string): string | undefined;
          /**
           * Returns the hostname of the device.
           *
           * @returns The hostname as a string
           */
          getHostname(): string;
          /**
           * Handles network change events by updating the network information in the system status.
           *
           * @param event - The network change notification event
           * @private
           */
          private onNetworkChangeEvent;
      }

      /**
       * Represents an interface for accessing system variables.
       */
      type SystemVariables = {
          /**
           * Retrieves the value of a system variable by its name.
           *
           * @param variableName The name of the variable to retrieve
           * @return The value of the variable as a string, or undefined if the variable doesn't exist
           */
          get: (variableName: string) => string | undefined;
      };

      /**
       * System variables control to manage variables from server
       */
      class SystemVariablesControlDefinition {
          private static INSTANCE;
          private webSocket;
          private systemVariablesMap;
          private initialized;
          /**
           * Private constructor for initializing the instance with WebSocket communication and system variables map.
           *
           * @param {WebSocketCommunication} webSocket - The WebSocket communication instance for handling WebSocket connections.
           * @param {Map<string, string>} systemVariablesMap - A map containing key-value pairs of system variables.
           */
          private constructor();
          /**
           * Returns the singleton instance of the SystemVariablesControlDefinition.
           * If the instance does not exist, it creates one using the provided WebSocketCommunication.
           *
           * @param {WebSocketCommunication} webSocket - The WebSocketCommunication object used to initialize the instance if it does not exist.
           * @return {SystemVariablesControlDefinition} The singleton instance of the SystemVariablesControlDefinition.
           */
          static getInstance(webSocket: WebSocketCommunication): SystemVariablesControlDefinition;
          /**
           * Initialize system variables control instance and set current system variables to map
           */
          static initInstance(): Promise<void>;
          /**
           * Get variable value by name
           * @param name
           */
          get(name: string): string | undefined;
          /**
           * Get system variable value.
           * If system variables wasn't initialized before, then load all system variables before return value
           * @param name
           * @private
           */
          private getVariableValue;
          /**
           * Handle processing system variable change event
           * @param event
           * @private
           */
          private systemVariableChange;
      }

      /**
       * Control for button in toggle mode.
       */
      type ToggleButtonControl = {
          /**
           * Callback function that is triggered when a change event occurs.
           *
           * @param {Function} onChangeCb - The callback function to handle the change event.
           * @param {boolean} onChangeCb.value - The boolean value indicating the state after the change event.
           * @returns {void} This function does not return any value.
           */
          onChange: {
              (onChangeCb: {
                  (value: boolean): void;
              }): void;
          };
          /**
           * Retrieves a boolean value, <true> if associated button is pressed.
           *
           * @returns {boolean} A boolean value indicating if button is pressed.
           */
          getValue: () => boolean;
      };

      /**
       * Manages WebSocket communication for subscribing to events, sending messages,
       * handling responses, and managing reconnection and heartbeat mechanisms.
       */
      class WebSocketCommunication {
          private hostname;
          private apiKey;
          private loggerConfig;
          private socket;
          private reconnectTimeout;
          private subscriptionEvents;
          private disconnectEventBuffer;
          private eventHandlers;
          private eventResultHandlers;
          private heartbeatSendingInterval;
          private lastIncomeHeartbeat;
          /**
           * Creates an instance of the class, initializes with the provided hostname and API key, and establishes a connection.
           *
           * @param {string} hostname - The hostname of the server to connect to.
           * @param {string} apiKey - The API key used for authentication (optional).
           */
          constructor(hostname: string, apiKey: string | null, loggerConfig: NnLoggerConfig);
          private connect;
          /**
           * Sends an event message.
           * If the socket is disconnected, messages are queued and sent as soon as the websocket connects.
           *
           * Subscription events are handled a bit different:
           * They are added to the list of subscriptions and then sent.
           * In case the socket reconnects, all subscription events from the list are sent automatically to ensure subscription si renewed.
           *
           * @param {object} message - The message object to be sent.
           * @param {boolean} [isSubscriptionEvent=false] - Indicates if the message is a subscription event. Default is false.
           * @return {void} This method does not return a value.
           */
          sendEvent(message: object, isSubscriptionEvent?: boolean): void;
          /**
           * Sends a request event and waits for a corresponding response event.
           * The method attempts to resolve or reject the response based on the received event state.
           *
           * @param {REQUEST} requestEvent - The request event to be sent, which contains necessary details for processing.
           * @param {boolean} [isSubscriptionEvent=false] - Indicates whether the event being sent is a subscription-based event.
           * @return {Promise<RESPONSE>} Returns a Promise that resolves with the response event of type RESPONSE if the operation is successful, or rejects if there's a failure or timeout.
           */
          sendEventWithResponse<RESPONSE extends INnounceClientResultEvent, REQUEST extends INnounceClientRequestEvent>(requestEvent: REQUEST, isSubscriptionEvent?: boolean): Promise<RESPONSE>;
          /**
           * Adds an event handler for a specified event type.
           * Registers a callback function to handle events of the given type.
           *
           * @param {string} type - The type of the event to add a handler for.
           * @param {Consumer<IEvent>} onEvent - The callback function to handle the event.
           * @return {void} This method does not return a value.
           */
          addEventHandler(type: string, onEvent: Consumer<IEvent>): void;
          /**
           * Subscribes to a specific event by sending a subscription request and registering an event handler.
           *
           * @param {string} requestType - The type of the subscription request for subscribing to the event.
           * @param {string} responseType - The type of the response expected for the event.
           * @param {number} dataEveryMs - The interval, in milliseconds, at which the subscription notifications are expected.
           * @param {Consumer<IEvent>} onEvent - The consumer function that handles the received event.
           * @return {void} Does not return a value.
           */
          subscribeToEvent(requestType: string, responseType: string, dataEveryMs: number, onEvent: Consumer<IEvent>): void;
          /**
           * Subscribes to a live event by specifying the request and response types along with an event handler.
           *
           * @param {string} requestType - The type of the request that initiates the subscription to the event.
           * @param {string} responseType - The type of the response to be handled during the live event subscription.
           * @param {Consumer<IEvent>} onEvent - A callback function to handle the event when it occurs.
           * @return {void} This method does not return a value.
           */
          subscribeToLiveEvent(requestType: string, responseType: string, onEvent: Consumer<IEvent>): void;
          /**
           * Checks whether the WebSocket connection is currently open and active.
           *
           * @return {boolean} Returns true if the WebSocket connection exists and is in the OPEN state, otherwise returns false.
           */
          connected(): boolean;
          private sendMessageToSocket;
          private onDisconnect;
          private onConnect;
          private receiveMessage;
          private processResponse;
          private reconnect;
          private disconnect;
          private startSendHeartBeat;
          private stopSentHeartBeat;
          private isHeartbeatTimeout;
      }

      
