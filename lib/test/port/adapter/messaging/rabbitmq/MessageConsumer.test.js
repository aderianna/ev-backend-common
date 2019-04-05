"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageException_1 = require("./../../../../../src/port/adapter/messaging/rabbitmq/MessageException");
const Queue_1 = require("./../../../../../src/port/adapter/messaging/rabbitmq/Queue");
const ConnectionSetting_1 = require("../../../../../src/port/adapter/messaging/rabbitmq/ConnectionSetting");
const MessageConsumer_1 = require("../../../../../src/port/adapter/messaging/rabbitmq/MessageConsumer");
const amqpLib = require("amqplib");
const BluebirdPromise = require("bluebird");
let queueName = "queueNameForTest";
let mockedConnection, mockedChannel, mockedAssertQueue;
let messageListener, messageListenerWithAck, messageListenerNoAck;
let emptyMessage = {};
let callback;
let connSetting;
beforeEach(() => {
    mockedAssertQueue = new (jest.fn(() => ({
        queue: queueName,
        messageCount: 0,
        consumerCount: 0
    })))();
    mockedChannel = new (jest.fn(() => ({
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
        consume: (_1, aCallback, _2) => {
            return new Promise((r, _) => {
                callback = aCallback;
                r();
            });
        },
        ack: jest.fn(),
        prefetch: jest.fn(),
        once: () => this
    })))();
    mockedConnection = new (jest.fn(() => ({
        close: jest.fn(() => new BluebirdPromise(r => r())),
        createChannel: () => new BluebirdPromise(r => r(mockedChannel)),
        once: () => this
    })))();
    connSetting = ConnectionSetting_1.default.instance("localhost", 1234, "virt", "user", "pass");
    amqpLib.connect = jest.fn().mockResolvedValue(mockedConnection);
    messageListenerNoAck = new (jest.fn())();
    messageListenerNoAck.message = () => emptyMessage;
    messageListenerNoAck.setCurrentMessage = jest.fn();
    messageListenerNoAck.handleMessage = jest.fn();
    messageListenerWithAck = new (jest.fn())();
    messageListenerWithAck.message = () => emptyMessage;
    messageListenerWithAck.setCurrentMessage = jest.fn();
});
describe("Test autoAcknowledgedInstance()", () => {
    test("should create an instance", async () => {
        expect.hasAssertions();
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.autoAcknowledgedInstance(q);
        messageListener = messageListenerNoAck;
        messageConsumer.receiveFor(messageListener);
        callback(emptyMessage);
        expect(messageListener.handleMessage).toBeCalled();
    });
    test("should create an instance and call equalizeMessageDistribution()", async () => {
        expect.hasAssertions();
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.autoAcknowledgedInstance(q);
        q.basicQos = jest.fn();
        messageConsumer.equalizeMessageDistribution();
        expect(q.basicQos).toBeCalled();
    });
    test("should Queue.basicQos() throws an error when calling equalizeMessageDistribution()", async () => {
        expect.hasAssertions();
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.autoAcknowledgedInstance(q);
        q.basicQos = jest.fn(() => { throw "error"; });
        expect(() => messageConsumer.equalizeMessageDistribution()).toThrow();
    });
});
describe("Test manualAcknowledgedInstance()", () => {
    test("should create instance", async () => {
        expect.hasAssertions();
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.manualAcknowledgedInstance(q);
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
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.manualAcknowledgedInstance(q);
        messageListener = messageListenerWithAck;
        messageListener.handleMessage = jest.fn(() => {
            throw MessageException_1.default.instanceWithoutRetry("some error");
        });
        messageConsumer.receiveFor(messageListener);
        callback(emptyMessage);
        expect(messageListener.handleMessage).toBeCalledTimes(1);
        expect(mockedChannel.nack).toBeCalledTimes(1);
    });
    test("should message listener throws an error", async () => {
        expect.hasAssertions();
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.manualAcknowledgedInstance(q);
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
        mockedChannel.consume = (_1, _2, _3) => {
            return new BluebirdPromise((_, reject) => {
                reject();
                mockedFn();
            });
        };
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.manualAcknowledgedInstance(q);
        messageListener = messageListenerWithAck;
        messageListener.handleMessage = jest.fn(() => {
            throw MessageException_1.default.instanceWithoutRetry("some error");
        });
        try {
            /** The following call will innerly call  channel.consume() in Queue.consume() method*/
            await messageConsumer.receiveFor(messageListener);
        }
        catch (e) { }
        expect(mockedFn).toBeCalledTimes(1);
    });
    test("should check isClosed()", async () => {
        expect.hasAssertions();
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.manualAcknowledgedInstance(q);
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
        let q = await Queue_1.default.customInstanceUsingConnectionSetting(connSetting, queueName, true, false, false);
        let messageConsumer = MessageConsumer_1.default.manualAcknowledgedInstance(q);
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
