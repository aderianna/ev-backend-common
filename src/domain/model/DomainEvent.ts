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
}

export default DomainEvent;