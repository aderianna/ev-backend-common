import { DomainEvent } from "./DomainEvent";
export interface DomainEventSubscriber {
    handle(domainEvent: DomainEvent): void;
    isSubscribedTo(domainEvent: DomainEvent): boolean;
}
