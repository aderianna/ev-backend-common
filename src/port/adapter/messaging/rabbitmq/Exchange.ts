import Constant from './Constant';
import ConnectionSetting from "./ConnectionSetting";
import BrokerChannel from "./BrokerChannel";


/** I'm using it to display errors, if the specified environment variable 'DEBUG' is set
 * so the provided tag. Here I used 'error'. So if you want to see erros on your console,
 * then just set your environment variable to 'set DEBUG=error'
 */
const debugError = require('debug')('error');

/**
 * I am an exchange that simplifies RabbitMQ exchanges.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class Exchange extends BrokerChannel {
	/** A type, which is the type of exchange. */
	private _type: string;

	/**
	 * Answers a promise of a direct Exchange with the name __*name*__. The
	 * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
	 * @param connectionSetting The ConnectionSetting
	 * @param exchangeName The string name of the exchange
	 * @param isDurable The boolean indicating whether or not I am durable
	 */
	public static directInstance(
		connectionSetting: ConnectionSetting,
		exchangeName: string,
		isDurable: boolean
	): Promise<Exchange> {
		return new Promise(async (resolve, reject): Promise<void> => {
			let exchange = new this(
				connectionSetting,
				exchangeName,
				"direct",
				isDurable
			);
			try {
				await exchange.build();
				await exchange.assert();
				resolve(exchange);
			} catch (e) {
				debugError(Constant.EXCHANGE_BUILD_THROWS_ERROR + e);
				reject(Constant.EXCHANGE_BUILD_THROWS_ERROR + e);
			}
		});
	}

	/**
	 * Answers a promise of a fan-out Exchange with the name __*name*__. The
	 * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
	 * @param connectionSetting The ConnectionSetting
	 * @param name The string name of the exchange
	 * @param isDurable The boolean indicating whether or not I am durable
	 */
	public static fanOutInstance(
		connectionSetting: ConnectionSetting,
		name: string,
		isDurable: boolean
	): Promise<Exchange> {
		return new Promise(async (resolve, reject): Promise<void> => {
			let exchange = new this(connectionSetting, name, "fanout", isDurable);
			try {
				await exchange.build();
				await exchange.assert();
				resolve(exchange);
			} catch (e) {
				debugError(Constant.EXCHANGE_BUILD_THROWS_ERROR + e);
				reject(Constant.EXCHANGE_BUILD_THROWS_ERROR + e);
			}
		});
	}

	/**
	 * Answers a promise of a headers Exchange with the name __*name*__. The
	 * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
	 * @param connectionSetting The ConnectionSetting
	 * @param name The string name of the exchange
	 * @param isDurable the boolean indicating whether or not I am durable
	 */
	public static headerInstance(
		connectionSetting: ConnectionSetting,
		name: string,
		isDurable: boolean
	): Promise<Exchange> {
		return new Promise(async (resolve, reject): Promise<void> => {
			let exchange = new this(connectionSetting, name, "headers", isDurable);
			try {
				await exchange.build();
				await exchange.assert();
				resolve(exchange);
			} catch (e) {
				debugError(Constant.EXCHANGE_BUILD_THROWS_ERROR + e);
				reject(Constant.EXCHANGE_BUILD_THROWS_ERROR + e);
			}
		});
	}

	/**
	 * Answers a promise of a topic Exchange with the name __*name*__. The
	 * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
	 * @param connectionSetting The ConnectionSetting
	 * @param name The string name of the exchange
	 * @param isDurable The boolean indicating whether or not I am durable
	 */
	public static topicInstance(
		connectionSetting: ConnectionSetting,
		name: string,
		isDurable: boolean
	): Promise<Exchange> {
		return new Promise(async (resolve, reject): Promise<void> => {
			let exchange = new this(connectionSetting, name, "topic", isDurable);
			try {
				await exchange.build();
				await exchange.assert();
				resolve(exchange);
			} catch (e) {
				debugError(Constant.EXCHANGE_BUILD_THROWS_ERROR + e);
				reject(Constant.EXCHANGE_BUILD_THROWS_ERROR + e);
			}
		});
	}

	/**
	 * Publish a message using a routing key.
	 * @param key The string routing key for this message
	 * @param message The string message
	 * @returns A boolean which if it is true it means that the messages was
	 * published, otherwise it means the buffer is full and it could not be sent,
	 * later it will emit a 'drain' event
	 */
	public publish(key: string, message: string): boolean {
		return this.channel().publish(this.name(), key, Buffer.from(message));
	}

	/**
	 * Assert me by using my name, type and my durability.
	 * @throws An exception if something goes wrong
	 * @returns Promise<void>
	 */
	public assert(): Promise<void> {
		return new Promise(async (resolve, reject): Promise<void> => {
			try {
				await this.channel().assertExchange(this.name(), this.type(), {
					durable: this.isDurable()
				});
				resolve();
			} catch (e) {
				debugError(Constant.FAILED_ASSERT_EXCHANGE + e);
				reject(Constant.FAILED_ASSERT_EXCHANGE + e);
			}
		});
	}

	/**
	 * Constructs a default state.
	 */
	protected constructor(
		connectionSetting: ConnectionSetting,
		name: string,
		type: string,
		isDurable: boolean
	) {
		super(connectionSetting, name);
		this.setDurable(isDurable);
		this.setType(type);
	}

	/**
	 * Answers my type.
	 */
	protected type(): string {
		return this._type;
	}

	/**
	 * Sets exchange type.
	 * @param type The string to set as my type
	 */
	private setType(type: string): void {
		this._type = type;
	}
}
