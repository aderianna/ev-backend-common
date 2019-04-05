import { DomainEvent } from "./DomainEvent";
import { DomainEventSubscriber } from "./DomainEventSubscriber";
export declare class DomainEventPublisher {
    private _id;
    private _subscribers;
    private static _instance;
    static instance(): DomainEventPublisher;
    private constructor();
    subscribe(domainEventSubscriber: DomainEventSubscriber): number;
    ofId(id: number): DomainEventSubscriber | null;
    unsubscribe(id: number): void;
    publish(domainEvent: DomainEvent): void;
}
