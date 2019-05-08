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
    /** The data of the event. */
    private _eventData;
    /** When the event happened. */
    private _occurredOn;
    /** The class or type of this event. */
    private _eventName;
    /** Answers the aggregate id, which is the one that published the domain event, or empty string otherwise */
    private _aggregateId;
    /**
     * Construct myself
     *
     * @param eventName The class or type of the event
     * @param occurredOn The date when the event has occurred
     * @param eventVersion The version of the event
     * @param eventData The data of the event
     * @param aggregateId The string id of the aggregate, empty string otherwise
     */
    constructor(eventId: string, eventName: string, occurredOn: number, eventVersion: number, eventData: string, aggregateId: string);
    /**
     * Answers my event unique id
     */
    eventId(): string;
    /**
     * Answers my event name
     */
    eventName(): string;
    /**
     * Answers the time when I occurred
     */
    occurredOn(): number;
    /**
     * Answers my event version
     */
    eventVersion(): number;
    /**
     * Answers my event data
     */
    eventData(): string;
    /**
     * Answers the aggregate id that published this event, empty string otherwise
     */
    aggregateId(): string;
}
