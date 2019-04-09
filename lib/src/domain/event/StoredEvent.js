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
     * @param typeName The class or type of the event
     * @param occurredOn The date when the event has occurred
     * @param version The version of the event
     * @param eventBody The data of the event
     */
    constructor(eventId, appId, typeName, occurredOn, version, eventBody) {
        this._eventId = eventId;
        this._appId = appId;
        this._typeName = typeName;
        this._occurredOn = occurredOn;
        this._eventVersion = version;
        this._eventBody = eventBody;
    }
    /**
     * Answers my event data
     */
    eventBody() {
        return this._eventBody;
    }
    /**
     * Answers my event unique id
     */
    eventId() {
        return this._eventId;
    }
    /**
     * Answers my type
     */
    typeName() {
        return this._typeName;
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
     * Answers the application that emitted me
     */
    appId() {
        return this._appId;
    }
}
exports.default = StoredEvent;
