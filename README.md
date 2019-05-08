## Ethervision Backend - Common Library
[![CircleCI](https://circleci.com/gh/Digital-Mob/ev-backend-common.svg?style=svg)](https://circleci.com/gh/Digital-Mob/ev-backend-common)
[![Doc](https://Digital-Mob.github.io/ev-backend-common.github.io/img/doc.svg)](https://Digital-Mob.github.io/ev-backend-common.github.io/doc/code-doc/index.html)

This is a library that is used as a node package that can be installed using npm.

This library is a common library that is can be used by different projects, it has some classes using typescript and they are some concrete and abstracted classes arranged for different purposes, some of them for example:

- Classes for using RabbitMQ messages system
- Classes for event store
- Classes for domain events
  
And much more.

## Code documentation
In order to learn more about the code classes and their methods you can visit [code doc](https://Digital-Mob.github.io/ev-backend-common.github.io/doc/code-doc/index.html)

## Installation
You can install this library using git url:
```npm i -S https://github.com/Digital-Mob/ev-backend-common.git```

Also you need to have ```ts-node``` installed and that you can run typescript code

## How to use RabbitMQ classes using this library?
Let's take an example of creating an exhange that will be used to publish our messages using a key ``` test_key ```
Let's take an example of using it, it is only for **learning purposes**.

### 1. Create a file ```sender.ts``` with the following:
```
import { Exchange, ConnectionSetting } from 'ev-backend-common';

async function createExchange({
	host,
	port,
	username,
	password,
	exchangeName,
	isDurable
}): Promise<Exchange> {
    return await Exchange.topicInstance(
			ConnectionSetting.instance(host, port, "/", username, password),
			exchangeName,
			isDurable
        );
}

// Run an async function
(async () => {
    try {
        let exchange: Exchange = await createExchange({
            host: "localhost",
            port: 5672,
            username: "rabbitmq",
            password: "rabbitmq",
            exchangeName: "test_sender",
            isDurable: false
        });
        let counter = 0;
        setInterval(() => {
            exchange.publish(
                "test_key",
                `counter: ${counter}, timerstamp: ${Date.now()}`
            );
            counter++;
        }, 4000);
    } catch (e) {
        console.log(e);
    }
})();
```

### 2. Create a file ```receiver.ts``` with the following:
```
import { Exchange, Queue, MessageConsumer } from "ev-backend-common";
import { ExchangeParams, QueueParams, ConnSetting } from "./properties";
import MyListener from "./MyListener";

let listenerName = 'listener';
let queueName;

async function createQueue(
	exchangeParams: ExchangeParams,
	queueParams: QueueParams
): Promise<Queue> {
	try {
		// Create the exchange in order to bind to it, if it is already there, then this will not re-create it
		let exchange = await Exchange.topicInstance(
			exchangeParams.connectionSetting,
			exchangeParams.exchangeName,
			exchangeParams.isDurable
		);
		// Bind the queue to the exchange
		let queue = await Queue.individualExchangeSubscriberInstance(
			exchange,
			queueParams.queueName,
			queueParams.keys
		);
		// Create a consumer, with auto acknowledgment
		MessageConsumer.instance(queue, true).receiveFor(
			// The listener with a name and that is not crashable (this is done for learning purposes)
			new MyListener(listenerName, false)
		);

		return queue;
	} catch (e) {
		console.log(e);
		throw new Error("Could not create queue: " + e);
	}
}

// Run an async function
(async () => {
	const args = process.argv.slice(2);

	if (args.length == 0) {
		console.log('args: <listener name> <queue name>');
		process.exit(1);
	}

	listenerName = args[0];
	queueName = args[1] || 'test_queue1';
	try {
		await createQueue(
			{
				connectionSetting: ConnSetting.createInstance(),
				exchangeName: "test_sender",
				isDurable: false
			},
			{
				queueName: queueName,
				keys: ["test_key"]
			}
		);
	} catch (e) {
		console.log(e);
	}
})();

```

### 3. Create a listener ```MyListener.ts``` with the following:
```
import { Message } from 'amqplib';
import { MessageListener, MessageException } from "ev-backend-common";


export default class MyListener extends MessageListener {
	private _name: string;
	private _isThrowException: boolean;

	constructor(name: string, throwException: boolean) {
		super();
		this._name = name;
		this._isThrowException = throwException;
	}

	handleMessage(msg: Message, ack: (msg: Message) => void) {
		console.log(`listener ${this.name}: ${msg.content.toString()}`);
		if (this.isThrowException()) {
			throw MessageException.instanceWithoutRetry(`listener ${this.name}: throws an exception.`);
		}
		ack(msg); // Even if the channel is auto acknoledged, this will not crash it.
	}

	public isThrowException(): boolean {
		return this._isThrowException;
	} 
}

```

### 4. Create a config properties ```properties.ts``` with the following:
```
import { ConnectionSetting } from "ev-backend-common";


export interface ExchangeParams {
	connectionSetting: ConnectionSetting,
	exchangeName: string;
	isDurable: boolean;
}

export interface QueueParams {
	queueName: string;
	keys: string[];
}

export class ConnSetting {
	static createInstance(): ConnectionSetting {
		return ConnectionSetting.instance(
			"localhost",
			5672,
			"/",
			"rabbitmq",
			"rabbitmq"
		);
	}
}

```
### 5. Open 3 terminals to run one sender and two receivers
#### Terminal 1:
```
npx ts-node sender
```

#### Terminal 2: the receiver will give a name for the listener and the name of the queue
```
npx ts-node receiver listener_1 test_queue1
listener listener_1: counter: 0, timerstamp: 1554470153479
listener listener_1: counter: 1, timerstamp: 1554470157479
listener listener_1: counter: 2, timerstamp: 1554470161481
listener listener_1: counter: 3, timerstamp: 1554470165481
listener listener_1: counter: 4, timerstamp: 1554470169482
listener listener_1: counter: 5, timerstamp: 1554470173484
listener listener_1: counter: 6, timerstamp: 1554470177484
listener listener_1: counter: 7, timerstamp: 1554470181485
listener listener_1: counter: 8, timerstamp: 1554470185485
listener listener_1: counter: 9, timerstamp: 1554470189486
listener listener_1: counter: 10, timerstamp: 1554470193487
listener listener_1: counter: 11, timerstamp: 1554470197488
listener listener_1: counter: 12, timerstamp: 1554470201488
listener listener_1: counter: 13, timerstamp: 1554470205489
...
```

#### Terminal 3: the receiver will give a name for the listener and the name of the queue
```
npx ts-node receiver listener_2 test_queue2
listener listener_2: counter: 0, timerstamp: 1554470153479
listener listener_2: counter: 1, timerstamp: 1554470157479
listener listener_2: counter: 2, timerstamp: 1554470161481
listener listener_2: counter: 3, timerstamp: 1554470165481
listener listener_2: counter: 4, timerstamp: 1554470169482
listener listener_2: counter: 5, timerstamp: 1554470173484
listener listener_2: counter: 6, timerstamp: 1554470177484
listener listener_2: counter: 7, timerstamp: 1554470181485
listener listener_2: counter: 8, timerstamp: 1554470185485
listener listener_2: counter: 9, timerstamp: 1554470189486
listener listener_2: counter: 10, timerstamp: 1554470193487
listener listener_2: counter: 11, timerstamp: 1554470197488
listener listener_2: counter: 12, timerstamp: 1554470201488
listener listener_2: counter: 13, timerstamp: 1554470205489
...
```

You will get a fanout with key, each consumer will get the message in its queue.
If you want to do worker type, then you need to provide the same queue name.


## Consumer and Acknowledgment
Whenever you create a consumer with a manual acknowledgement, then the message listener will receive
acknowledge function, and you can also throw an exception using ```MessageException.instanceWithRetry``` which will
which will make the current message to be requeued.
```
MessageConsumer.instance(queue, true).receiveFor(
			// The listener with a name and that is not crashable (this is done for learning purposes)
			new MyListener(listenerName, false)
		);

class MyListener extends MessageListener {
	handleMessage(msg: Message, ack: (msg: Message) => void) {
		throw MessageException.instanceWithRetry("I am throwing an exception and this string is the message exception");
	}
}
``` 

## Display the errors on the console
You can enable displaying errors on the console by setting the environment variable ```DEBUG``` to ```error```
```
set DEBUG=error
```
Also to disable it by:
```
set DEBUG=""
```

## Catching events
Whenever you want to handle a connection, channel error on the queue or exchange you can use one of node events.EventEmitter functions
```
... some code
// This will catch the event one time, you can use 'on' to catch it everytime
queue.once('closed', (e) => { console.log('error happened through this queue: ' + e); });
```
