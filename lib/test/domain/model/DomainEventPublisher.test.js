"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomainEventPublisher_1 = require("./../../../src/domain/model/DomainEventPublisher");
let domainEventSubscriber = null;
let mockedDomainEvent = null;
let mockedEventId = null;
class DomainEventTest {
    constructor() {
        this.eventId = () => "";
        this.eventVersion = () => 0;
        this.occurredOn = () => 0;
        this.eventName = () => "";
        this.eventData = () => "";
        this.aggregateId = () => "";
    }
}
describe("Test domain event publisher", () => {
    beforeEach(function () {
        mockedEventId = jest.fn();
        mockedDomainEvent = new DomainEventTest();
        mockedDomainEvent.eventId = mockedEventId;
        DomainEventPublisher_1.default.instance().clearEvents();
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
    test("should create an instance and handle an event", () => {
        let domainEventPublisher = DomainEventPublisher_1.default.instance();
        domainEventPublisher.subscribe(domainEventSubscriber);
        domainEventPublisher.publish(mockedDomainEvent);
        expect(mockedEventId).toBeCalledTimes(1);
    });
    test("should create an instance and subscribe then retrieve it again", () => {
        let domainEventPublisher = DomainEventPublisher_1.default.instance();
        let index = domainEventPublisher.subscribe(domainEventSubscriber);
        expect(domainEventSubscriber).toBe(domainEventPublisher.ofId(index));
    });
    test("should create an instance, then subscribe then unsubscribe", () => {
        let domainEventPublisher = DomainEventPublisher_1.default.instance();
        let index = domainEventPublisher.subscribe(domainEventSubscriber);
        domainEventPublisher.unsubscribe(index);
        expect(domainEventPublisher.ofId(index)).toBe(null);
    });
    test("should publish event and verify that it exists", () => {
        let domainEventPublisher = DomainEventPublisher_1.default.instance();
        domainEventPublisher.publish(mockedDomainEvent);
        expect(domainEventPublisher.domainEvents()[0]).toBe(mockedDomainEvent);
        expect(domainEventPublisher.domainEvents().length).toEqual(1);
    });
    test("should publish event, clear it then to verify that it exists", () => {
        let domainEventPublisher = DomainEventPublisher_1.default.instance();
        domainEventPublisher.publish(mockedDomainEvent);
        expect(domainEventPublisher.domainEvents().length).toEqual(1);
        domainEventPublisher.clearEvents();
        expect(domainEventPublisher.domainEvents().length).toEqual(0);
    });
});
