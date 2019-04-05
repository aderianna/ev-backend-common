import ConnectionSetting from "./ConnectionSetting";
import BrokerChannel from "./BrokerChannel";
/**
 * I am an exchange that simplifies RabbitMQ exchanges.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class Exchange extends BrokerChannel {
    /** A type, which is the type of exchange. */
    private _type;
    /**
     * Answers a promise of a direct Exchange with the name __*name*__. The
     * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
     * @param connectionSetting The ConnectionSetting
     * @param exchangeName The string name of the exchange
     * @param isDurable The boolean indicating whether or not I am durable
     */
    static directInstance(connectionSetting: ConnectionSetting, exchangeName: string, isDurable: boolean): Promise<Exchange>;
    /**
     * Answers a promise of a fan-out Exchange with the name __*name*__. The
     * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
     * @param connectionSetting The ConnectionSetting
     * @param name The string name of the exchange
     * @param isDurable The boolean indicating whether or not I am durable
     */
    static fanOutInstance(connectionSetting: ConnectionSetting, name: string, isDurable: boolean): Promise<Exchange>;
    /**
     * Answers a promise of a headers Exchange with the name __*name*__. The
     * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
     * @param connectionSetting The ConnectionSetting
     * @param name The string name of the exchange
     * @param isDurable the boolean indicating whether or not I am durable
     */
    static headerInstance(connectionSetting: ConnectionSetting, name: string, isDurable: boolean): Promise<Exchange>;
    /**
     * Answers a promise of a topic Exchange with the name __*name*__. The
     * underlying exchange has the __*isDurable*__ quality, and is not auto-deleted.
     * @param connectionSetting The ConnectionSetting
     * @param name The string name of the exchange
     * @param isDurable The boolean indicating whether or not I am durable
     */
    static topicInstance(connectionSetting: ConnectionSetting, name: string, isDurable: boolean): Promise<Exchange>;
    /**
     * Publish a message using a routing key.
     * @param key The string routing key for this message
     * @param message The string message
     * @returns A boolean which if it is true it means that the messages was
     * published, otherwise it means the buffer is full and it could not be sent,
     * later it will emit a 'drain' event
     */
    publish(key: string, message: string): boolean;
    /**
     * Assert me by using my name, type and my durability.
     * @throws An exception if something goes wrong
     * @returns Promise<void>
     */
    assert(): Promise<void>;
    /**
     * Constructs a default state.
     */
    protected constructor(connectionSetting: ConnectionSetting, name: string, type: string, isDurable: boolean);
    /**
     * Answers my type.
     */
    protected type(): string;
    /**
     * Sets exchange type.
     * @param type The string to set as my type
     */
    private setType;
}
