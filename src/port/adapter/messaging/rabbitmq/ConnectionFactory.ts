import { connect as amqplibConnect, Connection } from "amqplib";

/**
 * I'm a connection factory that will provide a connection to RabbitMQ.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class ConnectionFactory {
	private _hostName: string;
	private _port: number;
	private _virtualHost: string;
	private _username: string;
	private _password: string;

	/**
	 * Answers my port number.
	 * @return The port number of the connection
	 */
	public port(): number {
		return this._port;
	}

	/**
	 * Set my port number.
	 * @param port The number of the port for the connection
	 */
	private setPort(port: number): void {
		this._port = port || 5672;
	}

	/**
	 * Answers my virtual host of the connection.
	 * @return The virtual host used in the connection
	 */
	public virtualHost(): string {
		return this._virtualHost;
	}

	/**
	 * Set my virtual host to be used in the connection.
	 * @param virtualHost The string of the virtual host to be set for the connection
	 */
	private setVirtualHost(virtualHost: string): void {
		this._virtualHost = virtualHost || "/";
	}

	/**
	 * Answers my connection username
	 * @return The username that is used in the connection
	 */
	public username(): string {
		return this._username;
	}

	/**
	 * Set my username for the connection
	 */
	private setUsername(username: string): void {
		this._username = username || "guest";
	}

	/**
	 * Answers my connection password
	 * @return The password that is used for this connection
	 */
	public password(): string {
		return this._password;
	}

	/**
	 * Set my connection password
	 * @param password The string that is used as a connection password
	 */
	private setPassword(password: string): void {
		this._password = password || "guest";
	}

	/**
	 * Set the host name used in the connection
	 * @param hostName The string of the host name used in the connection
	 */
	private setHost(hostName: string): void {
		this._hostName = hostName || "localhost";
	}

	/**
	 * Answers the host name used in the connection
	 * @return The host name used in the connection
	 */
	public host(): string {
		return this._hostName;
	}

	public constructor(hostName?: string, port?: number, virtualHost?: string, username?: string, password?: string) {
		this.setHost(hostName);
		this.setPort(port);
		this.setVirtualHost(virtualHost);
		this.setUsername(username);
		this.setPassword(password);
	}

	public newConnection(): Promise<Connection> {
		return new Promise(async (resolve, reject): Promise<void> => {
			try {
				let conn = await amqplibConnect(
					`amqp://${this.username()}:${this.password()}@${this.host()}:${this.port()}/${encodeURIComponent(
						this.virtualHost()
					)}`
				);

				resolve(conn);
			} catch (e) {
				reject(e);
			}
		});
	}
}
