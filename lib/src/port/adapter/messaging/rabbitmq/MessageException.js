"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * I'm a message exception that you can throw me passing
 * a retry property, that will allow the message to be requeued
 * if it is set to true.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
class MessageException {
    /**
     * Constructs my default state.
     * @param message the String message
     * @param isRetry the boolean indicating whether or not to retry sending
     */
    constructor(message, isRetry) {
        this.setRetry(isRetry);
        this.setMessage(message);
    }
    /**
     * Constructs my default state that has a retry.
     * @param message The string message
     */
    static instanceWithRetry(message) {
        return new this(message, true);
    }
    /**
     * Constructs my default state that does not need a retry.
     * @param message The string message
     */
    static instanceWithoutRetry(message) {
        return new this(message, false);
    }
    /**
     * Answers whether or not retry is set. Retry can be
     * used by a MessageListener when it wants the message
     * it has attempted to handle to be re-queued rather than
     * rejected, so that it can re-attempt handling later.
     */
    isRetry() {
        return this._retry;
    }
    /**
     * Sets my retry.
     * @param retry the boolean to set as my retry
     */
    setRetry(retry) {
        this._retry = retry;
    }
    /**
     * Sets a message
     * @param message This is the string message
     */
    setMessage(message) {
        this._message = message;
    }
    /**
     * Answers the message string
     */
    message() {
        return this._message;
    }
}
exports.default = MessageException;
