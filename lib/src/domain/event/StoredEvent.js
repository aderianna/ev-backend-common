"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StoredEvent {
    constructor(typeName, occurredOn, eventBody) {
        this._eventBody = eventBody;
        this._typeName = typeName;
        this._occurredOn = occurredOn;
    }
    eventBody() {
        return this._eventBody;
    }
    eventId() {
        return this._eventId;
    }
    typeName() {
        return this._typeName;
    }
    occurredOn() {
        return this._occurredOn;
    }
}
exports.StoredEvent = StoredEvent;
