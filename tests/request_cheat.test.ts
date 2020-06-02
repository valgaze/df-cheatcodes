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
test("<Alias: Simple text>", async (t: any) => {
  const text = `hi`;
  const actual = requester.text(text);
  const expected = {
    session: "projects/bingo-project/agent/sessions/123456",
    queryInput: { text: { text: "hi", languageCode: "en_US" } },
  };

  t.deepEqual(actual, expected);
});

test("<Alias: sendText w/ global session change>", async (t: any) => {
  const text = `hi`;
  const Tmpsession = "123456789";
  requester.updateSession(Tmpsession);

  const actual = await requester.sendText(text, null, { Tmpsession });
  const expected = Tmpsession;

  // For now, just want to test it sends and the specified
  // session is in the response
  t.deepEqual(JSON.parse(actual.config.data).session, expected);
  requester.updateSession(RequestCheat.buildSession("123456", "bingo-project"));
});

test("<Alias: sendText w/ flag session change>", async (t: any) => {
  const text = `hi`;
  const Tmpsession = "123456789";

  const actual = await requester.sendText(text, null, { session: Tmpsession });
  const expected = Tmpsession;

  // For now, just want to test it sends and the specified
  // session is in the response
  t.deepEqual(JSON.parse(actual.config.data).session, expected);
  requester.updateSession(RequestCheat.buildSession("123456", "bingo-project"));
});

test("<Alias: event>", async (t: any) => {
  requester.updateTransformgrpc(true);
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

  const eventName = `myevent`;
  const parameters = { xxx: 12345 };
  const requestData = {
    a: 1,
    b: 2,
    c: ["hi", "yay", "bonjour"],
  };

  const actual = requester.event(eventName, parameters, requestData);
  requester.updateTransformgrpc(false);
  t.deepEqual(expected, actual);
});

test("<Alias: sendEvent, global session change>", async (t: any) => {
  const Tmpsession = "123456789";
  requester.updateSession(Tmpsession);

  // For now, just want to test it sends and the specified
  // session is in the response
  // t.deepEqual(JSON.parse(actual.config.data).session, expected);

  const expected = Tmpsession;

  const eventName = `myevent`;
  const parameters = { xxx: 12345 };
  const requestData = {
    a: 1,
    b: 2,
    c: ["hi", "yay", "bonjour"],
  };

  const actual = await requester.sendEvent(eventName, parameters, requestData);

  requester.updateSession(RequestCheat.buildSession("123456", "bingo-project"));
  t.deepEqual(JSON.parse(actual.config.data).session, expected);
});

test("<Alias: sendEvent, global sessio change>", async (t: any) => {
  const Tmpsession = "123456789";

  // For now, just want to test it sends and the specified
  // session is in the response
  // t.deepEqual(JSON.parse(actual.config.data).session, expected);

  const expected = Tmpsession;

  const eventName = `myevent`;
  const parameters = { xxx: 12345 };
  const requestData = {
    a: 1,
    b: 2,
    c: ["hi", "yay", "bonjour"],
  };

  const actual = await requester.sendEvent(eventName, parameters, requestData, {
    session: Tmpsession,
  });

  t.deepEqual(JSON.parse(actual.config.data).session, expected);
});

test("<text with buildRequest>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  // 1 Simple text
  const expected = {
    queryInput: { text: { text: "hello world", languageCode: "en_US" } },
    session: "projects/bingo-project/agent/sessions/123456",
  };
  const actual = requester.buildRequest({
    kind: "text",
    content: "hello world",
    config: {
      session: "projects/bingo-project/agent/sessions/123456",
    },
  });
  t.deepEqual(actual, expected);
});

test("<text with buildRequest + request data>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  // 1 Simple text
  const sample = {
    queryInput: { text: { text: "hello world", languageCode: "en_US" } },
    queryParams: { payload: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] } },
    session: "projects/bingo-project/agent/sessions/123456",
  };
  const expected = sample;
  const actual = requester.buildRequest({
    kind: "text",
    content: "hello world",
    requestData: JSON_SAMPLE,
    config: {
      session: "projects/bingo-project/agent/sessions/123456",
    },
  });
  t.deepEqual(actual, expected);
});

test("<buildRequest: text with buildRequest + request data, transformGRPC>", async (t: any) => {
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
  const actual = requester.buildRequest({
    kind: "text",
    content: "hello world",
    requestData: JSON_SAMPLE,
    flags: {
      transformgrpc: true,
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

test("<(static) RequestCheat.__proto2json>", async (t: any) => {
  const expected = JSON_SAMPLE;
  const actual = RequestCheat.__proto2json(PROTO_SAMPLE);
  t.deepEqual(expected, actual);
});

test("<(static) RequestCheat.__json2proto>", async (t: any) => {
  const expected = PROTO_SAMPLE;
  const actual = RequestCheat.__json2proto(JSON_SAMPLE);
  t.deepEqual(expected, actual);
});

test("teardown", function (t) {
  // ...
  t.end();
});
