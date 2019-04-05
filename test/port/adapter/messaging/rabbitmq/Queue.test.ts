import { Replies } from "amqplib/properties";
import { Connection, Channel } from "amqplib";
import { EventEmitter } from "events";
import amqpLib = require("amqplib");
import * as BluebirdPromise from "bluebird";
import Queue from "./../../../../../src/port/adapter/messaging/rabbitmq/Queue";
import ConnectionSetting from "../../../../../src/port/adapter/messaging/rabbitmq/ConnectionSetting";
import Exchange from "../../../../../src/port/adapter/messaging/rabbitmq/Exchange";

let queueName = "queueNameForTest";
let exchangeName = "exchangeNameForTest";
let mockedConnection: Connection,
	mockedChannel: Channel,
	mockedAssertQueue: Replies.AssertQueue,
	mockedExchange: Exchange;
beforeEach(function() {
	class ExchangeTest extends EventEmitter {
		public host = () => "localhost";
		public connection = () => mockedConnection;
		public channel = () => mockedChannel;
		public name = () => exchangeName;
	}

	mockedExchange = (new ExchangeTest() as unknown) as Exchange;
	mockedAssertQueue = (new (jest.fn<Replies.AssertQueue, []>(() => ({
		queue: queueName,
		messageCount: 0,
		consumerCount: 0
	})))() as unknown) as Replies.AssertQueue;

	class ChannelTest extends EventEmitter {
		public close = jest.fn(() => new BluebirdPromise(r => r()));
		public assertQueue = () => new BluebirdPromise(r => r(mockedAssertQueue));
		public bindQueue = () => new BluebirdPromise(r => r());
		public bindExchange = () => new BluebirdPromise(r => r());
		public publish = () => new BluebirdPromise(r => r());
		public prefetch = jest.fn();
	}

	mockedChannel = (new ChannelTest() as unknown) as Channel;

	class ConnectionTest extends EventEmitter {
		public close = jest.fn(() => new BluebirdPromise(r => r()));
		public createChannel = () => new BluebirdPromise(r => r(mockedChannel));
	}

	mockedConnection = (new ConnectionTest() as unknown) as Connection;
});

describe("Test customInstanceUsingConnectionSetting()", () => {
	test("should create a queue", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		expect(q.host()).toEqual("localhost");
		expect(q.constructor.name).toEqual("Queue");
		expect(q.name()).toEqual(queueName);
	});

	test("should execute connection.once('error', fn) whenever an error on the connection occurred", async done => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);
		let mockedFn = jest.fn();

		q.once("closed", () => {
			mockedFn();
			done();
		});

		mockedConnection.emit("error");
		expect(mockedFn).toBeCalledTimes(1);
	});

	test("should execute channel.once('error', fn) whenever an error on the channel occurred", async done => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);
		let mockedFn = jest.fn();

		q.once("closed", () => {
			mockedFn();
			done();
		});

		mockedChannel.emit("error");
		expect(mockedFn).toBeCalledTimes(1);
	});

	test("should reject the promise when creating the channel", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedConnection.createChannel = (jest.fn(() =>
			Promise.reject()
		) as unknown) as () => BluebirdPromise<Channel>;

		await expect(
			Queue.customInstanceUsingConnectionSetting(
				connSetting,
				queueName,
				true,
				false,
				false
			)
		).rejects.toBeTruthy();
	});

	test("should close a queue", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let q = await Queue.customInstanceUsingConnectionSetting(
			connSetting,
			queueName,
			true,
			false,
			false
		);

		q.close();
		expect(mockedChannel.close).toBeCalled();
		expect(mockedConnection.close).toBeCalled();
	});

	test("should throw error when no name param is provided", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		await expect(
			Queue.customInstanceUsingConnectionSetting(
				connSetting,
				"",
				true,
				false,
				false
			)
		).rejects.toBeTruthy();
	});

	test("should throw error when faulty queue assertion", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedChannel.assertQueue = null;

		await expect(
			Queue.customInstanceUsingConnectionSetting(
				connSetting,
				queueName,
				true,
				false,
				false
			)
		).rejects.toBeTruthy();
	});

	test("should throw error when faulty queue assertion using default parameters", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedChannel.assertQueue = null;

		await expect(
			Queue.customInstanceUsingConnectionSetting(connSetting, queueName)
		).rejects.toBeTruthy();
	});
});

