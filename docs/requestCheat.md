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
å;
main();
```

## Event w/ transformed parameters

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

// There are aliases for this, but most explicit version using "global" config
const eventPayload = requester.constructRequest({
  kind: "event",
  payload: {
    name: "my event",
    parameters: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] },
    languageCode: "en_US",
  },
});

requester.send(eventPayload);
/**
 * EventPayload (grpc transformed)
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
 **/
```

## Event w/ transformed parameters & request data

```ts
    import {RequestCheat} from 'df-cheatcodes'
    const session = RequestCheat.buildSessionId();

    RequestCheat.constructRequest({
     kind: "event",
     payload: {
			"name": "Welcome",
			"languageCode": "en-us"
			"parameters": {
				"z": 9
				"y": 8,
				"x": 7
			}
		},

```

/_
{"queryInput":{"event":{"name":"my event","parameters":{"fields":{"a":{"kind":"numberValue","numberValue":1},"b":{"kind":"numberValue","numberValue":2},"c":{"kind":"listValue","listValue":{"values":[{"kind":"stringValue","stringValue":"hi"},{"kind":"stringValue","stringValue":"yay"},{"kind":"stringValue","stringValue":"bonjour"}]}}}},"languageCode":"en_US"}}}
_/
