import ConnectionFactory from "./../../../../../src/port/adapter/messaging/rabbitmq/ConnectionFactory";
import { Connection } from "amqplib";
import amqpLib = require("amqplib");

describe("Test connection factory", () => {
	test("should return a promise when new connection on happy path", async () => {
		let expectedConnection = jest.fn<Connection, []>();
		amqpLib.connect = jest.fn().mockResolvedValue(expectedConnection);

		let connectionFactory = new ConnectionFactory(
			"local",
			1234,
			"/",
			"user",
			"pass"
		);

		let conn = await connectionFactory.newConnection();
		expect(conn).toBe(expectedConnection);
	});

	test("should return a promise when new connection on sad path", async () => {
		let expectedResult = jest.fn<Error, []>();
		amqpLib.connect = jest.fn().mockRejectedValue(expectedResult);

		let connectionFactory = new ConnectionFactory(
			"local",
			1234,
			"/",
			"user",
			"pass"
		);

		try {
			await connectionFactory.newConnection();
		} catch (e) {
			expect(e).toBe(expectedResult);
		}
	});

	test('should check default values', () => {
		let connectionFactory = new ConnectionFactory();
		expect(connectionFactory.host()).toEqual('localhost');
		expect(connectionFactory.port()).toEqual(5672);
		expect(connectionFactory.virtualHost()).toEqual('/');
		expect(connectionFactory.username()).toEqual('guest');
		expect(connectionFactory.password()).toEqual('guest');
	});
});
