import DomainEvent from "./DomainEvent";
import DomainEventSubscriber from "./DomainEventSubscriber";

/**
 * I am the domain event publisher that will public domain events
 * to the domain event subscribers.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class DomainEventPublisher {
	/** An index of the current subscriber. */
	private _id: number = 0;
	/** A list of subscribers. */
	private _subscribers: DomainEventSubscriber[] = [];
	/** Keep domain events */
	protected _domainEvents: DomainEvent[] = [];
	/** A single instance of me */
	private static _instance: DomainEventPublisher = null;

	/** Initialize one instance of me */
	public static instance(): DomainEventPublisher {
		if (null === DomainEventPublisher._instance) {
			DomainEventPublisher._instance = new this();
		}

		return DomainEventPublisher._instance;
	}

	/** I can not be initialized publically through 'new' keyword */
	protected constructor() {
		this._subscribers = [];
	}

	/**
	 * Add a domain event subscriber to the list
	 * @param domainEventSubscriber The subscriber that needs to be added in the subscribers list
	 * @return The id of the new subscriber
	 */
	public subscribe(domainEventSubscriber: DomainEventSubscriber): number {
		let id: number = this._id;
		this._subscribers[id] = domainEventSubscriber;
		this._id++;

		return id;
	}

	/**
	 * Return a domain event subscriber by index
	 * @param id The index of the subscriber
	 */
	public ofId(id: number): DomainEventSubscriber | null {
		return typeof this._subscribers[id] !== "undefined"
			? this._subscribers[id]
			: null;
	}

	/**
	 * Unsubscribe domain event by index
	 * @param id The index of the domain event subscriber
	 */
	public unsubscribe(id: number): void {
		delete this._subscribers[id];
	}

	/**
	 * Publish a domain event through the interested parties that are
	 * represented by domain event subscribers
	 * @param domainEvent The domain event that needs to be handled through a domain event subscriber
	 */
	public publish(domainEvent: DomainEvent): void {
		this._domainEvents.push(domainEvent);
		this._subscribers.forEach(
			(aSubscriber: DomainEventSubscriber): void => {
				if (aSubscriber.isSubscribedTo(domainEvent)) {
					aSubscriber.handle(domainEvent);
				}
			}
		);
	}

	/**
	 * This method needs to be implemented in the child class
	 * @param context The context that is used to commit all the domain events
	 */
	public commit(context): Promise<void> {
		return new Promise(
			(r): void => {
				context != null ? r() : r();
			}
		);
	}
}
