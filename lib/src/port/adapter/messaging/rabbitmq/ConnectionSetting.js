"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assertion");
/**
 * I am a configuration for making a connection to
 * RabbitMQ. I include information for the host, port,
 * virtual host, and user.
 *
 * @author Arkan M. Gerges <arkan.m.gerges@gmail.com>
 */
class ConnectionSetting {
    static instance(hostName, port, virtualHost, username, password) {
        return new this(hostName || "localhost", port || 5672, virtualHost || "/", username || "guest", password || "guest");
    }
    /**
     * Constructs my default state.
     */
    constructor(hostName, port, virtualHost, username, password) {
        this.setHostName(hostName);
        this.setPassword(password);
        this.setPort(port);
        this.setUsername(username);
        this.setVirtualHost(virtualHost);
    }
    /**
     * Answers my hostName.
     */
    hostName() {
        return this._hostName;
    }
    /**
     * Sets my hostName.
     * @param hostName The string to set as my hostName
     */
    setHostName(hostName) {
        assert.notEqual(hostName, "", "Host name must be provided.");
        this._hostName = hostName;
    }
    /**
     * Answers my password.
     */
    password() {
        return this._password;
    }
    /**
     * Sets my password.
     * @param password The string to set as my password
     */
    setPassword(password) {
        this._password = password;
    }
    /**
     * Answers whether or not a port is included.
     */
    port() {
        return this._port;
    }
    /**
     * Answers whether or not a port is included.
     */
    hasPort() {
        return this.port() > 0;
    }
    /**
     * Sets my port.
     * @param port The int to set as my port
     */
    setPort(port) {
        this._port = port;
    }
    /**
     * Answers whether or not the user credentials are included.
     */
    hasUserCredentials() {
        return this.username() != null && this.password() != null;
    }
    /**
     * Answers my username.
     */
    username() {
        return this._username;
    }
    /**
     * Sets my username.
     * @param username The string to set as my username
     */
    setUsername(username) {
        this._username = username;
    }
    /**
     * Answers my virtual host.
     * @return The virtual host used in the connection
     */
    virtualHost() {
        return this._virtualHost;
    }
    /**
     * Sets my virtual host.
     * @param virtualHost The string to set as my virtualHost
     */
    setVirtualHost(virtualHost) {
        assert.notEqual(virtualHost, "", "Virtual host must be provided.");
        this._virtualHost = virtualHost;
    }
}
exports.default = ConnectionSetting;
