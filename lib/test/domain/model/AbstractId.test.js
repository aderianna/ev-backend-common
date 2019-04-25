"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractId_1 = require("../../../src/domain/model/AbstractId");
const uuidv1 = require("uuid/v1");
describe("Test abstract id", () => {
    test('should create an instance of child class inherited from AbstractId class', () => {
        class TestId extends AbstractId_1.default {
            static generate() {
                return new this(uuidv1());
            }
            static generateFrom(id) {
                return new this(id);
            }
        }
        let obj = TestId.generate();
        let obj2 = TestId.generateFrom('1234');
        expect(obj.id().length > 0).toBeTruthy();
        expect(obj2.id()).toEqual('1234');
    });
    test('should throw an error when id length equals zero', () => {
        class TestId extends AbstractId_1.default {
            static generate() {
                return new this(uuidv1());
            }
            static generateFrom(id) {
                return new this(id);
            }
        }
        expect(() => TestId.generateFrom('')).toThrowError();
    });
});
