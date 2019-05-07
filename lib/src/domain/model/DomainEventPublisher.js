"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * I am the domain event publisher that will public domain events
 * to the domain event subscribers.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
class DomainEventPublisher {
    /** I can not be initialized publically through 'new' keyword */
    constructor() {
        /** An index of the current subscriber. */
        this._id = 0;
        /** A list of subscribers. */
        this._subscribers = [];
        /** Keep domain events */
        this._domainEvents = [];
        this._subscribers = [];
    }
    /** Initialize one instance of me */
    static instance() {
        if (null === DomainEventPublisher._instance) {
            DomainEventPublisher._instance = new this();
        }
        return DomainEventPublisher._instance;
    }
    /**
     * Add a domain event subscriber to the list
     * @param domainEventSubscriber The subscriber that needs to be added in the subscribers list
     * @return The id of the new subscriber
     */
    subscribe(domainEventSubscriber) {
        let id = this._id;
        this._subscribers[id] = domainEventSubscriber;
        this._id++;
        return id;
    }
    /**
     * Return a domain event subscriber by index
     * @param id The index of the subscriber
     */
    ofId(id) {
        return typeof this._subscribers[id] !== "undefined"
            ? this._subscribers[id]
            : null;
    }
    /**
     * Unsubscribe domain event by index
     * @param id The index of the domain event subscriber
     */
    unsubscribe(id) {
        delete this._subscribers[id];
    }
    /**
     * Publish a domain event through the interested parties that are
     * represented by domain event subscribers
     * @param domainEvent The domain event that needs to be handled through a domain event subscriber
     */
    publish(domainEvent) {
        this._domainEvents.push(domainEvent);
        this._subscribers.forEach((aSubscriber) => {
            if (aSubscriber.isSubscribedTo(domainEvent)) {
                aSubscriber.handle(domainEvent);
            }
        });
    }
    /**
     * Answers the published domain events
     */
    domainEvents() {
        return this._domainEvents;
    }
    /**
     * Clear the domain events
     */
    clearEvents() {
        this._domainEvents = [];
    }
}
/** A single instance of me */
DomainEventPublisher._instance = null;
exports.default = DomainEventPublisher;
