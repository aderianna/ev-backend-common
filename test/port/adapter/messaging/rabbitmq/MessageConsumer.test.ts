import MessageException from "./../../../../../src/port/adapter/messaging/rabbitmq/MessageException";
import Queue from "./../../../../../src/port/adapter/messaging/rabbitmq/Queue";
import ConnectionSetting from "../../../../../src/port/adapter/messaging/rabbitmq/ConnectionSetting";
import MessageConsumer from "../../../../../src/port/adapter/messaging/rabbitmq/MessageConsumer";
import MessageListener from "../../../../../src/port/adapter/messaging/rabbitmq/MessageListener";
import { Connection, Channel } from "amqplib";
import amqpLib = require("amqplib");
import * as BluebirdPromise from "bluebird";
import { Replies, ConsumeMessage, Options, Message } from "amqplib/properties";

let queueName = "queueNameForTest";
let mockedConnection: Connection,
	mockedChannel: Channel,
	mockedAssertQueue: Replies.AssertQueue;

let messageListener: MessageListener,
	messageListenerWithAck: MessageListener,
	messageListenerNoAck: MessageListener;
let emptyMessage: ConsumeMessage = ({} as unknown) as ConsumeMessage;
let callback: (msg: Message) => void;
let connSetting: ConnectionSetting;

beforeEach(() => {
	mockedAssertQueue = (new (jest.fn<Replies.AssertQueue, []>(() => ({
		queue: queueName,
		messageCount: 0,
		consumerCount: 0
	})))() as unknown) as Replies.AssertQueue;
	mockedChannel = (new (jest.fn(() => ({
		close: jest.fn(() => new BluebirdPromise(r => r())),
		assertQueue: () => new BluebirdPromise(r => r(mockedAssertQueue)),
		bindQueue: () => new BluebirdPromise(r => r()),
		bindExchange: () => new BluebirdPromise(r => r()),
		publish: () => new BluebirdPromise(r => r()),
		nack: jest.fn(),
		/**
		 * Simulate rabbitmq channel.consume(), that will take the parameters
		 * and callback function. This callback will be called later in the test
		 * to simulate that a messages is ready to be consumed.
		 */
		consume: (
			_1,
			aCallback: (message: ConsumeMessage) => void,
			_2?: Options.Consume
		) => {
			return new Promise((r, _) => {
				callback = aCallback;
				r();
			});
		},
		ack: jest.fn(),
		prefetch: jest.fn(),
		once: () => this
	})))() as unknown) as Channel;

	mockedConnection = (new (jest.fn(() => ({
		close: jest.fn(() => new BluebirdPromise(r => r())),
		createChannel: () => new BluebirdPromise(r => r(mockedChannel)),
		once: () => this
	})))() as unknown) as Connection;

	connSetting = ConnectionSetting.instance(
		"localhost",
		1234,
		"virt",
		"user",
		"pass"
	);
	amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
	messageListenerNoAck = (new (jest.fn())() as unknown) as MessageListener;
	messageListenerNoAck.message = () => emptyMessage;
	messageListenerNoAck.setCurrentMessage = jest.fn();
	messageListenerNoAck.handleMessage = jest.fn();

	messageListenerWithAck = new (jest.fn<
		MessageListener,
		[]
	>())() as MessageListener;
	messageListenerWithAck.message = () => emptyMessage;
	messageListenerWithAck.setCurrentMessage = jest.fn();
});

describe("Test autoAcknowledgedInstance()", () => {
	test("should create an instance", async () => {
		expect.hasAssertions();
		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		let messageConsumer: MessageConsumer = MessageConsumer.autoAcknowledgedInstance(
			q
		);
		messageListener = messageListenerNoAck;
		messageConsumer.receiveFor(messageListener);

		callback(emptyMessage);
		expect(messageListener.handleMessage).toBeCalled();
	});

	test("should create an instance and call equalizeMessageDistribution()", async () => {
		expect.hasAssertions();
		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);
		
		let messageConsumer: MessageConsumer = MessageConsumer.autoAcknowledgedInstance(
			q
		);

		q.basicQos = jest.fn();
		messageConsumer.equalizeMessageDistribution();
		expect(q.basicQos).toBeCalled();
	});

	test("should Queue.basicQos() throws an error when calling equalizeMessageDistribution()", async () => {
		expect.hasAssertions();
		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);
		
		let messageConsumer: MessageConsumer = MessageConsumer.autoAcknowledgedInstance(
			q
		);

		q.basicQos = jest.fn(() => {throw "error";});
		expect(() => messageConsumer.equalizeMessageDistribution()).toThrow();
	});
});

