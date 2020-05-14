## gRPC

- [(very) Short Version](#very-short-explanation)

- [Short Example](#short-example)

- [Resources](#further-reading)

### Very Short Explanation

```
tl;dr:

Send data to DialogFlow: transform JSON >> ProtoStruct

Receive data from DialogFlow: transform ProtoStruct >> JSON
```

Good news: df-cheatcodes can handle this for you-- either on the "frontend" (transform requests/responses) or server-side

### Short Example

Anytime you send data besides text (ie event parameters, request data, etc) or receive non-text data (rich responses) you need to transform or convert that data into the expected format

Ex. If you send this Welcome event + associated request data to DialogFlow, the request data (`queryParams.payload`) & event parameters (`queryInput.event.parameters`) will not pass through as expected (ie failure):

```js
{
	"session": "123456789-ab22-33cd-942e-fg1234567890hi",
	"queryInput": {
		"event": {
			"name": "Welcome",
			"languageCode": "en-us"
			"parameters": {
				"z": 9
				"y": 8,
				"x": 7
			}
		}
	},
	"queryParams": {
		"payload": {
			"a": 1,
			"b": 2,
			"c": "bongo",
			"d": [1, 2, "bongo", 4]
		}
	}
}
```

The queryParams.payload need to be transformed into a **[struct](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf?&_ga=2.43469029.1906484857.1585460425-136336632.1579631389#google.protobuf.Struct)**

```js
{
	"session": "123456789-ab22-33cd-942e-fg1234567890hi",
	"queryInput": {
		"event": {
			"name": "Welcome",
			"languageCode": "en-us",
			"parameters": {
                "fields": {
                    "z": {
                        "kind": "numberValue",
                        "numberValue": 9
                    },
                    "y": {
                        "kind": "numberValue",
                        "numberValue": 8
                    },
                    "x": {
                        "kind": "numberValue",
                        "numberValue": 7
                    }
                }
            }
		}
	},
	"queryParams": {
		"payload": {
			"fields": {
				"a": {
					"kind": "numberValue",
					"numberValue": 1
				},
				"b": {
					"kind": "numberValue",
					"numberValue": 2
				},
				"c": {
					"kind": "stringValue",
					"stringValue": "bongo"
				},
				"d": {
					"kind": "listValue",
					"listValue": {
						"values": [{
							"kind": "numberValue",
							"numberValue": 1
						}, {
							"kind": "numberValue",
							"numberValue": 2
						}, {
							"kind": "stringValue",
							"stringValue": "bongo"
						}, {
							"kind": "numberValue",
							"numberValue": 4
						}]
					}
				}
			}
		}
	}
}
```

## Further Reading

- gRPC: https://en.wikipedia.org/wiki/GRPC

- RPC: https://en.wikipedia.org/wiki/Remote_procedure_call

- https://stackoverflow.com/questions/47583996/send-parameters-to-webhook-on-dialogflow-sdk-v2/47666256#47666256

- https://www.slideshare.net/apigee/grpc-the-story-of-microservices-at-square-59995024

- http://dist-prog-book.com/chapter/1/gRPC.html

- https://developers.google.com/protocol-buffers/docs/reference/google.protobuf?&_ga=2.43469029.1906484857.1585460425-136336632.1579631389#google.protobuf.Struct

- https://cloud.google.com/dialogflow/docs/reference/rest/v2/projects.agent.sessions/detectIntent

- https://cloud.google.com/dialogflow/docs/reference/rest/v2/DetectIntentResponse

- https://www.npmjs.com/package/pb-util

- (jsonToStructProto, structProtoToJson): https://github.com/googleapis/nodejs-dialogflow/blob/d907f3af57438c3e88c274b100eab520b5b51062/samples/structjson.js
