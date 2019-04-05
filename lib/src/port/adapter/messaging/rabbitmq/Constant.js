"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constant {
}
Constant.INDIVIDUAL_SUBSCRIBER_MUST_HAS_NAME = "An individual subscriber must be named.";
Constant.QUEUE_BUILD_THROWS_ERROR = "queue.build() throws an error: ";
Constant.FAILED_BINDING_QUEUE_AND_EXCHANGE = "Failed to bind the queue and exchange: ";
Constant.PROMISE_ALL_FAILED_TO_BIND_QUEUE_TO_EXCHANGE = "Promise.all() failed to bind the queue and exchange using routing keys: ";
Constant.FAILED_ASSERT_QUEUE = "Failed to assert the queue: ";
Constant.MESSAGE_CONSUMER_ERROR_EVENT_NAME = "messageConsumerError";
Constant.CLOSED_EVENT_NAME = "closed";
Constant.ERROR_EVENT_NAME = "error";
Constant.CHANNEL_CONSUME_ERROR = "channel.consume() throws an error: ";
Constant.MESSAGE_EQUALIZATION_FAILED = "Could not equalize distribution: ";
Constant.EXCHANGE_BUILD_THROWS_ERROR = "exchange.build() throws an error: ";
Constant.FAILED_ASSERT_EXCHANGE = "Failed to assert the exchange: ";
exports.default = Constant;
