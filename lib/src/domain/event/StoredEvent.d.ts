import { DomainEvent } from "../model/DomainEvent";
export declare class StoredEvent implements DomainEvent {
    private _eventId;
    private _eventBody;
    private _occurredOn;
    private _typeName;
    constructor(typeName: string, occurredOn: Date, eventBody: string);
    eventBody(): string;
    eventId(): number;
    typeName(): string;
    occurredOn(): Date;
}
