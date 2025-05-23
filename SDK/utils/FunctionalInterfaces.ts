/**
 * A type definition for a Consumer function.
 *
 * @template T - The type of the input parameter that the Consumer function accepts.
 * @typedef {function} Consumer
 * @param {T} data - The input data to be consumed by the function.
 */
export type Consumer<T> = { (data: T): void };
/**
 * Represents a function that accepts two input arguments and does not return a result.
 *
 * @template T - The type of the first input argument to the operation.
 * @template R - The type of the second input argument to the operation.
 */
export type BiConsumer<T, R> = { (data1: T, data2: R): void };
/**
 * Represents a callback function type that takes no arguments and returns no value.
 */
export type Callback = { (): void };
/**
 * A generic functional type that represents a function with no parameters that returns a value of type T
 * when invoked.
 *
 * @template T The type of value to be supplied.
 */
export type Supplier<T> = { (): T };
/**
 * Represents a processor function that transforms data of type T into a result of type R.
 *
 * @template T The type of the input data to be processed.
 * @template R The type of the result produced by the processor function.
 * @typedef {function(T): R} Processor
 */
export type Processor<T, R> = { (data: T): R };
/**
 * Represents a type definition for a constructor.
 *
 * @template T The type of the instance that the constructor creates.
 */
export type Constructor<T> = { new (...args: any[]): T };