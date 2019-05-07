import DomainEventPublisher from "./../../../src/domain/model/DomainEventPublisher";
import DomainEvent from "./../../../src/domain/model/DomainEvent";
import DomainEventSubscriber from "../../../src/domain/model/DomainEventSubscriber";

let domainEventSubscriber = null;
let mockedDomainEvent = null;
let mockedEventId = null;

class DomainEventTest implements DomainEvent {
	eventId: () => string = () => "";
	eventVersion: () => number = () => 0;
	occurredOn: () => number = () => 0;
	eventName: () => string = () => "";
	eventData: () => string = () => "";
	aggregateId: () => string = () => "";
}

describe("Test domain event publisher", () => {
	beforeEach(function() {
		mockedEventId = jest.fn<string, []>();
		mockedDomainEvent = new DomainEventTest();
		mockedDomainEvent.eventId = mockedEventId;
		class TestDomainEventSubscriber implements DomainEventSubscriber {
			handle(domainEvent: DomainEvent): void {
				domainEvent.eventId();
			}

			isSubscribedTo(domainEvent: DomainEvent): boolean {
				return true;
			}
		}

		domainEventSubscriber = new TestDomainEventSubscriber();
	});

	test("should create an instance and handle an event", () => {
		let domainEventPublisher = DomainEventPublisher.instance();
		domainEventPublisher.subscribe(domainEventSubscriber);
		domainEventPublisher.publish(mockedDomainEvent);

		expect(mockedEventId).toBeCalledTimes(1);
	});

	test("should create an instance and subscribe then retrieve it again", () => {
		let domainEventPublisher = DomainEventPublisher.instance();
		let index = domainEventPublisher.subscribe(domainEventSubscriber);

		expect(domainEventSubscriber).toBe(domainEventPublisher.ofId(index));
	});

	test("should create an instance, then subscribe then unsubscribe", () => {
		let domainEventPublisher = DomainEventPublisher.instance();
		let index = domainEventPublisher.subscribe(domainEventSubscriber);
		domainEventPublisher.unsubscribe(index);
		expect(domainEventPublisher.ofId(index)).toBe(null);
	});
});
