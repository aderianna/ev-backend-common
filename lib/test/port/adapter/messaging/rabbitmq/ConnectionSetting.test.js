"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionSetting_1 = require("../../../../../src/port/adapter/messaging/rabbitmq/ConnectionSetting");
describe("Test connection setting", () => {
    test("should create an instance from instance() with default parameters", () => {
        let conSettting = ConnectionSetting_1.default.instance();
        expect(conSettting.hostName()).toEqual("localhost");
        expect(conSettting.port()).toEqual(5672);
        expect(conSettting.virtualHost()).toEqual("/");
        expect(conSettting.username()).toEqual("guest");
        expect(conSettting.password()).toEqual("guest");
    });
    test("should keep the values correctly provided in the instance()", () => {
        let conSettting = ConnectionSetting_1.default.instance("testHost", 1234, "testVirtHost");
        expect(conSettting.hostName()).toEqual("testHost");
        expect(conSettting.port()).toEqual(1234);
        expect(conSettting.virtualHost()).toEqual("testVirtHost");
        expect(conSettting.username()).toEqual("guest");
        expect(conSettting.password()).toEqual("guest");
    });
    test("should create an instance with the given parameters", () => {
        let conSettting = ConnectionSetting_1.default.instance("local", 1234, "virt", "user", "pass");
        expect(conSettting.hostName()).toEqual("local");
        expect(conSettting.port()).toEqual(1234);
        expect(conSettting.virtualHost()).toEqual("virt");
        expect(conSettting.username()).toEqual("user");
        expect(conSettting.password()).toEqual("pass");
    });
    test("should has user credentials", () => {
        let conSettting = ConnectionSetting_1.default.instance("local", 1234, "virt", "user", "pass");
        expect(conSettting.hasUserCredentials()).toEqual(true);
    });
    test("should throw an error when providing empty hostname", () => {
        expect(ConnectionSetting_1.default.instance).toThrow();
        ConnectionSetting_1.default.instance("", 1234, "virt", "user", "pass");
    });
    test("should throw an error when providing empty virtual host", () => {
        expect(ConnectionSetting_1.default.instance).toThrow();
        ConnectionSetting_1.default.instance("localhost", 1234, "", "user", "pass");
    });
    test("should hasPort() return true when its > 0", () => {
        let conSettting = ConnectionSetting_1.default.instance("local", 1234, "virt", "user", "pass");
        expect(conSettting.hasPort()).toEqual(true);
    });
});