describe("Test manualAcknowledgedInstance()", () => {
	test("should create instance", async () => {
		expect.hasAssertions();
		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		let messageConsumer: MessageConsumer = MessageConsumer.manualAcknowledgedInstance(
			q
		);
		messageListener = messageListenerWithAck;
		messageListener.handleMessage = jest.fn((_, ackCallback) => {
			/**
			 * Call the callback in the scope of the created queue, otherwise
			 * you will run the callback into an anonymous scope which will give
			 * an error of reading a property of undefined.
			 */
			ackCallback.call(q, emptyMessage);
		});
		messageConsumer.receiveFor(messageListener);

		callback(emptyMessage);
		expect(messageListener.handleMessage).toBeCalledTimes(1);
	});

	test("should message listener throws MessageException error", async () => {
		expect.hasAssertions();
		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		let messageConsumer: MessageConsumer = MessageConsumer.manualAcknowledgedInstance(
			q
		);
		messageListener = messageListenerWithAck;
		messageListener.handleMessage = jest.fn(() => {
			throw MessageException.instanceWithoutRetry("some error");
		});
		messageConsumer.receiveFor(messageListener);

		callback(emptyMessage);
		expect(messageListener.handleMessage).toBeCalledTimes(1);
		expect(mockedChannel.nack).toBeCalledTimes(1);
	});

	test("should message listener throws an error", async () => {
		expect.hasAssertions();
		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		let messageConsumer: MessageConsumer = MessageConsumer.manualAcknowledgedInstance(
			q
		);
		messageListener = messageListenerWithAck;
		messageListener.handleMessage = jest.fn(() => {
			throw "some error";
		});
		messageConsumer.receiveFor(messageListener);

		callback(emptyMessage);
		expect(messageListener.handleMessage).toBeCalledTimes(1);
		expect(mockedChannel.nack).toBeCalledTimes(1);
	});

	test("should throw error on channel.consume()", async () => {
		expect.hasAssertions();
		let mockedFn = jest.fn();
		mockedChannel.consume = (
			_1: string,
			_2: (msg: ConsumeMessage) => void,
			_3: Options.Consume
		) => {
			return new BluebirdPromise<Replies.Consume>((_, reject) => {
				reject();
				mockedFn();
			});
		};

		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		let messageConsumer: MessageConsumer = MessageConsumer.manualAcknowledgedInstance(
			q
		);
		messageListener = messageListenerWithAck;
		messageListener.handleMessage = jest.fn(() => {
			throw MessageException.instanceWithoutRetry("some error");
		});

		try {
			/** The following call will innerly call  channel.consume() in Queue.consume() method*/
			await messageConsumer.receiveFor(messageListener);
		} catch (e) {}
		expect(mockedFn).toBeCalledTimes(1);
	});

	test("should check isClosed()", async () => {
		expect.hasAssertions();
		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		let messageConsumer: MessageConsumer = MessageConsumer.manualAcknowledgedInstance(
			q
		);
		messageListener = messageListenerWithAck;
		messageListener.handleMessage = jest.fn((_, ackCallback) => {
			/**
			 * Call the callback in the scope of the created queue, otherwise
			 * you will run the callback into an anonymous scope which will give
			 * an error of reading a property of undefined.
			 */
			ackCallback.call(q, emptyMessage);
		});
		messageConsumer.receiveFor(messageListener);

		callback(emptyMessage);
		expect(messageConsumer.isClosed()).toBeFalsy();
	});

	test("should check isClosed()", async () => {
		expect.hasAssertions();
		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		let messageConsumer: MessageConsumer = MessageConsumer.manualAcknowledgedInstance(
			q
		);
		messageListener = messageListenerWithAck;
		messageListener.handleMessage = jest.fn((_, ackCallback) => {
			/**
			 * Call the callback in the scope of the created queue, otherwise
			 * you will run the callback into an anonymous scope which will give
			 * an error of reading a property of undefined.
			 */
			ackCallback.call(q, emptyMessage);
		});
		messageConsumer.receiveFor(messageListener);

		callback(emptyMessage);
		messageConsumer.close();
		expect(messageConsumer.isClosed()).toBeTruthy();
	});
});
