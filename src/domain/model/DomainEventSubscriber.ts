import DomainEvent from "./DomainEvent";

/**
 * I am a domain event subscriber that will subscribe to
 * a domain event and handle it through my handle method.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
interface DomainEventSubscriber {
	/** A handler that will handle domain event. */
	handle(domainEvent: DomainEvent): void;
	/** Check if i am subscribed to the domain event */
	isSubscribedTo(domainEvent: DomainEvent): boolean;
}

export default DomainEventSubscriber;