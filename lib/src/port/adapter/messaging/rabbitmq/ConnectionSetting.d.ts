/**
 * I am a configuration for making a connection to
 * RabbitMQ. I include information for the host, port,
 * virtual host, and user.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class ConnectionSetting {
    /** My hostName, which is the name of the host server. */
    private _hostName;
    /** My password, which is the password of the connecting user. */
    private _password;
    /** My port, which is the host server port. */
    private _port;
    /** My username, which is the name of the connecting user. */
    private _username;
    /** My virtualHost, which is the name of the RabbitMQ virtual host. */
    private _virtualHost;
    /**
     * Answers a new ConnectionSetting with defaults.
     * @return ConnectionSetting
     */
    static instance(): ConnectionSetting;
    /**
     * Answers a new ConnectionSetting with a specific
     * host name and virtual host and remaining defaults.
     * @param hostName The String name of the host server
     * @param port The int port number on the host server, or -1
     * @param virtualHost The String name of the virtual host
     * @return ConnectionSetting
     */
    static instance(hostName: string, port?: number, virtualHost?: string): ConnectionSetting;
    /**
     * Constructs my default state.
     * @param hostName The String name of the host server
     * @param port The int port number on the host server, or -1
     * @param virtualHost The String name of the virtual host
     * @param username The String name of the user, or null
     * @param password The String password of the user, or null
     */ static instance(hostName?: string, port?: number, virtualHost?: string, username?: string, password?: string): any;
    /**
     * Constructs my default state.
     */
    private constructor();
    /**
     * Answers my hostName.
     */
    hostName(): string;
    /**
     * Sets my hostName.
     * @param hostName The string to set as my hostName
     */
    private setHostName;
    /**
     * Answers my password.
     */
    password(): string;
    /**
     * Sets my password.
     * @param password The string to set as my password
     */
    private setPassword;
    /**
     * Answers whether or not a port is included.
     */
    port(): number;
    /**
     * Answers whether or not a port is included.
     */
    hasPort(): boolean;
    /**
     * Sets my port.
     * @param port The int to set as my port
     */
    private setPort;
    /**
     * Answers whether or not the user credentials are included.
     */
    hasUserCredentials(): boolean;
    /**
     * Answers my username.
     */
    username(): string;
    /**
     * Sets my username.
     * @param username The string to set as my username
     */
    private setUsername;
    /**
     * Answers my virtual host.
     * @return The virtual host used in the connection
     */
    virtualHost(): string;
    /**
     * Sets my virtual host.
     * @param virtualHost The string to set as my virtualHost
     */
    private setVirtualHost;
}
