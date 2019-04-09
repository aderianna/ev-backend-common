"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomainEventPublisher_1 = require("./../../../src/domain/model/DomainEventPublisher");
let domainEventSubscriber = null;
let mockedDomainEvent = null;
let mockedEventId = null;
class DomainEventTest {
    constructor() {
        this.eventId = () => '';
        this.eventVersion = () => 0;
        this.occurredOn = () => 0;
    }
}
describe("Test domain event publisher", () => {
    beforeEach(function () {
        mockedEventId = jest.fn();
        mockedDomainEvent = new DomainEventTest();
        mockedDomainEvent.eventId = mockedEventId;
        class TestDomainEventSubscriber {
            handle(domainEvent) {
                domainEvent.eventId();
            }
            isSubscribedTo(domainEvent) {
                return true;
            }
        }
        domainEventSubscriber = new TestDomainEventSubscriber();
    });
    test('should create an instance and handle an event', () => {
        let domainEventPublisher = DomainEventPublisher_1.default.instance();
        domainEventPublisher.subscribe(domainEventSubscriber);
        domainEventPublisher.publish(mockedDomainEvent);
        expect(mockedEventId).toBeCalledTimes(1);
    });
    test('should create an instance and subscribe then retrieve it again', () => {
        let domainEventPublisher = DomainEventPublisher_1.default.instance();
        let index = domainEventPublisher.subscribe(domainEventSubscriber);
        expect(domainEventSubscriber).toBe(domainEventPublisher.ofId(index));
    });
    test('should create an instance, then subscribe then unsubscribe', () => {
        let domainEventPublisher = DomainEventPublisher_1.default.instance();
        let index = domainEventPublisher.subscribe(domainEventSubscriber);
        domainEventPublisher.unsubscribe(index);
        expect(domainEventPublisher.ofId(index)).toBe(null);
    });
});
