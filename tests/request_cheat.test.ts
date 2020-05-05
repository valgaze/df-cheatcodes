/*
Tests inspired from:

* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts

* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts

*/

import * as test from "tape";
import { RequestCheat } from "./../src";

// let appRef: any;
const JSON_SAMPLE = { a: 1, b: 2, c: ["hi", "yay", "bonjour"] };
const PROTO_SAMPLE = {
  fields: {
    a: { kind: "numberValue", numberValue: 1 },
    b: { kind: "numberValue", numberValue: 2 },
    c: {
      kind: "listValue",
      listValue: {
        values: [
          { kind: "stringValue", stringValue: "hi" },
          { kind: "stringValue", stringValue: "yay" },
          { kind: "stringValue", stringValue: "bonjour" },
        ],
      },
    },
  },
};
let requester: any;

test("setup", function (t) {
  const session = RequestCheat.buildSession("123456", "bingo-project");
  const backend = "http://localhost:8000/chat";
  const languageCode = "en_US"; // (optonal), defauls to 'en_US'
  const transformGRPC = true; // (optional)
  const config = {
    session,
    languageCode,
    transformGRPC,
    backend,
  };
  requester = new RequestCheat(config);
  t.end();
});

/*
  buildRequest
  _json2proto
  _proto2json
  buildSession
  event
  */

/*
  await appRef.sendEvent(
    "Welcome",
    {},
    {
      requestData: [
        "This is ",
        "Request Data available on conv.getRequestData()",
      ],
    }
  );
*/
test("<(static) RequestCheat.buildRequest: simple txt>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  // 1 Simple text
  const sample = {
    queryInput: { text: { text: "hello world", languageCode: "en_US" } },
    session: "projects/bingo-project/agent/sessions/123456",
  };
  const expected = sample;
  const actual = RequestCheat.buildTxt(
    "hello world",
    "projects/bingo-project/agent/sessions/123456"
  );
  t.deepEqual(actual, expected);
});

test("<(static) RequestCheat.buildRequest: text with buildRequest>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  // 1 Simple text
  const sample = {
    queryInput: { text: { text: "hello world", languageCode: "en_US" } },
    session: "projects/bingo-project/agent/sessions/123456",
  };
  const expected = sample;
  const actual = RequestCheat.buildRequest({
    kind: "text",
    payload: { text: "hello world" },
    config: {
      session: "projects/bingo-project/agent/sessions/123456",
    },
  });
  t.deepEqual(actual, expected);
});

test("<(static) RequestCheat.buildRequest: text with buildRequest + request data>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  // 1 Simple text
  const sample = {
    queryInput: { text: { text: "hello world", languageCode: "en_US" } },
    queryParams: { payload: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] } },
    session: "projects/bingo-project/agent/sessions/123456",
  };
  const expected = sample;
  const actual = RequestCheat.buildRequest({
    kind: "text",
    payload: { text: "hello world" },
    requestData: JSON_SAMPLE,
    config: {
      session: "projects/bingo-project/agent/sessions/123456",
    },
  });
  t.deepEqual(actual, expected);
});

test("<(static) RequestCheat.buildRequest: text with buildRequest + request data, transformGRPC>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  // 1 Simple text
  const sample = {
    queryInput: { text: { text: "hello world", languageCode: "en_US" } },
    queryParams: {
      payload: {
        fields: {
          a: { kind: "numberValue", numberValue: 1 },
          b: { kind: "numberValue", numberValue: 2 },
          c: {
            kind: "listValue",
            listValue: {
              values: [
                { kind: "stringValue", stringValue: "hi" },
                { kind: "stringValue", stringValue: "yay" },
                { kind: "stringValue", stringValue: "bonjour" },
              ],
            },
          },
        },
      },
    },
    session: "projects/bingo-project/agent/sessions/123456",
  };
  const expected = sample;
  const actual = RequestCheat.buildRequest({
    kind: "text",
    payload: { text: "hello world" },
    requestData: JSON_SAMPLE,
    config: {
      transformGRPC: true,
      session: "projects/bingo-project/agent/sessions/123456",
    },
  });
  t.deepEqual(actual, expected);
});

test("<(static) RequestCheat.buildSessionId>", async (t: any) => {
  const expected = true;
  const actual = RequestCheat.buildSessionId();
  const valid = typeof actual === "string" && actual.length > 0;
  t.deepEqual(expected, valid);
});

