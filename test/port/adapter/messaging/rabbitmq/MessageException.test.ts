import MessageException from './../../../../../src/port/adapter/messaging/rabbitmq/MessageException';

describe('Test MessageException', () => {
	test('should set isRetry and check if it is set', () => {
		let msg = "a test message";
		let messageException = MessageException.instanceWithRetry(msg);

		try {
			throw messageException;
		} catch(e) {
			expect(e.isRetry()).toBeTruthy();
		}
	});

	test('should create an instance without isRetry()', () => {
		let msg = "a test message";
		let messageException = MessageException.instanceWithoutRetry(msg);

		try {
			throw messageException;
		} catch(e) {
			expect(e.isRetry()).toBeFalsy();
		}
	});

	test('should create an instance and retreive the message', () => {
		let msg = "a test message";
		let messageException = MessageException.instanceWithoutRetry(msg);

		expect(messageException.message()).toEqual(msg);
	});
});