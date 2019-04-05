"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageListener_1 = require("../../../../../src/port/adapter/messaging/rabbitmq/MessageListener");
describe("Test message listener", () => {
    let messageListener;
    let message;
    beforeEach(() => {
        class MessageListenerTest extends MessageListener_1.default {
            handleMessage(message, ack) {
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
