import { Connection, Channel, Replies } from "amqplib";
import amqpLib = require("amqplib");
import { EventEmitter } from "events";
import * as BluebirdPromise from "bluebird";
import Exchange from "../../../../../src/port/adapter/messaging/rabbitmq/Exchange";
import ConnectionSetting from "../../../../../src/port/adapter/messaging/rabbitmq/ConnectionSetting";

let queueName = "queueNameForTest";
let exchangeName = "exchangeNameForTest";
let mockedConnection: Connection,
	mockedChannel: Channel,
	mockedAssertQueue: Replies.AssertQueue,
	mockedAssertExchange: Replies.AssertExchange;
beforeEach(function() {
	mockedAssertQueue = (new (jest.fn<Replies.AssertQueue, []>(() => ({
		queue: queueName,
		messageCount: 0,
		consumerCount: 0
	})))() as unknown) as Replies.AssertQueue;
	mockedAssertExchange = (new (jest.fn<Replies.AssertExchange, []>(() => ({
		exchange: exchangeName
	})))() as unknown) as Replies.AssertExchange;

	class ChannelTest extends EventEmitter {
		public close = jest.fn(() => new BluebirdPromise(r => r()));
		public assertQueue = () => new BluebirdPromise(r => r(mockedAssertQueue));
		public assertExchange = () =>
			new BluebirdPromise(r => r(mockedAssertExchange));
		public bindQueue = () => new BluebirdPromise(r => r());
		public bindExchange = () => new BluebirdPromise(r => r());
		public publish = () => true;
		public prefetch = jest.fn();
	}

	mockedChannel = (new ChannelTest() as unknown) as Channel;

	class ConnectionTest extends EventEmitter {
		public close = jest.fn(() => new BluebirdPromise(r => r()));
		public createChannel = () => new BluebirdPromise(r => r(mockedChannel));
	}

	mockedConnection = (new ConnectionTest() as unknown) as Connection;
});

describe("Test directInstance()", () => {
	test("should create an instance", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let ex = await Exchange.directInstance(connSetting, exchangeName, true);

		expect(ex.host()).toEqual("localhost");
		expect(ex.constructor.name).toEqual("Exchange");
		expect(ex.name()).toEqual(exchangeName);
	});

	test("should create an instance and publish a message", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let ex = await Exchange.directInstance(connSetting, exchangeName, true);

		expect(ex.publish('key', 'my message')).toBeTruthy();
	});

	test("should reject the promise when creating an instance", async () => {
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
			Promise.reject("error msg")
		) as unknown) as () => BluebirdPromise<Channel>;

		await expect(
			Exchange.directInstance(connSetting, exchangeName, true)
		).rejects.toBeTruthy();
	});

	test("should failed the asserting of creating an instance", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		mockedChannel.assertExchange = (jest.fn(() =>
			Promise.reject("error msg")
		) as unknown) as () => BluebirdPromise<Replies.AssertExchange>;

		await expect(
			Exchange.directInstance(connSetting, exchangeName, true)
		).rejects.toBeTruthy();
	});
});

describe("Test fanOutInstance()", () => {
	test("should create an instance", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let ex = await Exchange.fanOutInstance(connSetting, exchangeName, true);

		expect(ex.host()).toEqual("localhost");
		expect(ex.constructor.name).toEqual("Exchange");
		expect(ex.name()).toEqual(exchangeName);
	});

	test("should reject the promise when creating an instance", async () => {
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
			Promise.reject("error msg")
		) as unknown) as () => BluebirdPromise<Channel>;

		await expect(
			Exchange.fanOutInstance(connSetting, exchangeName, true)
		).rejects.toBeTruthy();
	});
});

describe("Test headerInstance()", () => {
	test("should create an instance", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let ex = await Exchange.headerInstance(connSetting, exchangeName, true);

		expect(ex.host()).toEqual("localhost");
		expect(ex.constructor.name).toEqual("Exchange");
		expect(ex.name()).toEqual(exchangeName);
	});

	test("should reject the promise when creating an instance", async () => {
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
			Promise.reject("error msg")
		) as unknown) as () => BluebirdPromise<Channel>;

		await expect(
			Exchange.headerInstance(connSetting, exchangeName, true)
		).rejects.toBeTruthy();
	});
});

describe("Test topicInstance()", () => {
	test("should create an instance", async () => {
		expect.hasAssertions();

		amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
		let connSetting = ConnectionSetting.instance(
			"localhost",
			1234,
			"virt",
			"user",
			"pass"
		);

		let ex = await Exchange.topicInstance(connSetting, exchangeName, true);

		expect(ex.host()).toEqual("localhost");
		expect(ex.constructor.name).toEqual("Exchange");
		expect(ex.name()).toEqual(exchangeName);
	});

	test("should reject the promise when creating an instance", async () => {
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
			Promise.reject("error msg")
		) as unknown) as () => BluebirdPromise<Channel>;

		await expect(
			Exchange.topicInstance(connSetting, exchangeName, true)
		).rejects.toBeTruthy();
	});
});