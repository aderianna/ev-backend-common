"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * I am a message listener, which is given each message received
 * by a MessageConsumer. I am also an adapter because I provide
 * defaults for both handleMessage() behaviors. A typical subclass
 * would override the handleMessage() based on its
 * type.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
class MessageListener {
    /**
     * The current message that is received by this listener
     * @param message This message is set by the queue automatically
     */
    setCurrentMessage(message) {
        this._message = message;
    }
    /**
     * This message is set by the queue and is used whenever there is a need to
     * nack or ack the message to the channel when some exception has happened.
     * @return The message structure received by the queue
     */
    message() {
        return this._message;
    }
}
exports.default = MessageListener;
