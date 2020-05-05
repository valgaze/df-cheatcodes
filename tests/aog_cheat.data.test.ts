/*
Tests inspired from:

* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts

* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts

*/

import * as test from "tape";
import { dialogflow } from "actions-on-google";
import { convCheat, DFCheatConversation } from "./../src";

import { send } from "./helper";
let app: any;
let transmit: any;

test("setup", function (t) {
  // @ts-ignore
  app = dialogflow().use(convCheat());
  transmit = send.bind(this, app);
  t.end();
});

/*
  getRequestData
  getData
  saveData


*/
test("<conv.cheat.getRequestdata: Send request data, retrieve with getRequestData>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech:
                  'Here is request data with getRequestData(): {"a":1,"b":2,"c":3}',
              },
            },
            {
              simpleResponse: {
                textToSpeech:
                  'Here is request data with conv.data {"a":1,"b":2,"c":3}',
              },
            },
          ],
        },
      },
    },
  };

  app.intent("data_sample", (conv: DFCheatConversation) => {
    const data = conv.cheat.getRequestData();
    conv.ask(
      `Here is request data with getRequestData(): ${JSON.stringify(data)}`
    );

    conv.ask(
      `Here is request data with conv.data ${JSON.stringify(conv.request)}`
    );
  });

  const requestData = { a: 1, b: 2, c: 3 };

  const res = await transmit("data_sample", { requestData });
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});

test("<conv.cheat.saveData/getData: Persist data, retrieve data>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            { simpleResponse: { textToSpeech: "setting data..." } },
            {
              simpleResponse: {
                textToSpeech:
                  'Data ta-da: {"timestamp":"1588535509116","codeword":"bongo"}',
              },
            },
            {
              simpleResponse: {
                textToSpeech: '2] Data ta-da: {"a":1,"b":2,"c":3}',
              },
            },
          ],
        },
      },
    },
    outputContexts: [
      {
        name:
          "projects/projectid1234/agent/sessions/123456789/contexts/_actions_on_google",
        lifespanCount: 99,
        parameters: {
          data:
            '{"__map":{"a":{"timestamp":"1588535509116","codeword":"bongo"},"b":{"a":1,"b":2,"c":3}}}',
        },
      },
    ],
  };

  app.intent("data_sample", (conv: DFCheatConversation) => {
    conv.ask("setting data...");
    const fakeTimestamp = () => "1588535509116";
    conv.cheat.saveData("a", { timestamp: fakeTimestamp(), codeword: "bongo" });
    conv.cheat.saveData("b", { a: 1, b: 2, c: 3 });
    conv.ask(`Data ta-da: ${JSON.stringify(conv.cheat.getData("a"))}`);
    conv.ask(`2] Data ta-da: ${JSON.stringify(conv.cheat.getData("b"))}`);
  });

  const requestData = { a: 1, b: 2, c: 3 };

  const res = await transmit("data_sample", { requestData });
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
