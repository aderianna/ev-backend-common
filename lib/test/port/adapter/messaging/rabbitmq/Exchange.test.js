"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqpLib = require("amqplib");
const events_1 = require("events");
const BluebirdPromise = require("bluebird");
const Exchange_1 = require("../../../../../src/port/adapter/messaging/rabbitmq/Exchange");
const ConnectionSetting_1 = require("../../../../../src/port/adapter/messaging/rabbitmq/ConnectionSetting");
let queueName = "queueNameForTest";
let exchangeName = "exchangeNameForTest";
let mockedConnection, mockedChannel, mockedAssertQueue, mockedAssertExchange;
beforeEach(function () {
    mockedAssertQueue = new (jest.fn(() => ({
        queue: queueName,
        messageCount: 0,
        consumerCount: 0
    })))();
    mockedAssertExchange = new (jest.fn(() => ({
        exchange: exchangeName
    })))();
    class ChannelTest extends events_1.EventEmitter {
        constructor() {
            super(...arguments);
            this.close = jest.fn(() => new BluebirdPromise(r => r()));
            this.assertQueue = () => new BluebirdPromise(r => r(mockedAssertQueue));
            this.assertExchange = () => new BluebirdPromise(r => r(mockedAssertExchange));
            this.bindQueue = () => new BluebirdPromise(r => r());
            this.bindExchange = () => new BluebirdPromise(r => r());
            this.publish = () => true;
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
describe("Test directInstance()", () => {
    test("should create an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let ex = await Exchange_1.default.directInstance(connSetting, exchangeName, true);
        expect(ex.host()).toEqual("localhost");
        expect(ex.constructor.name).toEqual("Exchange");
        expect(ex.name()).toEqual(exchangeName);
    });
    test("should create an instance and publish a message", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let ex = await Exchange_1.default.directInstance(connSetting, exchangeName, true);
        expect(ex.publish('key', 'my message')).toBeTruthy();
    });
    test("should reject the promise when creating an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedConnection.createChannel = jest.fn(() => Promise.reject("error msg"));
        await expect(Exchange_1.default.directInstance(connSetting, exchangeName, true)).rejects.toBeTruthy();
    });
    test("should failed the asserting of creating an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedChannel.assertExchange = jest.fn(() => Promise.reject("error msg"));
        await expect(Exchange_1.default.directInstance(connSetting, exchangeName, true)).rejects.toBeTruthy();
    });
});
describe("Test fanOutInstance()", () => {
    test("should create an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let ex = await Exchange_1.default.fanOutInstance(connSetting, exchangeName, true);
        expect(ex.host()).toEqual("localhost");
        expect(ex.constructor.name).toEqual("Exchange");
        expect(ex.name()).toEqual(exchangeName);
    });
    test("should reject the promise when creating an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedConnection.createChannel = jest.fn(() => Promise.reject("error msg"));
        await expect(Exchange_1.default.fanOutInstance(connSetting, exchangeName, true)).rejects.toBeTruthy();
    });
});
describe("Test headerInstance()", () => {
    test("should create an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let ex = await Exchange_1.default.headerInstance(connSetting, exchangeName, true);
        expect(ex.host()).toEqual("localhost");
        expect(ex.constructor.name).toEqual("Exchange");
        expect(ex.name()).toEqual(exchangeName);
    });
    test("should reject the promise when creating an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedConnection.createChannel = jest.fn(() => Promise.reject("error msg"));
        await expect(Exchange_1.default.headerInstance(connSetting, exchangeName, true)).rejects.toBeTruthy();
    });
});
describe("Test topicInstance()", () => {
    test("should create an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        let ex = await Exchange_1.default.topicInstance(connSetting, exchangeName, true);
        expect(ex.host()).toEqual("localhost");
        expect(ex.constructor.name).toEqual("Exchange");
        expect(ex.name()).toEqual(exchangeName);
    });
    test("should reject the promise when creating an instance", async () => {
        expect.hasAssertions();
        amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
        let connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
        mockedConnection.createChannel = jest.fn(() => Promise.reject("error msg"));
        await expect(Exchange_1.default.topicInstance(connSetting, exchangeName, true)).rejects.toBeTruthy();
    });
});
