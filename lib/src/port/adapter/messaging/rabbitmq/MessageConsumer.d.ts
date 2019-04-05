import Queue from "./Queue";
import MessageListener from "./MessageListener";
import { Message } from "amqplib";
/**
 * I am a message consumer, which facilitates receiving messages
 * from a Queue. A MessageListener or a client may close me,
 * terminating message consumption.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class MessageConsumer {
    /** My autoAcknowledged property. */
    private _autoAcknowledged;
    /** My closed property, which indicates I have been closed. */
    private _closed;
    /** My queue, which is where my messages come from. */
    private _queue;
    /** My tag, which is produced by the broker. */
    private _tag;
    /**
     * Answers a new auto-acknowledged MessageConsumer, which means all
     * messages received are automatically considered acknowledged as
     * received from the broker.
     * @param queue The Queue from which messages are received
     */
    static autoAcknowledgedInstance(queue: Queue): MessageConsumer;
    /**
     * Answers a new MessageConsumer with manual acknowledgment.
     * @param queue The Queue from which messages are received
     */
    static manualAcknowledgedInstance(queue: Queue): MessageConsumer;
    /**
     * Answers a new MessageConsumer with acknowledgment managed per
     * isAutoAcknowledged.
     * @param queue The Queue from which messages are received
     * @param isAutoAcknowledged The boolean indicating whether or not auto-acknowledgment is used
     */
    static instance(queue: Queue, isAutoAcknowledged: boolean): MessageConsumer;
    /**
     * Closes me, which closes my queue.
     */
    close(): void;
    /**
     * Answers whether or not I have been closed.
     */
    isClosed(): boolean;
    /**
     * Ensure an equalization of message distribution
     * across all consumers of this queue.
     */
    equalizeMessageDistribution(): void;
    /**
     * Constructs my default state.
     * @param queue The Queue from which I receive messages
     * @param isAutoAcknowledged The boolean indicating whether or not auto-acknowledgment is used
     */
    protected constructor(queue: Queue, isAutoAcknowledged: boolean);
    /**
     * Answers my autoAcknowledged.
     */
    private isAutoAcknowledged;
    /**
     * Sets my autoAcknowledged.
     * @param isAutoAcknowledged the boolean to set as my autoAcknowledged
     */
    private setAutoAcknowledged;
    /**
     * Sets my closed.
     * @param closed the boolean to set as my closed
     */
    private setClosed;
    /**
     * Answers my queue.
     */
    protected queue(): Queue;
    /**
     * Registers __*messageListener*__ with the channel.
     * @param messageListener The MessageListener
     */
    receiveFor(messageListener: MessageListener): Promise<void>;
    /**
     * Acknowledge the message with verification if the consumer is auto acknowledged,
     * because this can close the channel if the consumer is set with noAck: true and
     * the message is acknowledged manually. I will check this and assure if noAck is
     * set to false then I will allow to acknowledge the message manually
     * @param message The message that is used to for acknowledgment
     */
    ack(message: Message): void;
    /**
     * Sets my queue.
     * @param queue The Queue to set as my queue
     */
    private setQueue;
}
