/**
 * I am an abstract id that will be the base class for other classes.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default abstract class AbstractId {
    /** The id of this class */
    private _id;
    /**
     * Construct myself.
     *
     * @param id The string id to be set
     */
    constructor(id: string);
    /**
     * Answers the string id
     */
    id(): string;
    /**
     * I will set the id only if it has a valid length.
     * @param id The id string that is to be set
     */
    private setId;
}
