import * as assert from "assertion";

/**
 * I am an abstract id that will be the base class for other classes.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default abstract class AbstractId {
	/** The id of this class */
	private _id: string;

	/**
	 * Construct myself.
	 *
	 * @param id The string id to be set
	 */
	public constructor(id: string) {
		this.setId(id);
	}

	/**
	 * Answers the string id
	 */
	public id(): string {
		return this._id;
	}

	/**
	 * I will set the id only if it has a valid length.
	 * @param id The id string that is to be set
	 */
	private setId(id: string): void {
		assert.equal(
			id.length >= 1,
			true,
			"id must be a string with lengh >= 1 characters."
		);
		this._id = id;
	}
}