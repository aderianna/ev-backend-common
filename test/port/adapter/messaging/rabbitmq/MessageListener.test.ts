import MessageListener from "../../../../../src/port/adapter/messaging/rabbitmq/MessageListener";
import { Message } from "amqplib";

describe("Test message listener", () => {
	let messageListener: MessageListener;
	let message: Message;
	beforeEach(() => {
		class MessageListenerTest extends MessageListener {
			public handleMessage(message: Message, ack: (message: Message) => void): void {
				ack(message);
			}
		}

		messageListener = new MessageListenerTest();
		message = {
			content: Buffer.from("test message"),
			fields: null,
			properties: null
		};
	});

	test("should set the message", () => {
		messageListener.setCurrentMessage(message);
		expect(messageListener.message()).toEqual(message);
		expect(messageListener.message()).not.toEqual({});
	});

	test("should handleMessage() call the ack() callback", () => {
		let ackMock = jest.fn();
		messageListener.handleMessage(message, ackMock);
		expect(ackMock).toBeCalledWith(message);
	});
});
