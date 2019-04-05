"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageException_1 = require("./../../../../../src/port/adapter/messaging/rabbitmq/MessageException");
describe('Test MessageException', () => {
    test('should set isRetry and check if it is set', () => {
        let msg = "a test message";
        let messageException = MessageException_1.default.instanceWithRetry(msg);
        try {
            throw messageException;
        }
        catch (e) {
            expect(e.isRetry()).toBeTruthy();
        }
    });
    test('should create an instance without isRetry()', () => {
        let msg = "a test message";
        let messageException = MessageException_1.default.instanceWithoutRetry(msg);
        try {
            throw messageException;
        }
        catch (e) {
            expect(e.isRetry()).toBeFalsy();
        }
    });
    test('should create an instance and retreive the message', () => {
        let msg = "a test message";
        let messageException = MessageException_1.default.instanceWithoutRetry(msg);
        expect(messageException.message()).toEqual(msg);
    });
});
