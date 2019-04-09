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
	/** The body data of the event. */
	private _eventBody: string;
	/** When the event happened. */
	private _occurredOn: number;
	/** The class or type of this event. */
	private _typeName: string;
	/** The originator app who emitted this event */
	private _appId: string;

	/**
	 * Construct myself
	 * 
	 * @param appId The originator app that emitted the event
	 * @param typeName The class or type of the event
	 * @param occurredOn The date when the event has occurred
	 * @param version The version of the event
	 * @param eventBody The data of the event
	 */
	public constructor(eventId: string, appId: string, typeName: string, occurredOn: number,
		version: number, eventBody: string) {
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
	public eventBody(): string {
		return this._eventBody;
	}

	/**
	 * Answers my event unique id
	 */
	public eventId(): string {
		return this._eventId;
	}

	/**
	 * Answers my type
	 */
	public typeName(): string {
		return this._typeName;
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
	 * Answers the application that emitted me
	 */
	public appId(): string {
		return this._appId;
	}
}
