"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constant_1 = require("./Constant");
const ConnectionFactory_1 = require("./ConnectionFactory");
const events = require("events");
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
class BrokerChannel extends events.EventEmitter {
    host() {
        return this._host;
    }
    name() {
        return this._name;
    }
    build() {
        return this._builder();
    }
    constructor(connectionSetting, name, brokerChannel = null) {
        super();
        if (brokerChannel != null) {
            this._builder = () => this.setByBrokerChannel(brokerChannel, name);
        }
        else {
            this._builder = () => this.setUsingConnectionFactory(connectionSetting, name);
        }
    }
    setUsingConnectionFactory(connectionSetting, name) {
        let factory = this.configureConnectionFactoryUsingConnectionSetting(connectionSetting);
        this.setName(name);
        this.setHost(connectionSetting.hostName());
        return this.createConnectionAndSetListenerOnConnectionOrChannelClosed(factory);
    }
    /**
     * Create a new connection and set a listener on connection and channel when it is closed, in order to set 'null' whenever
     * this happened
     * @param factory The connection factory used to create new connection
     */
    createConnectionAndSetListenerOnConnectionOrChannelClosed(factory) {
        return new Promise((resolve, reject) => {
            factory
                .newConnection()
                .then((conn) => {
                this.setConnection(conn);
                conn.once(Constant_1.default.ERROR_EVENT_NAME, (e) => {
                    debugError(e);
                    this.setConnection(null);
                    this.emit(Constant_1.default.CLOSED_EVENT_NAME);
                });
                this.connection()
                    .createChannel()
                    .then((ch) => {
                    this.setChannel(ch);
                    resolve();
                    ch.once(Constant_1.default.ERROR_EVENT_NAME, (e) => {
                        debugError(e);
                        this.setChannel(null);
                        this.emit(Constant_1.default.CLOSED_EVENT_NAME);
                    });
                })
                    .catch((e) => {
                    debugError(e);
                    this.setChannel(null);
                    reject();
                });
            })
                .catch((e) => {
                reject(e);
                this.setConnection(null);
            });
        });
    }
    setByBrokerChannel(brokerChannel, name) {
        return new Promise((r) => {
            brokerChannel.on(Constant_1.default.CLOSED_EVENT_NAME, () => {
                this.emit(Constant_1.default.CLOSED_EVENT_NAME);
            });
            this.setHost(brokerChannel.host());
            this.setName(name);
            this.setConnection(brokerChannel.connection());
            this.setChannel(brokerChannel.channel());
            r();
        });
    }
    channel() {
        return this._channel;
    }
    /**
     * Closes the connection and the channel.
     */
    close() {
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
        }
        catch (_) { }
        try {
            if (this.connection() != null) {
                this.connection().close();
            }
        }
        catch (_) { }
        this.setChannel(null);
        this.setConnection(null);
    }
    /**
     * Return ConnectionFactory configured with a connectionSetting.
     */
    configureConnectionFactoryUsingConnectionSetting(connectionSetting) {
        return new ConnectionFactory_1.default(connectionSetting.hostName(), connectionSetting.port(), connectionSetting.virtualHost(), connectionSetting.username(), connectionSetting.password());
    }
    /**
     * Is it durable?.
     */
    isDurable() {
        return this._durable;
    }
    /**
     * Sets durable.
     */
    setDurable(durable) {
        this._durable = durable;
    }
    /**
     * Sets a name.
     */
    setName(name) {
        this._name = name;
    }
    /**
     * Sets a channel.
     */
    setChannel(channel) {
        this._channel = channel;
    }
    /**
     * Returns a connection.
     */
    connection() {
        return this._connection;
    }
    /**
     * Sets a connection.
     */
    setConnection(connection) {
        this._connection = connection;
    }
    /**
     * Sets a host.
     */
    setHost(host) {
        this._host = host;
    }
}
exports.default = BrokerChannel;
