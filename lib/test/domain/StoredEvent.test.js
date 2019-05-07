"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoredEvent_1 = require("./../../src/domain/event/StoredEvent");
const microtime = require("microtime");
describe("Test stored event", () => {
    test("should create an instance and check the saved values", () => {
        let data = '{some: "data"}';
        let date = microtime.now();
        let type = "type.test";
        let version = 2;
        let id = "123456ABCD";
        let aggId = "12341234";
        let storedEvent = new StoredEvent_1.default(id, type, date, version, data, aggId);
        expect(storedEvent.eventId()).toEqual(id);
        expect(storedEvent.eventName()).toEqual(type);
        expect(storedEvent.occurredOn()).toEqual(date);
        expect(storedEvent.eventBody()).toEqual(data);
        expect(storedEvent.eventVersion()).toEqual(version);
        expect(storedEvent.aggregateId()).toEqual(aggId);
    });
});