describe("Test customInstanceUsingExchange()", () => {
	test("should throw error when faulty queue assertion using default parameters", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.customInstanceUsingExchange(mockedExchange, "")
		).rejects.toBeTruthy();
	});

	test("should create queue using default parameters", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.customInstanceUsingExchange(mockedExchange, queueName)
		).resolves.toBeTruthy();
	});

	test("should create queue using routingKeys", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		await expect(
			Queue.customInstanceUsingExchange(mockedExchange, queueName, ["topic1"])
		).resolves.toBeTruthy();
	});

	test("should throw an error on bindQueue() while adding routingKeys", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = () => new BluebirdPromise((r, e) => e());

		await expect(
			Queue.customInstanceUsingExchange(mockedExchange, queueName, ["topic1"])
		).rejects.toBeTruthy();
	});

	test("should throw an error on bindQueue()", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.customInstanceUsingExchange(mockedExchange, queueName, ["topic1"])
		).rejects.toBeTruthy();
	});

	test("should throw an error on assertQueue()", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedExchange.host = null;

		await expect(
			Queue.customInstanceUsingExchange(mockedExchange, queueName, ["topic1"])
		).rejects.toBeTruthy();
	});
});

describe("Test durableInstance()", () => {
	test("should create a queue", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		await expect(
			Queue.durableInstance(connSetting, queueName)
		).resolves.toBeTruthy();
	});

	test("should throw an error when no name param provided", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		await expect(Queue.durableInstance(connSetting, "")).rejects.toBeTruthy();
	});

	test("should throw an error on queue assertion", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedChannel.assertQueue = null;

		await expect(
			Queue.durableInstance(connSetting, queueName)
		).rejects.toBeTruthy();
	});

	test("should throw an error on creating a new channel or connection error", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedConnection.createChannel = null;

		await expect(
			Queue.durableInstance(connSetting, queueName)
		).rejects.toBeTruthy();
	});
});

describe("Test durableExclusiveInstance()", () => {
	test("should create a queue", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		await expect(
			Queue.durableExclusiveInstance(connSetting, queueName)
		).resolves.toBeTruthy();
	});
	test("should throw an error when no name param provided", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		await expect(
			Queue.durableExclusiveInstance(connSetting, "")
		).rejects.toBeTruthy();
	});
	test("should throw an error on queue assertion", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedChannel.assertQueue = null;

		await expect(
			Queue.durableExclusiveInstance(connSetting, queueName)
		).rejects.toBeTruthy();
	});

	test("should throw an error on creating a new channel or connection error", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedConnection.createChannel = null;

		await expect(
			Queue.durableExclusiveInstance(connSetting, queueName)
		).rejects.toBeTruthy();
	});
});

describe("Test durableNonExclusiveNotAutoDeletedInstance()", () => {
	test("should create a queue", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		await expect(
			Queue.durableNonExclusiveNotAutoDeletedInstance(connSetting, queueName)
		).resolves.toBeTruthy();
	});
	test("should throw an error when no name param provided", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		await expect(
			Queue.durableNonExclusiveNotAutoDeletedInstance(connSetting, "")
		).rejects.toBeTruthy();
	});
	test("should throw an error on queue assertion", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedChannel.assertQueue = null;

		await expect(
			Queue.durableNonExclusiveNotAutoDeletedInstance(connSetting, queueName)
		).rejects.toBeTruthy();
	});

	test("should throw an error on creating a new channel or connection error", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedConnection.createChannel = null;

		await expect(
			Queue.durableNonExclusiveNotAutoDeletedInstance(connSetting, queueName)
		).rejects.toBeTruthy();
	});
});

