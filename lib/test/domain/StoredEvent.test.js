"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoredEvent_1 = require("./../../src/domain/event/StoredEvent");
const microtime = require("microtime");
describe("Test stored event", () => {
    test('should create an instance and check the saved values', () => {
        let data = "{some: \"data\"}";
        let date = microtime.now();
        let appId = 'appId.test';
        let type = 'type.test';
        let version = 2;
        let id = "123456ABCD";
        let storedEvent = new StoredEvent_1.default(id, appId, type, date, version, data);
        expect(storedEvent.eventId()).toEqual(id);
        expect(storedEvent.appId()).toEqual(appId);
        expect(storedEvent.typeName()).toEqual(type);
        expect(storedEvent.occurredOn()).toEqual(date);
        expect(storedEvent.eventBody()).toEqual(data);
        expect(storedEvent.eventVersion()).toEqual(version);
    });
});
