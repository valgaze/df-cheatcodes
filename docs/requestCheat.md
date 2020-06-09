## requestCheat

Helper for building properly-formatted request payloads when interacting with DialogFlow services. For specifics, see **[here](https://cloud.google.com/dialogflow/docs/reference/rest/v2/projects.agent.sessions/detectIntent)**

## Simple Text

```ts
import { RequestCheat } from "df-cheatcodes";

async function main() {
  const session = RequestCheat.buildSession;
  const backend = "http://localhost:8000/chat";
  const languageCode = "en_US"; // (optonal), defaults to 'en_US'
  const transformgrpc = false; // (optional), defaults false
  const config = {
    session,
    languageCode,
    transformgrpc,
    backend,
  };
  const requester = new RequestCheat(config);
  const res = await requester.send("hello!!");
  console.log("Result", JSON.stringify(res));
}

main();
```

## Event w/ parameters, request data (transformed & not)

See **[grpc_101.md](./grpc_101.md)** for details

```ts
import { RequestCheat } from "df-cheatcodes";
const session = RequestCheat.buildSessionId();
const backend = "http://localhost:8000/chat";
const languageCode = "en_US"; // (optonal), defauls to 'en_US'
const transformgrpc = true; // (optional)
const config = {
  session,
  languageCode,
  transformgrpc,
  backend,
};

// Note transformgrpc is true
const requester = new RequestCheat(config);

// There are aliases for this, but most explicit version using "global" config (globally-set session, languageCode, etc with overwrites)
const eventPayload = requester.buildRequest({
  kind: "event",
  content: {
    name: "my event",
    parameters: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] },
  },
});

// Send to backend specified in config
requester.send(eventPayload);
/**
 * EventPayload (grpc transformed protostruct on event parameters)
 * {
 *	"queryInput": {
 *		"event": {
 *			"name": "my event",
 *			"parameters": {
 *				"fields": {
 *					"a": {
 *						"kind": "numberValue",
 *						"numberValue": 1
 *					},
 *					"b": {
 *						"kind": "numberValue",
 *						"numberValue": 2
 *					},
 *					"c": {
 *						"kind": "listValue",
 *						"listValue": {
 *							"values": [{
 *								"kind": "stringValue",
 *								"stringValue": "hi"
 *							}, {
 *								"kind": "stringValue",
 *								"stringValue": "yay"
 *							}, {
 *								"kind": "stringValue",
 *								"stringValue": "bonjour"
 *							}]
 *						}
 *					}
 *				}
 *			},
 *			"languageCode": "en_US"
 *		}
 *	}
 *
 */

// Ex. Event w/ request data using alias

const eventName = `myevent`;
const parameters = { xxx: 12345 }; // data/parameters attached to *event*
// Data associated w/ request (conv.cheat.getRequestData in handler)
const requestData = {
  a: 1,
  b: 2,
  c: ["hi", "yay", "bonjour"],
};

const eventPayload = requester.event(eventName, parameters, requestData);
```
