import DomainEvent from "../model/DomainEvent";

/**
 * I am a stored event that represent a persisted event.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class StoredEvent implements DomainEvent {
	/** The version of the event. */
	private _eventVersion: number;
	/** The unique id of the event. */
	private _eventId: string;
	/** The data of the event. */
	private _eventData: string;
	/** When the event happened. */
	private _occurredOn: number;
	/** The class or type of this event. */
	private _eventName: string;
	/** Answers the aggregate id, which is the one that published the domain event, or empty string otherwise */
	private _aggregateId: string;

	/**
	 * Construct myself
	 *
	 * @param eventName The class or type of the event
	 * @param occurredOn The date when the event has occurred
	 * @param eventVersion The version of the event
	 * @param eventData The data of the event
	 * @param aggregateId The string id of the aggregate, empty string otherwise
	 */
	public constructor(
		eventId: string,
		eventName: string,
		occurredOn: number,
		eventVersion: number,
		eventData: string,
		aggregateId: string
	) {
		this._eventId = eventId;
		this._eventName = eventName;
		this._occurredOn = occurredOn;
		this._eventVersion = eventVersion;
		this._eventData = eventData;
		this._aggregateId = aggregateId;
	}

	/**
	 * Answers my event data
	 */
	public eventBody(): string {
		return this._eventData;
	}

	/**
	 * Answers my event unique id
	 */
	public eventId(): string {
		return this._eventId;
	}

	/**
	 * Answers my event name
	 */
	public eventName(): string {
		return this._eventName;
	}

	/**
	 * Answers the time when I occurred
	 */
	public occurredOn(): number {
		return this._occurredOn;
	}

	/**
	 * Answers my event version
	 */
	public eventVersion(): number {
		return this._eventVersion;
	}

	/**
	 * Answers my event data
	 */
	public eventData(): string {
		return this._eventData;
	}

	/**
	 * Answers the aggregate id that published this event, empty string otherwise
	 */
	public aggregateId(): string {
		return this._aggregateId;
	}
}
