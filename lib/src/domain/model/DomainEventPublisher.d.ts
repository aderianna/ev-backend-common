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
    private _id;
    /** A list of subscribers. */
    private _subscribers;
    /** Keep domain events */
    protected _domainEvents: DomainEvent[];
    /** A single instance of me */
    private static _instance;
    /** Initialize one instance of me */
    static instance(): DomainEventPublisher;
    /** I can not be initialized publically through 'new' keyword */
    protected constructor();
    /**
     * Add a domain event subscriber to the list
     * @param domainEventSubscriber The subscriber that needs to be added in the subscribers list
     * @return The id of the new subscriber
     */
    subscribe(domainEventSubscriber: DomainEventSubscriber): number;
    /**
     * Return a domain event subscriber by index
     * @param id The index of the subscriber
     */
    ofId(id: number): DomainEventSubscriber | null;
    /**
     * Unsubscribe domain event by index
     * @param id The index of the domain event subscriber
     */
    unsubscribe(id: number): void;
    /**
     * Publish a domain event through the interested parties that are
     * represented by domain event subscribers
     * @param domainEvent The domain event that needs to be handled through a domain event subscriber
     */
    publish(domainEvent: DomainEvent): void;
    /**
     * This method needs to be implemented in the child class
     * @param context The context that is used to commit all the domain events
     */
    commit(context: any): Promise<void>;
}
