"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
/**
 * I'm a connection factory that will provide a connection to RabbitMQ.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
class ConnectionFactory {
    /**
     * Answers my port number.
     * @return The port number of the connection
     */
    port() {
        return this._port;
    }
    /**
     * Set my port number.
     * @param port The number of the port for the connection
     */
    setPort(port) {
        this._port = port || 5672;
    }
    /**
     * Answers my virtual host of the connection.
     * @return The virtual host used in the connection
     */
    virtualHost() {
        return this._virtualHost;
    }
    /**
     * Set my virtual host to be used in the connection.
     * @param virtualHost The string of the virtual host to be set for the connection
     */
    setVirtualHost(virtualHost) {
        this._virtualHost = virtualHost || "/";
    }
    /**
     * Answers my connection username
     * @return The username that is used in the connection
     */
    username() {
        return this._username;
    }
    /**
     * Set my username for the connection
     */
    setUsername(username) {
        this._username = username || "guest";
    }
    /**
     * Answers my connection password
     * @return The password that is used for this connection
     */
    password() {
        return this._password;
    }
    /**
     * Set my connection password
     * @param password The string that is used as a connection password
     */
    setPassword(password) {
        this._password = password || "guest";
    }
    /**
     * Set the host name used in the connection
     * @param hostName The string of the host name used in the connection
     */
    setHost(hostName) {
        this._hostName = hostName || "localhost";
    }
    /**
     * Answers the host name used in the connection
     * @return The host name used in the connection
     */
    host() {
        return this._hostName;
    }
    constructor(hostName, port, virtualHost, username, password) {
        this.setHost(hostName);
        this.setPort(port);
        this.setVirtualHost(virtualHost);
        this.setUsername(username);
        this.setPassword(password);
    }
    newConnection() {
        return new Promise(async (resolve, reject) => {
            try {
                let conn = await amqplib_1.connect(`amqp://${this.username()}:${this.password()}@${this.host()}:${this.port()}/${encodeURIComponent(this.virtualHost())}`);
                resolve(conn);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.default = ConnectionFactory;
