"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * I am a stored event that represent a persisted event.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
class StoredEvent {
    /**
     * Construct myself
     *
     * @param appId The originator app that emitted the event
     * @param eventName The class or type of the event
     * @param occurredOn The date when the event has occurred
     * @param eventVersion The version of the event
     * @param eventData The data of the event
     * @param aggregateId The string id of the aggregate, empty string otherwise
     */
    constructor(eventId, appId, eventName, occurredOn, eventVersion, eventData, aggregateId) {
        this._eventId = eventId;
        this._appId = appId;
        this._eventName = eventName;
        this._occurredOn = occurredOn;
        this._eventVersion = eventVersion;
        this._eventData = eventData;
        this._aggregateId = aggregateId;
    }
    /**
     * Answers my event data
     */
    eventBody() {
        return this._eventData;
    }
    /**
     * Answers my event unique id
     */
    eventId() {
        return this._eventId;
    }
    /**
     * Answers my event name
     */
    eventName() {
        return this._eventName;
    }
    /**
     * Answers the time when I occurred
     */
    occurredOn() {
        return this._occurredOn;
    }
    /**
     * Answers my event version
     */
    eventVersion() {
        return this._eventVersion;
    }
    /**
     * Answers my event data
     */
    eventData() {
        return this._eventData;
    }
    /**
     * Answers the aggregate id that published this event, empty string otherwise
     */
    aggregateId() {
        return this._aggregateId;
    }
    /**
     * Answers the application that emitted me
     */
    appId() {
        return this._appId;
    }
}
exports.default = StoredEvent;
