import AbstractId from '../../../src/domain/model/AbstractId';
import uuidv1 = require('uuid/v1');

describe("Test abstract id", () => {	
	test('should create an instance of child class inherited from AbstractId class', () => {
		class TestId extends AbstractId {
			static generate(): AbstractId {
				return new this(uuidv1());
			}	
			static generateFrom(id: string): AbstractId {
				return new this(id);
			}
		}

		let obj = TestId.generate();
		let obj2 = TestId.generateFrom('1234');
		expect(obj.id().length > 0).toBeTruthy();
		expect(obj2.id()).toEqual('1234');
	});

	test('should throw an error when id length equals zero', () => {
		class TestId extends AbstractId {
			static generate(): AbstractId {
				return new this(uuidv1());
			}
			static generateFrom(id: string): AbstractId {
				return new this(id);
			}
		}

		expect(() => TestId.generateFrom('')).toThrowError();
	});
});
