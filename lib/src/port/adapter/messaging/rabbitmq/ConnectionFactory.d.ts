import { Connection } from "amqplib";
/**
 * I'm a connection factory that will provide a connection to RabbitMQ.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
export default class ConnectionFactory {
    private _hostName;
    private _port;
    private _virtualHost;
    private _username;
    private _password;
    /**
     * Answers my port number.
     * @return The port number of the connection
     */
    port(): number;
    /**
     * Set my port number.
     * @param port The number of the port for the connection
     */
    private setPort;
    /**
     * Answers my virtual host of the connection.
     * @return The virtual host used in the connection
     */
    virtualHost(): string;
    /**
     * Set my virtual host to be used in the connection.
     * @param virtualHost The string of the virtual host to be set for the connection
     */
    private setVirtualHost;
    /**
     * Answers my connection username
     * @return The username that is used in the connection
     */
    username(): string;
    /**
     * Set my username for the connection
     */
    private setUsername;
    /**
     * Answers my connection password
     * @return The password that is used for this connection
     */
    password(): string;
    /**
     * Set my connection password
     * @param password The string that is used as a connection password
     */
    private setPassword;
    /**
     * Set the host name used in the connection
     * @param hostName The string of the host name used in the connection
     */
    private setHost;
    /**
     * Answers the host name used in the connection
     * @return The host name used in the connection
     */
    host(): string;
    constructor(hostName?: string, port?: number, virtualHost?: string, username?: string, password?: string);
    newConnection(): Promise<Connection>;
}
