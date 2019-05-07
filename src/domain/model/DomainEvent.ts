/**
 * I am an interface that need to be implemented by
 * the subtypes in order to represent a domain event.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
interface DomainEvent {
	/**
	 * The unique id of the event
	 */
	eventId(): string;
	/** A domain event version that will need to recognize
	 * different versions of the domain event.
	 */
	eventVersion(): number;
	/** The time when this event happened. */
	occurredOn(): number;

	/** Answers the name of the event */
	eventName(): string;
	/** Answers the data of this domain event represented in this string */
	eventData(): string;
	/** Answers the aggregate id, which is the one that published the domain event, or empty string otherwise */
	aggregateId(): string;
}

export default DomainEvent;
