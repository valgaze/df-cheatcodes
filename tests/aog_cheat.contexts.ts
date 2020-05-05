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
addContext
getContextData
removeContext

*/
test("<conv.cheat.addContext/removeContext/getContextData: Sets, removes, retrieve contexts & data>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            { simpleResponse: { textToSpeech: "Setting contexts" } },
            {
              simpleResponse: {
                textToSpeech: "Here's the context data: undefined",
              },
            },
          ],
        },
      },
    },
    outputContexts: [
      {
        name:
          "projects/projectid1234/agent/sessions/123456789/contexts/myContext1",
        lifespanCount: 3,
        parameters: { a: 1, b: 2, c: 3 },
      },
      {
        name:
          "projects/projectid1234/agent/sessions/123456789/contexts/myContext2",
        lifespanCount: 0,
      },
    ],
  };

  app.intent("event_sample", (conv: DFCheatConversation) => {
    conv.ask("Setting contexts");
    conv.cheat.addContext("myContext1", 3, { a: 1, b: 2, c: 3 });

    const data = conv.cheat.getContextData("myContext1");
    conv.ask(`Here's the context data: ${JSON.stringify(data)}`);

    conv.cheat.addContext("myContext2", 2, { a: 1, b: 2, c: 3 });
    conv.cheat.removeContext("myContext2");
  });

  const res = await transmit("event_sample");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
