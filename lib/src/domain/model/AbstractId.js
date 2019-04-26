"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assertion");
/**
 * I am an abstract id that will be the base class for other classes.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
class AbstractId {
    /**
     * Construct myself.
     *
     * @param id The string id to be set
     */
    constructor(id) {
        this.setId(id);
    }
    /**
     * Answers the string id
     */
    id() {
        return this._id;
    }
    /**
     * Answers the comparison value between mine and other object
     * @param object The object that needs to check if it has the same value as mine
     */
    equals(object) {
        if ((object != null) && (object != undefined) && (object instanceof AbstractId)) {
            return object.id() == this.id();
        }
        return false;
    }
    /**
     * I will set the id only if it has a valid length.
     * @param id The id string that is to be set
     */
    setId(id) {
        assert.equal(id.length >= 1, true, "id must be a string with lengh >= 1 characters.");
        this._id = id;
    }
}
exports.default = AbstractId;
