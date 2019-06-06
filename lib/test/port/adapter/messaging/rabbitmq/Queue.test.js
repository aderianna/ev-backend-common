"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const amqpLib = require("amqplib");
const BluebirdPromise = require("bluebird");
const Queue_1 = require("./../../../../../src/port/adapter/messaging/rabbitmq/Queue");
const ConnectionSetting_1 = require("../../../../../src/port/adapter/messaging/rabbitmq/ConnectionSetting");
let queueName = "queueNameForTest";
let exchangeName = "exchangeNameForTest";
let mockedConnection, mockedChannel, mockedAssertQueue, mockedExchange;
beforeEach(function () {
    class ExchangeTest extends events_1.EventEmitter {
        constructor() {
            super(...arguments);
            this.host = () => "localhost";
            this.connection = () => mockedConnection;
            this.channel = () => mockedChannel;
            this.name = () => exchangeName;
        }
    }
    mockedExchange = new ExchangeTest();
    mockedAssertQueue = new (jest.fn(() => ({
        queue: queueName,
        messageCount: 0,
        consumerCount: 0
    })))();
    class ChannelTest extends events_1.EventEmitter {
        constructor() {
            super(...arguments);
            this.close = jest.fn(() => new BluebirdPromise(r => r()));
            this.assertQueue = () => new BluebirdPromise(r => r(mockedAssertQueue));
            this.bindQueue = () => new BluebirdPromise(r => r());
            this.bindExchange = () => new BluebirdPromise(r => r());
            this.publish = () => new BluebirdPromise(r => r());
            this.prefetch = jest.fn();
        }
    }
    mockedChannel = new ChannelTest();
    class ConnectionTest extends events_1.EventEmitter {
        constructor() {
            super(...arguments);
            this.close = jest.fn(() => new BluebirdPromise(r => r()));
            this.createChannel = () => new BluebirdPromise(r => r(mockedChannel));
        }
    }
    mockedConnection = new ConnectionTest();
});
describe("Test customInstanceUsingConnectionSetting()", () => {
    test("should create a queue", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        expect(q.host()).toEqual("localhost");
        expect(q.constructor.name).toEqual("Queue");
        expect(q.name()).toEqual(queueName);
    });
    test("should execute connection.once('error', fn) whenever an error on the connection occurred", async (done) => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let mockedFn = jest.fn();
        q.once("closed", () => {
            mockedFn();
            done();
        });
        mockedConnection.emit("error");
        expect(mockedFn).toBeCalledTimes(1);
    });
    test("should execute connection.once('close', fn) whenever a 'close' event happened on the connection", async (done) => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let mockedFn = jest.fn();
        q.once("closed", () => {
            mockedFn();
            done();
        });
        mockedConnection.emit("close");
        expect(mockedFn).toBeCalledTimes(1);
    });
    test("should execute channel.once('error', fn) whenever an error on the channel occurred", async (done) => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
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
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedConnection.createChannel = jest.fn(() => Promise.reject());
        await expect(Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false)).rejects.toBeTruthy();
    });
    test("should close a queue", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        q.close();
        expect(mockedChannel.close).toBeCalled();
        expect(mockedConnection.close).toBeCalled();
    });
    test("should throw error when no name param is provided", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        await expect(Queue_1.default.customInstanceUsingConnectionSetting(connSetting, "", true, false, false)).rejects.toBeTruthy();
    });
    test("should throw error when faulty queue assertion", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedChannel.assertQueue = null;
        await expect(Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false)).rejects.toBeTruthy();
    });
    test("should throw error when faulty queue assertion using default parameters", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedChannel.assertQueue = null;
        await expect(Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName)).rejects.toBeTruthy();
    });
});
describe("Test customInstanceUsingExchange()", () => {
    test("should throw error when faulty queue assertion using default parameters", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.customInstanceUsingExchange(mockedExchange, "")).rejects.toBeTruthy();
    });
    test("should create queue using default parameters", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.customInstanceUsingExchange(mockedExchange, queueName)).resolves.toBeTruthy();
    });
    test("should create queue using routingKeys", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        await expect(Queue_1.default.customInstanceUsingExchange(mockedExchange, queueName, ["topic1"])).resolves.toBeTruthy();
    });
    test("should throw an error on bindQueue() while adding routingKeys", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = () => new BluebirdPromise((r, e) => e());
        await expect(Queue_1.default.customInstanceUsingExchange(mockedExchange, queueName, ["topic1"])).rejects.toBeTruthy();
    });
    test("should throw an error on bindQueue()", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.customInstanceUsingExchange(mockedExchange, queueName, ["topic1"])).rejects.toBeTruthy();
    });
    test("should throw an error on assertQueue()", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedExchange.host = null;
        await expect(Queue_1.default.customInstanceUsingExchange(mockedExchange, queueName, ["topic1"])).rejects.toBeTruthy();
    });
});
describe("Test durableInstance()", () => {
    test("should create a queue", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        await expect(Queue_1.default.durableInstance(connSetting, queueName)).resolves.toBeTruthy();
    });
    test("should throw an error when no name param provided", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        await expect(Queue_1.default.durableInstance(connSetting, "")).rejects.toBeTruthy();
    });
    test("should throw an error on queue assertion", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedChannel.assertQueue = null;
        await expect(Queue_1.default.durableInstance(connSetting, queueName)).rejects.toBeTruthy();
    });
    test("should throw an error on creating a new channel or connection error", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedConnection.createChannel = null;
        await expect(Queue_1.default.durableInstance(connSetting, queueName)).rejects.toBeTruthy();
    });
});
describe("Test durableExclusiveInstance()", () => {
    test("should create a queue", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        await expect(Queue_1.default.durableExclusiveInstance(connSetting, queueName)).resolves.toBeTruthy();
    });
    test("should throw an error when no name param provided", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        await expect(Queue_1.default.durableExclusiveInstance(connSetting, "")).rejects.toBeTruthy();
    });
    test("should throw an error on queue assertion", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedChannel.assertQueue = null;
        await expect(Queue_1.default.durableExclusiveInstance(connSetting, queueName)).rejects.toBeTruthy();
    });
    test("should throw an error on creating a new channel or connection error", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedConnection.createChannel = null;
        await expect(Queue_1.default.durableExclusiveInstance(connSetting, queueName)).rejects.toBeTruthy();
    });
});
describe("Test durableNonExclusiveNotAutoDeletedInstance()", () => {
    test("should create a queue", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        await expect(Queue_1.default.durableNonExclusiveNotAutoDeletedInstance(connSetting, queueName)).resolves.toBeTruthy();
    });
    test("should throw an error when no name param provided", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        await expect(Queue_1.default.durableNonExclusiveNotAutoDeletedInstance(connSetting, "")).rejects.toBeTruthy();
    });
    test("should throw an error on queue assertion", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedChannel.assertQueue = null;
        await expect(Queue_1.default.durableNonExclusiveNotAutoDeletedInstance(connSetting, queueName)).rejects.toBeTruthy();
    });
    test("should throw an error on creating a new channel or connection error", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedConnection.createChannel = null;
        await expect(Queue_1.default.durableNonExclusiveNotAutoDeletedInstance(connSetting, queueName)).rejects.toBeTruthy();
    });
});
describe("Test individualExchangeSubscriberInstance()", () => {
    test("should throw error when faulty queue assertion using default parameters", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.individualExchangeSubscriberInstance(mockedExchange, "")).rejects.toBeTruthy();
    });
    test("should create queue using default parameters", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.individualExchangeSubscriberInstance(mockedExchange, queueName)).resolves.toBeTruthy();
    });
    test("should create queue using routingKeys", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        await expect(Queue_1.default.individualExchangeSubscriberInstance(mockedExchange, queueName, [
            "topic1"
        ])).resolves.toBeTruthy();
    });
    test("should exchange emits 'closed' event when setting up the queue", async (done) => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let q = await Queue_1.default.individualExchangeSubscriberInstance(mockedExchange, queueName, ["topic1"]);
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
        await expect(Queue_1.default.individualExchangeSubscriberInstance(mockedExchange, queueName, [
            "topic1"
        ])).rejects.toBeTruthy();
    });
    test("should throw an error on bindQueue()", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.individualExchangeSubscriberInstance(mockedExchange, queueName, [
            "topic1"
        ])).rejects.toBeTruthy();
    });
    test("should throw an error on assertQueue()", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedExchange.host = null;
        await expect(Queue_1.default.individualExchangeSubscriberInstance(mockedExchange, queueName, [
            "topic1"
        ])).rejects.toBeTruthy();
    });
});
describe("Test exchangeTemporarySubscriberInstance()", () => {
    test("should throw error when faulty queue assertion", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.exchangeTemporarySubscriberInstance(mockedExchange)).rejects.toBeTruthy();
    });
    test("should create queue", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        await expect(Queue_1.default.exchangeTemporarySubscriberInstance(mockedExchange)).resolves.toBeTruthy();
    });
    test("should throw an error when bind queue fails", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = () => new BluebirdPromise((_, e) => e());
        await expect(Queue_1.default.exchangeTemporarySubscriberInstance(mockedExchange)).rejects.toBeTruthy();
    });
    test("should throw an error when fails to assert a queue", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedExchange = new (jest.fn(() => ({
            host: null,
            connection: () => mockedConnection,
            channel: () => mockedChannel,
            name: () => exchangeName
        })))();
        await expect(Queue_1.default.exchangeTemporarySubscriberInstance(mockedExchange)).rejects.toBeTruthy();
    });
});
describe("Test exchangeNamedSubscriberInstance()", () => {
    test("should throw error when faulty queue assertion using default parameters", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.exchangeNamedSubscriberInstance(mockedExchange, "")).rejects.toBeTruthy();
    });
    test("should create queue using default parameters", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        await expect(Queue_1.default.exchangeNamedSubscriberInstance(mockedExchange, queueName)).resolves.toBeTruthy();
    });
    test("should throw an error on bindQueue()", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = () => new BluebirdPromise((_, e) => e());
        await expect(Queue_1.default.exchangeNamedSubscriberInstance(mockedExchange, queueName)).rejects.toBeTruthy();
    });
    test("should throw an error on assertQueue()", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedExchange = new (jest.fn(() => ({
            host: null,
            connection: () => mockedConnection,
            channel: () => mockedChannel,
            name: () => exchangeName
        })))();
        await expect(Queue_1.default.exchangeNamedSubscriberInstance(mockedExchange, queueName)).rejects.toBeTruthy();
    });
});
describe("Test exchangeTemporaryDirectOrTopicSubscriberInstance()", () => {
    test("should create queue using routingKeys", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        await expect(Queue_1.default.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, [
            "topic1"
        ])).resolves.toBeTruthy();
    });
    test("should throw an error on bindQueue() while adding routingKeys", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = () => new BluebirdPromise((r, e) => e());
        await expect(Queue_1.default.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, [
            "topic1"
        ])).rejects.toBeTruthy();
    });
    test("should throw an error on bindQueue()", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedChannel.bindQueue = null;
        await expect(Queue_1.default.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, [
            "topic1"
        ])).rejects.toBeTruthy();
    });
    test("should throw an error on assertQueue()", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        mockedExchange.host = null;
        await expect(Queue_1.default.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, [
            "topic1"
        ])).rejects.toBeTruthy();
    });
    test("should prefetch 4 messages from the channel", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let q = await Queue_1.default.exchangeTemporaryDirectOrTopicSubscriberInstance(mockedExchange, ["topic1"]);
        q.basicQos(4);
        expect(mockedChannel.prefetch).toBeCalledTimes(1);
    });
});
