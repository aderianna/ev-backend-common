"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionFactory_1 = require("./../../../../../src/port/adapter/messaging/rabbitmq/ConnectionFactory");
const amqpLib = require("amqplib");
describe("Test connection factory", () => {
    test("should return a promise when new connection on happy path", async () => {
        let expectedConnection = jest.fn();
        amqpLib.connect = jest.fn().mockResolvedValue(expectedConnection);
        let connectionFactory = new ConnectionFactory_1.default("local", 1234, "/", "user", "pass");
        let conn = await connectionFactory.newConnection();
        expect(conn).toBe(expectedConnection);
    });
    test("should return a promise when new connection on sad path", async () => {
        let expectedResult = jest.fn();
        amqpLib.connect = jest.fn().mockRejectedValue(expectedResult);
        let connectionFactory = new ConnectionFactory_1.default("local", 1234, "/", "user", "pass");
        try {
            await connectionFactory.newConnection();
        }
        catch (e) {
            expect(e).toBe(expectedResult);
        }
    });
    test('should check default values', () => {
        let connectionFactory = new ConnectionFactory_1.default();
        expect(connectionFactory.host()).toEqual('localhost');
        expect(connectionFactory.port()).toEqual(5672);
        expect(connectionFactory.virtualHost()).toEqual('/');
        expect(connectionFactory.username()).toEqual('guest');
        expect(connectionFactory.password()).toEqual('guest');
    });
});
