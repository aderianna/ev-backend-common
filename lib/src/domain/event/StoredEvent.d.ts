import DomainEvent from "../model/DomainEvent";
/**
 * I am a stored event that represent a persisted event.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class StoredEvent implements DomainEvent {
    /** The version of the event. */
    private _eventVersion;
    /** The unique id of the event. */
    private _eventId;
    /** The body data of the event. */
    private _eventBody;
    /** When the event happened. */
    private _occurredOn;
    /** The class or type of this event. */
    private _typeName;
    /** The originator app who emitted this event */
    private _appId;
    /**
     * Construct myself
     *
     * @param appId The originator app that emitted the event
     * @param typeName The class or type of the event
     * @param occurredOn The date when the event has occurred
     * @param version The version of the event
     * @param eventBody The data of the event
     */
    constructor(eventId: string, appId: string, typeName: string, occurredOn: number, version: number, eventBody: string);
    /**
     * Answers my event data
     */
    eventBody(): string;
    /**
     * Answers my event unique id
     */
    eventId(): string;
    /**
     * Answers my type
     */
    typeName(): string;
    /**
     * Answers the time when I occurred
     */
    occurredOn(): number;
    /**
     * Answers my event version
     */
    eventVersion(): number;
    /**
     * Answers the application that emitted me
     */
    appId(): string;
}
