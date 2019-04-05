import { Channel } from "amqplib";
import ConnectionSetting from "./ConnectionSetting";
import ConnectionFactory from "./ConnectionFactory";
import events = require("events");
/**
 * An abstract base class for all channels to
 * the RabbitMQ message broker.
 *
 */
export default abstract class BrokerChannel extends events.EventEmitter {
    /** Rabbitmq channel. */
    private _channel;
    /** It is the connection to my host broker. */
    private _connection;
    /** It indicates whether or not messages are durable. */
    private _durable;
    /** It is the host of the broker. There may be a :port appended. */
    private _host;
    /** This builder is used after constructing the instance */
    private _builder;
    /** Broker name. */
    private _name;
    host(): string;
    name(): string;
    build(): Promise<void>;
    /**
     * Constructs a default state.
     */
    protected constructor(connectionSetting: ConnectionSetting, name: string);
    protected constructor(connectionSetting: ConnectionSetting, name: string, brokerChannel: BrokerChannel);
    private setUsingConnectionFactory;
    /**
     * Create a new connection and set a listener on connection and channel when it is closed, in order to set 'null' whenever
     * this happened
     * @param factory The connection factory used to create new connection
     */
    private createConnectionAndSetListenerOnConnectionOrChannelClosed;
    private setByBrokerChannel;
    protected channel(): Channel;
    /**
     * Closes the connection and the channel.
     */
    protected close(): void;
    /**
     * Return ConnectionFactory configured with a connectionSetting.
     */
    protected configureConnectionFactoryUsingConnectionSetting(connectionSetting: ConnectionSetting): ConnectionFactory;
    /**
     * Is it durable?.
     */
    protected isDurable(): boolean;
    /**
     * Sets durable.
     */
    protected setDurable(durable: boolean): void;
    /**
     * Sets a name.
     */
    protected setName(name: string): void;
    /**
     * Sets a channel.
     */
    private setChannel;
    /**
     * Returns a connection.
     */
    private connection;
    /**
     * Sets a connection.
     */
    private setConnection;
    /**
     * Sets a host.
     */
    private setHost;
}
