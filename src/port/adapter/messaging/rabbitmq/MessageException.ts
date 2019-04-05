/**
 * I'm a message exception that you can throw me passing
 * a retry property, that will allow the message to be requeued
 * if it is set to true.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class MessageException {
	/** My retry indicator. */
	private _retry: boolean;

	/** My error message */
	private _message: string;

	/**
	 * Constructs my default state.
	 * @param message the String message
	 * @param isRetry the boolean indicating whether or not to retry sending
	 */
	private constructor(message: string, isRetry: boolean) {
		this.setRetry(isRetry);
		this.setMessage(message);
	}

	/**
	 * Constructs my default state that has a retry.
	 * @param message The string message
	 */
	public static instanceWithRetry(message: string): MessageException {
		return new this(message, true);
	}

	/**
	 * Constructs my default state that does not need a retry.
	 * @param message The string message
	 */
	public static instanceWithoutRetry(message: string): MessageException {
		return new this(message, false);
	}

	/**
	 * Answers whether or not retry is set. Retry can be
	 * used by a MessageListener when it wants the message
	 * it has attempted to handle to be re-queued rather than
	 * rejected, so that it can re-attempt handling later.
	 */
	public isRetry(): boolean {
		return this._retry;
	}

	/**
	 * Sets my retry.
	 * @param retry the boolean to set as my retry
	 */
	private setRetry(retry: boolean): void {
		this._retry = retry;
	}

	/**
	 * Sets a message
	 * @param message This is the string message
	 */
	private setMessage(message: string): void {
		this._message = message;
	}

	/**
	 * Answers the message string
	 */
	public message(): string {
		return this._message;
	}
}
