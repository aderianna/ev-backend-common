import Constant from "./Constant";
import MessageException from "./MessageException";
import Queue from "./Queue";
import MessageListener from "./MessageListener";
import { Message } from "amqplib";

/** I'm using it to display errors, if the specified environment variable 'DEBUG' is set
 * so the provided tag. Here I used 'error'. So if you want to see erros on your console,
 * then just set your environment variable to 'set DEBUG=error'
 */
const debugError = require("debug")("error");

/**
 * I am a message consumer, which facilitates receiving messages
 * from a Queue. A MessageListener or a client may close me,
 * terminating message consumption.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class MessageConsumer {
	/** My autoAcknowledged property. */
	private _autoAcknowledged: boolean;

	/** My closed property, which indicates I have been closed. */
	private _closed: boolean;

	/** My queue, which is where my messages come from. */
	private _queue: Queue;

	/** My tag, which is produced by the broker. */
	private _tag: string;

	/**
	 * Answers a new auto-acknowledged MessageConsumer, which means all
	 * messages received are automatically considered acknowledged as
	 * received from the broker.
	 * @param queue The Queue from which messages are received
	 */
	public static autoAcknowledgedInstance(queue: Queue): MessageConsumer {
		return MessageConsumer.instance(queue, true);
	}

	/**
	 * Answers a new MessageConsumer with manual acknowledgment.
	 * @param queue The Queue from which messages are received
	 */
	public static manualAcknowledgedInstance(queue: Queue): MessageConsumer {
		return MessageConsumer.instance(queue, false);
	}

	/**
	 * Answers a new MessageConsumer with acknowledgment managed per
	 * isAutoAcknowledged.
	 * @param queue The Queue from which messages are received
	 * @param isAutoAcknowledged The boolean indicating whether or not auto-acknowledgment is used
	 */
	public static instance(
		queue: Queue,
		isAutoAcknowledged: boolean
	): MessageConsumer {
		return new this(queue, isAutoAcknowledged);
	}

	/**
	 * Closes me, which closes my queue.
	 */
	public close(): void {
		this.setClosed(true);
		this.queue().close();
	}

	/**
	 * Answers whether or not I have been closed.
	 */
	public isClosed(): boolean {
		return this._closed;
	}

	/**
	 * Ensure an equalization of message distribution
	 * across all consumers of this queue.
	 */
	public equalizeMessageDistribution(): void {
		try {
			this.queue().basicQos(1);
		} catch (e) {
			throw new Error(Constant.MESSAGE_EQUALIZATION_FAILED + e);
		}
	}

	/**
	 * Constructs my default state.
	 * @param queue The Queue from which I receive messages
	 * @param isAutoAcknowledged The boolean indicating whether or not auto-acknowledgment is used
	 */
	protected constructor(queue: Queue, isAutoAcknowledged: boolean) {
		this.setQueue(queue);
		this.setAutoAcknowledged(isAutoAcknowledged);
	}

	/**
	 * Answers my autoAcknowledged.
	 */
	private isAutoAcknowledged(): boolean {
		return this._autoAcknowledged;
	}

	/**
	 * Sets my autoAcknowledged.
	 * @param isAutoAcknowledged the boolean to set as my autoAcknowledged
	 */
	private setAutoAcknowledged(isAutoAcknowledged: boolean): void {
		this._autoAcknowledged = isAutoAcknowledged;
	}

	/**
	 * Sets my closed.
	 * @param closed the boolean to set as my closed
	 */
	private setClosed(closed: boolean): void {
		this._closed = closed;
	}

	/**
	 * Answers my queue.
	 */
	protected queue(): Queue {
		return this._queue;
	}

	/**
	 * Registers __*messageListener*__ with the channel.
	 * @param messageListener The MessageListener
	 */
	public async receiveFor(messageListener: MessageListener): Promise<void> {
		let queue: Queue = this.queue();
		let ack = this.ack.bind(this);
		queue.on(Constant.MESSAGE_CONSUMER_ERROR_EVENT_NAME, (e): void => {
			if (!this.isAutoAcknowledged()) {
				if (e instanceof MessageException) {
					queue.nack(messageListener.message(), e.isRetry());
				} else {
					queue.nack(messageListener.message(), true);
				}
			}
		});

		try {
			await queue.consume(messageListener, ack, {
				noAck: this.isAutoAcknowledged()
			});
		} catch (e) {
			debugError(Constant.CONSUMER_ERROR + e);
			return Promise.reject();
		}

		return Promise.resolve();
	}

	/**
	 * Acknowledge the message with verification if the consumer is auto acknowledged,
	 * because this can close the channel if the consumer is set with noAck: true and
	 * the message is acknowledged manually. I will check this and assure if noAck is
	 * set to false then I will allow to acknowledge the message manually
	 * @param message The message that is used to for acknowledgment
	 */
	public ack(message: Message): void {
		if (!this.isAutoAcknowledged()) {
			this.queue().ack(message);
		}
	}

	/**
	 * Sets my queue.
	 * @param queue The Queue to set as my queue
	 */
	private setQueue(queue: Queue): void {
		this._queue = queue;
	}
}
