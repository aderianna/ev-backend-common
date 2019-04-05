export default class Constant {
	public static readonly CONSUMER_ERROR: string = "An error has occurred when starting to consume a message: ";
	public static readonly INDIVIDUAL_SUBSCRIBER_MUST_HAS_NAME: string =
		"An individual subscriber must be named.";
	public static readonly QUEUE_BUILD_THROWS_ERROR: string =
		"queue.build() throws an error: ";
	public static readonly FAILED_BINDING_QUEUE_AND_EXCHANGE: string =
		"Failed to bind the queue and exchange: ";
	public static readonly PROMISE_ALL_FAILED_TO_BIND_QUEUE_TO_EXCHANGE: string =
		"Promise.all() failed to bind the queue and exchange using routing keys: ";
	public static readonly FAILED_ASSERT_QUEUE: string =
		"Failed to assert the queue: ";
	public static readonly MESSAGE_CONSUMER_ERROR_EVENT_NAME: string =
		"messageConsumerError";
	public static readonly CLOSED_EVENT_NAME: string = "closed";
	public static readonly ERROR_EVENT_NAME: string = "error";
	public static readonly CHANNEL_CONSUME_ERROR: string =
		"channel.consume() throws an error: ";
	public static readonly MESSAGE_EQUALIZATION_FAILED: string =
		"Could not equalize distribution: ";
	public static readonly EXCHANGE_BUILD_THROWS_ERROR: string =
		"exchange.build() throws an error: ";
	public static readonly FAILED_ASSERT_EXCHANGE: string =
		"Failed to assert the exchange: ";
}
