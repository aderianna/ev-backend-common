"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainEventPublisher {
    constructor() {
        this._id = 0;
        this._subscribers = [];
    }
    static instance() {
        if (null === DomainEventPublisher._instance) {
            DomainEventPublisher._instance = new this();
        }
        return DomainEventPublisher._instance;
    }
    subscribe(domainEventSubscriber) {
        let id = this._id;
        this._subscribers[id] = domainEventSubscriber;
        this._id++;
        return id;
    }
    ofId(id) {
        return typeof this._subscribers[id] !== "undefined"
            ? this._subscribers[id]
            : null;
    }
    unsubscribe(id) {
        delete this._subscribers[id];
    }
    publish(domainEvent) {
        this._subscribers.forEach((aSubscriber) => {
            if (aSubscriber.isSubscribedTo(domainEvent)) {
                aSubscriber.handle(domainEvent);
            }
        });
    }
}
DomainEventPublisher._instance = null;
exports.DomainEventPublisher = DomainEventPublisher;
