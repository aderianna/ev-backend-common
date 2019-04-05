import * as assert from "assertion";

/**
 * I am a configuration for making a connection to
 * RabbitMQ. I include information for the host, port,
 * virtual host, and user.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class ConnectionSetting {
	/** My hostName, which is the name of the host server. */
	private _hostName!: string;

	/** My password, which is the password of the connecting user. */
	private _password!: string;

	/** My port, which is the host server port. */
	private _port!: number;

	/** My username, which is the name of the connecting user. */
	private _username!: string;

	/** My virtualHost, which is the name of the RabbitMQ virtual host. */
	private _virtualHost!: string;

	/**
	 * Answers a new ConnectionSetting with defaults.
	 * @return ConnectionSetting
	 */
	public static instance(): ConnectionSetting;

	/**
	 * Answers a new ConnectionSetting with a specific
	 * host name and virtual host and remaining defaults.
	 * @param hostName The String name of the host server
	 * @param port The int port number on the host server, or -1
	 * @param virtualHost The String name of the virtual host
	 * @return ConnectionSetting
	 */
	public static instance(
		hostName: string,
		port?: number,
		virtualHost?: string
	): ConnectionSetting;

	/**
	 * Constructs my default state.
	 * @param hostName The String name of the host server
	 * @param port The int port number on the host server, or -1
	 * @param virtualHost The String name of the virtual host
	 * @param username The String name of the user, or null
	 * @param password The String password of the user, or null
	 */ public static instance(
		hostName?: string,
		port?: number,
		virtualHost?: string,
		username?: string,
		password?: string
	);
	public static instance(
		hostName?: string,
		port?: number,
		virtualHost?: string,
		username?: string,
		password?: string
	): ConnectionSetting {
		return new this(
			hostName || "localhost",
			port || 5672,
			virtualHost || "/",
			username || "guest",
			password || "guest"
		);
	}

	/**
	 * Constructs my default state.
	 */
	private constructor(
		hostName: string,
		port: number,
		virtualHost: string,
		username: string,
		password: string
	) {
		this.setHostName(hostName);
		this.setPassword(password);
		this.setPort(port);
		this.setUsername(username);
		this.setVirtualHost(virtualHost);
	}
	/**
	 * Answers my hostName.
	 */
	public hostName(): string {
		return this._hostName;
	}
	/**
	 * Sets my hostName.
	 * @param hostName The string to set as my hostName
	 */
	private setHostName(hostName: string): void {
		assert.notEqual(hostName, "", "Host name must be provided.");

		this._hostName = hostName;
	}
	/**
	 * Answers my password.
	 */
	public password(): string {
		return this._password;
	}
	/**
	 * Sets my password.
	 * @param password The string to set as my password
	 */
	private setPassword(password: string): void {
		this._password = password;
	}

	/**
	 * Answers whether or not a port is included.
	 */
	public port(): number {
		return this._port;
	}
	/**
	 * Answers whether or not a port is included.
	 */
	public hasPort(): boolean {
		return this.port() > 0;
	}
	/**
	 * Sets my port.
	 * @param port The int to set as my port
	 */
	private setPort(port: number): void {
		this._port = port;
	}
	/**
	 * Answers whether or not the user credentials are included.
	 */
	public hasUserCredentials(): boolean {
		return this.username() != null && this.password() != null;
	}
	/**
	 * Answers my username.
	 */
	public username(): string {
		return this._username;
	}
	/**
	 * Sets my username.
	 * @param username The string to set as my username
	 */
	private setUsername(username: string): void {
		this._username = username;
	}
	/**
	 * Answers my virtual host.
	 * @return The virtual host used in the connection
	 */
	public virtualHost(): string {
		return this._virtualHost;
	}
	/**
	 * Sets my virtual host.
	 * @param virtualHost The string to set as my virtualHost
	 */
	private setVirtualHost(virtualHost: string): void {
		assert.notEqual(virtualHost, "", "Virtual host must be provided.");

		this._virtualHost = virtualHost;
	}
}
