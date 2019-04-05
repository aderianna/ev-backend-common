"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constant_1 = require("./Constant");
const MessageException_1 = require("./MessageException");
/**
 * I am a message consumer, which facilitates receiving messages
 * from a Queue. A MessageListener or a client may close me,
 * terminating message consumption.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
class MessageConsumer {
    /**
     * Answers a new auto-acknowledged MessageConsumer, which means all
     * messages received are automatically considered acknowledged as
     * received from the broker.
     * @param queue The Queue from which messages are received
     */
    static autoAcknowledgedInstance(queue) {
        return MessageConsumer.instance(queue, true);
    }
    /**
     * Answers a new MessageConsumer with manual acknowledgment.
     * @param queue The Queue from which messages are received
     */
    static manualAcknowledgedInstance(queue) {
        return MessageConsumer.instance(queue, false);
    }
    /**
     * Answers a new MessageConsumer with acknowledgment managed per
     * isAutoAcknowledged.
     * @param queue The Queue from which messages are received
     * @param isAutoAcknowledged The boolean indicating whether or not auto-acknowledgment is used
     */
    static instance(queue, isAutoAcknowledged) {
        return new this(queue, isAutoAcknowledged);
    }
    /**
     * Closes me, which closes my queue.
     */
    close() {
        this.setClosed(true);
        this.queue().close();
    }
    /**
     * Answers whether or not I have been closed.
     */
    isClosed() {
        return this._closed;
    }
    /**
     * Ensure an equalization of message distribution
     * across all consumers of this queue.
     */
    equalizeMessageDistribution() {
        try {
            this.queue().basicQos(1);
        }
        catch (e) {
            throw new Error(Constant_1.default.MESSAGE_EQUALIZATION_FAILED + e);
        }
    }
    /**
     * Constructs my default state.
     * @param queue The Queue from which I receive messages
     * @param isAutoAcknowledged The boolean indicating whether or not auto-acknowledgment is used
     */
    constructor(queue, isAutoAcknowledged) {
        this.setQueue(queue);
        this.setAutoAcknowledged(isAutoAcknowledged);
    }
    /**
     * Answers my autoAcknowledged.
     */
    isAutoAcknowledged() {
        return this._autoAcknowledged;
    }
    /**
     * Sets my autoAcknowledged.
     * @param isAutoAcknowledged the boolean to set as my autoAcknowledged
     */
    setAutoAcknowledged(isAutoAcknowledged) {
        this._autoAcknowledged = isAutoAcknowledged;
    }
    /**
     * Sets my closed.
     * @param closed the boolean to set as my closed
     */
    setClosed(closed) {
        this._closed = closed;
    }
    /**
     * Answers my queue.
     */
    queue() {
        return this._queue;
    }
    /**
     * Registers __*messageListener*__ with the channel.
     * @param messageListener The MessageListener
     */
    async receiveFor(messageListener) {
        let queue = this.queue();
        let ack = this.ack.bind(this);
        queue.on(Constant_1.default.MESSAGE_CONSUMER_ERROR_EVENT_NAME, e => {
            if (!this.isAutoAcknowledged()) {
                if (e instanceof MessageException_1.default) {
                    this.queue().nack(messageListener.message(), e.isRetry());
                }
                else {
                    this.queue().nack(messageListener.message(), true);
                }
            }
        });
        try {
            await queue.consume(messageListener, ack, {
                noAck: this.isAutoAcknowledged()
            });
        }
        catch (e) { }
    }
    /**
     * Acknowledge the message with verification if the consumer is auto acknowledged,
     * because this can close the channel if the consumer is set with noAck: true and
     * the message is acknowledged manually. I will check this and assure if noAck is
     * set to false then I will allow to acknowledge the message manually
     * @param message The message that is used to for acknowledgment
     */
    ack(message) {
        if (!this.isAutoAcknowledged()) {
            this.queue().ack(message);
        }
    }
    /**
     * Sets my queue.
     * @param queue The Queue to set as my queue
     */
    setQueue(queue) {
        this._queue = queue;
    }
}
exports.default = MessageConsumer;
