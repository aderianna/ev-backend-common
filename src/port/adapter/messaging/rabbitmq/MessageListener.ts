import { Message } from "amqplib";

/**
 * I am a message listener, which is given each message received
 * by a MessageConsumer. I am also an adapter because I provide
 * defaults for both handleMessage() behaviors. A typical subclass
 * would override the handleMessage() based on its
 * type.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default abstract class MessageListener {
	/** This message is set by the Queue, and this will let MessageConsumer to
	 * nack on error by using this message as a parameter for nack
	 */
	private _message: Message;
	/**
	 * The current message that is received by this listener
	 * @param message This message is set by the queue automatically
	 */
	public setCurrentMessage(message: Message): void {
		this._message = message;
	}

	/**
	 * This message is set by the queue and is used whenever there is a need to
	 * nack or ack the message to the channel when some exception has happened.
	 * @return The message structure received by the queue
	 */
	public message(): Message {
		return this._message;
	}

	/**
	 * Handles  message. If any message exception is thrown by
	 * my implementor its isRetry() is examined and, if true, the
	 * message being handled will be nack'd and re-queued. Otherwise,
	 * if its isRetry() is false the message will be rejected/failed
	 * (not re-queued). If any other exception is thrown the message
	 * will be considered not handled and is rejected/failed.
	 * @param message The message structure that needs to be handled
	 * @param ack The callback that can be used to acknowledge the message
	 * @throws Exception when any problem occurs and the message must not be acknowledged
	 */
	abstract handleMessage(
		message: Message,
		ack: (message: Message) => void
	): void;
}
