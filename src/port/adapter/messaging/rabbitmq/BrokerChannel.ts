import Constant from "./Constant";
import { Channel, Connection } from "amqplib";
import ConnectionSetting from "./ConnectionSetting";
import ConnectionFactory from "./ConnectionFactory";
import events = require("events");

/** I'm using it to display errors, if the specified environment variable 'DEBUG' is set
 * so the provided tag. Here I used 'error'. So if you want to see erros on your console,
 * then just set your environment variable to 'set DEBUG=error'
 */
const debugError = require("debug")("error");

/**
 * An abstract base class for all channels to
 * the RabbitMQ message broker.
 *
 */
export default abstract class BrokerChannel extends events.EventEmitter {
	/** Rabbitmq channel. */
	private _channel: Channel;

	/** It is the connection to my host broker. */
	private _connection: Connection;

	/** It indicates whether or not messages are durable. */
	private _durable: boolean;

	/** It is the host of the broker. There may be a :port appended. */
	private _host: string;

	/** This builder is used after constructing the instance */
	private _builder: () => Promise<void>;

	/** Broker name. */
	private _name: string;

	public host(): string {
		return this._host;
	}

	public name(): string {
		return this._name;
	}

	public build(): Promise<void> {
		return this._builder();
	}

	/**
	 * Constructs a default state.
	 */
	protected constructor(connectionSetting: ConnectionSetting, name: string);
	protected constructor(
		connectionSetting: ConnectionSetting,
		name: string,
		brokerChannel: BrokerChannel
	);
	protected constructor(
		connectionSetting: ConnectionSetting,
		name: string,
		brokerChannel: BrokerChannel = null
	) {
		super();
		if (brokerChannel != null) {
			this._builder = (): Promise<void> =>
				this.setByBrokerChannel(brokerChannel, name);
		} else {
			this._builder = (): Promise<void> =>
				this.setUsingConnectionFactory(connectionSetting, name);
		}
	}

	private setUsingConnectionFactory(
		connectionSetting: ConnectionSetting,
		name: string
	): Promise<void> {
		let factory: ConnectionFactory = this.configureConnectionFactoryUsingConnectionSetting(
			connectionSetting
		);
		this.setName(name);
		this.setHost(connectionSetting.hostName());
		return this.createConnectionAndSetListenerOnConnectionOrChannelClosed(
			factory
		);
	}

	/**
	 * Create a new connection and set a listener on connection and channel when it is closed, in order to set 'null' whenever
	 * this happened
	 * @param factory The connection factory used to create new connection
	 */
	private createConnectionAndSetListenerOnConnectionOrChannelClosed(
		factory: ConnectionFactory
	): Promise<void> {
		return new Promise(
			(resolve, reject): void => {
				factory
					.newConnection()
					.then(
						(conn): void => {
							this.setConnection(conn);
							conn.once(
								Constant.ERROR_EVENT_NAME,
								(e): void => {
									debugError(e);
									this.setConnection(null);
									this.emit(Constant.CLOSED_EVENT_NAME);
								}
							);
							this.connection()
								.createChannel()
								.then(
									(ch): void => {
										this.setChannel(ch);
										resolve();
										ch.once(
											Constant.ERROR_EVENT_NAME,
											(e): void => {
												debugError(e);
												this.setChannel(null);
												this.emit(Constant.CLOSED_EVENT_NAME);
											}
										);
									}
								)
								.catch(
									(e): void => {
										debugError(e);
										this.setChannel(null);
										reject();
									}
								);
						}
					)
					.catch(
						(e): void => {
							reject(e);
							this.setConnection(null);
						}
					);
			}
		);
	}

	private setByBrokerChannel(
		brokerChannel: BrokerChannel,
		name: string
	): Promise<void> {
		return new Promise(
			(r): void => {
				brokerChannel.on(
					Constant.CLOSED_EVENT_NAME,
					(): void => {
						this.emit(Constant.CLOSED_EVENT_NAME);
					}
				);
				this.setHost(brokerChannel.host());
				this.setName(name);
				this.setConnection(brokerChannel.connection());
				this.setChannel(brokerChannel.channel());
				r();
			}
		);
	}

	protected channel(): Channel {
		return this._channel;
	}

	/**
	 * Closes the connection and the channel.
	 */
	protected close(): void {
		/**
		 * RabbitMQ doesn't guarantee that if isOpen()
		 * answers true that close() will work because
		 * another client may be racing to close the
		 * same process and/or components. so here just
		 * attempt to close, catch and ignore, and move
		 * on to next steps is the recommended approach.
		 * for the purpose here, the isOpen() checks prevent
		 * closing a shared channel and connection that is
		 * shared by a subscriber exchange and queue.
		 */
		try {
			if (this.channel() != null) {
				this.channel().close();
			}
		} catch (_) {}

		try {
			if (this.connection() != null) {
				this.connection().close();
			}
		} catch (_) {}

		this.setChannel(null);
		this.setConnection(null);
	}

	/**
	 * Return ConnectionFactory configured with a connectionSetting.
	 */
	protected configureConnectionFactoryUsingConnectionSetting(
		connectionSetting: ConnectionSetting
	): ConnectionFactory {
		return new ConnectionFactory(
			connectionSetting.hostName(),
			connectionSetting.port(),
			connectionSetting.virtualHost(),
			connectionSetting.username(),
			connectionSetting.password()
		);
	}

	/**
	 * Is it durable?.
	 */
	protected isDurable(): boolean {
		return this._durable;
	}

	/**
	 * Sets durable.
	 */
	protected setDurable(durable: boolean): void {
		this._durable = durable;
	}

	/**
	 * Sets a name.
	 */
	protected setName(name: string): void {
		this._name = name;
	}

	/**
	 * Sets a channel.
	 */
	private setChannel(channel: Channel): void {
		this._channel = channel;
	}

	/**
	 * Returns a connection.
	 */
	private connection(): Connection {
		return this._connection;
	}

	/**
	 * Sets a connection.
	 */
	private setConnection(connection: Connection): void {
		this._connection = connection;
	}

	/**
	 * Sets a host.
	 */
	private setHost(host: string): void {
		this._host = host;
	}
}