describe("Test individualExchangeSubscriberInstance()", () => {
	test("should throw error when faulty queue assertion using default parameters", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.individualExchangeSubscriberInstance(mockedExchange, "")
		).rejects.toBeTruthy();
	});

	test("should create queue using default parameters", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.individualExchangeSubscriberInstance(mockedExchange, queueName)
		).resolves.toBeTruthy();
	});

	test("should create queue using routingKeys", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		await expect(
			Queue.individualExchangeSubscriberInstance(mockedExchange, queueName, [
				"topic1"
			])
		).resolves.toBeTruthy();
	});

	test("should exchange emits 'closed' event when setting up the queue", async done => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		let q = await Queue.individualExchangeSubscriberInstance(
			mockedExchange,
			queueName,
			["topic1"]
		);
		
		let mockedFn = jest.fn();
		q.on('closed', () => {
			mockedFn();
			done();
		});
		mockedExchange.emit('closed');
		expect(mockedFn).toBeCalledTimes(1);
	});

	test("should throw an error on bindQueue() while adding routingKeys", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = () => new BluebirdPromise((r, e) => e());

		await expect(
			Queue.individualExchangeSubscriberInstance(mockedExchange, queueName, [
				"topic1"
			])
		).rejects.toBeTruthy();
	});

	test("should throw an error on bindQueue()", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.individualExchangeSubscriberInstance(mockedExchange, queueName, [
				"topic1"
			])
		).rejects.toBeTruthy();
	});

	test("should throw an error on assertQueue()", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedExchange.host = null;

		await expect(
			Queue.individualExchangeSubscriberInstance(mockedExchange, queueName, [
				"topic1"
			])
		).rejects.toBeTruthy();
	});
});

describe("Test exchangeTemporarySubscriberInstance()", () => {
	test("should throw error when faulty queue assertion", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.exchangeTemporarySubscriberInstance(mockedExchange)
		).rejects.toBeTruthy();
	});

	test("should create queue", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		await expect(
			Queue.exchangeTemporarySubscriberInstance(mockedExchange)
		).resolves.toBeTruthy();
	});

	test("should throw an error when bind queue fails", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		mockedChannel.bindQueue = () => new BluebirdPromise((_, e) => e());
		await expect(
			Queue.exchangeTemporarySubscriberInstance(mockedExchange)
		).rejects.toBeTruthy();
	});

	test("should throw an error when fails to assert a queue", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		mockedExchange = (new (jest.fn(() => ({
			host: null,
			connection: () => mockedConnection,
			channel: () => mockedChannel,
			name: () => exchangeName
		})))() as unknown) as Exchange;
		await expect(
			Queue.exchangeTemporarySubscriberInstance(mockedExchange)
		).rejects.toBeTruthy();
	});
});

describe("Test exchangeNamedSubscriberInstance()", () => {
	test("should throw error when faulty queue assertion using default parameters", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.exchangeNamedSubscriberInstance(mockedExchange, "")
		).rejects.toBeTruthy();
	});

	test("should create queue using default parameters", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		await expect(
			Queue.exchangeNamedSubscriberInstance(mockedExchange, queueName)
		).resolves.toBeTruthy();
	});

	test("should throw an error on bindQueue()", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = () => new BluebirdPromise((_, e) => e());

		await expect(
			Queue.exchangeNamedSubscriberInstance(mockedExchange, queueName)
		).rejects.toBeTruthy();
	});

	test("should throw an error on assertQueue()", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedExchange = (new (jest.fn(() => ({
			host: null,
			connection: () => mockedConnection,
			channel: () => mockedChannel,
			name: () => exchangeName
		})))() as unknown) as Exchange;

		await expect(
			Queue.exchangeNamedSubscriberInstance(mockedExchange, queueName)
		).rejects.toBeTruthy();
	});
});

describe("Test exchangeTemporaryDirectOrTopicSubscriberInstance()", () => {
	test("should create queue using routingKeys", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		await expect(
			Queue.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, [
				"topic1"
			])
		).resolves.toBeTruthy();
	});

	test("should throw an error on bindQueue() while adding routingKeys", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = () => new BluebirdPromise((r, e) => e());

		await expect(
			Queue.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, [
				"topic1"
			])
		).rejects.toBeTruthy();
	});

	test("should throw an error on bindQueue()", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedChannel.bindQueue = null;

		await expect(
			Queue.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, [
				"topic1"
			])
		).rejects.toBeTruthy();
	});

	test("should throw an error on assertQueue()", async () => {
		expect.hasAssertions();
		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);

		mockedExchange.host = null;

		await expect(
			Queue.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, [
				"topic1"
			])
		).rejects.toBeTruthy();
	});

	test("should prefetch 4 messages from the channel", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let q = await Queue.exchangeTemporaryDirectOrTopicSubscriberInstance(
			mockedExchange,
			["topic1"]
		);

		q.basicQos(4);
		expect(mockedChannel.prefetch).toBeCalledTimes(1);
	});
});
