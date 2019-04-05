"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constant_1 = require("./Constant");
const BrokerChannel_1 = require("./BrokerChannel");
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
class Exchange extends BrokerChannel_1.default {
    /**
     * Answers a promise of a direct Exchange with the name __*name*__. The
     * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
     * @param connectionSetting The ConnectionSetting
     * @param exchangeName The string name of the exchange
     * @param isDurable The boolean indicating whether or not I am durable
     */
    static directInstance(connectionSetting, exchangeName, isDurable) {
        return new Promise(async (resolve, reject) => {
            let exchange = new this(connectionSetting, exchangeName, "direct", isDurable);
            try {
                await exchange.build();
                await exchange.assert();
                resolve(exchange);
            }
            catch (e) {
                debugError(Constant_1.default.EXCHANGE_BUILD_THROWS_ERROR + e);
                reject(Constant_1.default.EXCHANGE_BUILD_THROWS_ERROR + e);
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
    static fanOutInstance(connectionSetting, name, isDurable) {
        return new Promise(async (resolve, reject) => {
            let exchange = new this(connectionSetting, name, "fanout", isDurable);
            try {
                await exchange.build();
                await exchange.assert();
                resolve(exchange);
            }
            catch (e) {
                debugError(Constant_1.default.EXCHANGE_BUILD_THROWS_ERROR + e);
                reject(Constant_1.default.EXCHANGE_BUILD_THROWS_ERROR + e);
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
    static headerInstance(connectionSetting, name, isDurable) {
        return new Promise(async (resolve, reject) => {
            let exchange = new this(connectionSetting, name, "headers", isDurable);
            try {
                await exchange.build();
                await exchange.assert();
                resolve(exchange);
            }
            catch (e) {
                debugError(Constant_1.default.EXCHANGE_BUILD_THROWS_ERROR + e);
                reject(Constant_1.default.EXCHANGE_BUILD_THROWS_ERROR + e);
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
    static topicInstance(connectionSetting, name, isDurable) {
        return new Promise(async (resolve, reject) => {
            let exchange = new this(connectionSetting, name, "topic", isDurable);
            try {
                await exchange.build();
                await exchange.assert();
                resolve(exchange);
            }
            catch (e) {
                debugError(Constant_1.default.EXCHANGE_BUILD_THROWS_ERROR + e);
                reject(Constant_1.default.EXCHANGE_BUILD_THROWS_ERROR + e);
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
    publish(key, message) {
        return this.channel().publish(this.name(), key, Buffer.from(message));
    }
    /**
     * Assert me by using my name, type and my durability.
     * @throws An exception if something goes wrong
     * @returns Promise<void>
     */
    assert() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.channel().assertExchange(this.name(), this.type(), {
                    durable: this.isDurable()
                });
                resolve();
            }
            catch (e) {
                debugError(Constant_1.default.FAILED_ASSERT_EXCHANGE + e);
                reject(Constant_1.default.FAILED_ASSERT_EXCHANGE + e);
            }
        });
    }
    /**
     * Constructs a default state.
     */
    constructor(connectionSetting, name, type, isDurable) {
        super(connectionSetting, name);
        this.setDurable(isDurable);
        this.setType(type);
    }
    /**
     * Answers my type.
     */
    type() {
        return this._type;
    }
    /**
     * Sets exchange type.
     * @param type The string to set as my type
     */
    setType(type) {
        this._type = type;
    }
}
exports.default = Exchange;