test("<(static) RequestCheat.buildSession>", async (t: any) => {
  const expected = "projects/bingo-project/agent/sessions/123456";
  const actual = RequestCheat.buildSession("123456", "bingo-project");
  t.deepEqual(expected, actual);
});

test("<(static) RequestCheat._proto2json>", async (t: any) => {
  const expected = JSON_SAMPLE;
  const actual = RequestCheat._proto2json(PROTO_SAMPLE);
  t.deepEqual(expected, actual);
});

test("<(static) RequestCheat._json2proto>", async (t: any) => {
  const expected = PROTO_SAMPLE;
  const actual = RequestCheat._json2proto(JSON_SAMPLE);
  t.deepEqual(expected, actual);
});

test("<(static) RequestCheat.event>", async (t: any) => {
  const expected = {
    queryInput: {
      event: {
        name: "myevent",
        parameters: {
          fields: { xxx: { kind: "numberValue", numberValue: 12345 } },
        },
        languageCode: "en_US",
      },
    },
    queryParams: {
      payload: {
        fields: {
          a: { kind: "numberValue", numberValue: 1 },
          b: { kind: "numberValue", numberValue: 2 },
          c: {
            kind: "listValue",
            listValue: {
              values: [
                { kind: "stringValue", stringValue: "hi" },
                { kind: "stringValue", stringValue: "yay" },
                { kind: "stringValue", stringValue: "bonjour" },
              ],
            },
          },
        },
      },
    },
    session: "projects/bingo-project/agent/sessions/123456",
  };
  const actual = RequestCheat.event(
    "myevent",
    { xxx: 12345 }, // event parametres
    undefined,
    {
      a: 1,
      b: 2,
      c: ["hi", "yay", "bonjour"],
    }, // request data
    true, // transform
    "projects/bingo-project/agent/sessions/123456"
  );
  t.deepEqual(expected, actual);
});

test("<(non-static) constructRequest>", async (t: any) => {
  const expected = {
    queryInput: { text: { text: "Hello", languageCode: "en_US" } },
    session: "projects/bingo-project/agent/sessions/123456",
  };

  const input = {
    kind: "text",
    payload: { text: "Hello" },
    config: { session: "projects/bingo-project/agent/sessions/123456" },
  };
  const actual = requester.constructRequest(input);
  t.deepEqual(actual, expected);
});

test("<(non-static) constructRequest w/ requestData>", async (t: any) => {
  const expected = {
    queryInput: { text: { text: "Hello", languageCode: "en_US" } },
    queryParams: {
      payload: {
        fields: {
          a: { kind: "numberValue", numberValue: 1 },
          b: { kind: "numberValue", numberValue: 2 },
          c: { kind: "numberValue", numberValue: 3 },
        },
      },
    },
    session: "projects/bingo-project/agent/sessions/123456",
  };

  const input = {
    kind: "text",
    payload: { text: "Hello" },
    requestData: { a: 1, b: 2, c: 3 },
    config: { session: "projects/bingo-project/agent/sessions/123456" },
  };
  const actual = requester.constructRequest(input);
  t.deepEqual(actual, expected);
});

test("<(non-static) constructRequest event w/ requestData>", async (t: any) => {
  const expected = {
    queryInput: {
      event: {
        name: "my event",
        parameters: {
          fields: { xxx: { kind: "numberValue", numberValue: 12345 } },
        },
        languageCode: "en_US",
      },
    },
    queryParams: {
      payload: {
        fields: {
          a: { kind: "numberValue", numberValue: 1 },
          b: { kind: "numberValue", numberValue: 2 },
          c: {
            kind: "listValue",
            listValue: {
              values: [
                { kind: "stringValue", stringValue: "hi" },
                { kind: "stringValue", stringValue: "yay" },
                { kind: "stringValue", stringValue: "bonjour" },
              ],
            },
          },
        },
      },
    },
    session: "projects/bingo-project/agent/sessions/123456",
  };

  const input = {
    kind: "event",
    payload: {
      name: "my event",
      parameters: { xxx: 12345 }, // event parametres
    },
    requestData: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] },
    config: { session: "projects/bingo-project/agent/sessions/123456" },
  };
  const actual = requester.constructRequest(input);
  t.deepEqual(actual, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
