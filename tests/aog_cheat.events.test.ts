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

test("<conv.cheat.triggerEvent: Triggers an event from intent handler, discards responses>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    followupEventInput: { name: "my event", parameters: { a: 1, b: 2 } },
  };

  app.intent("event_sample", (conv: DFCheatConversation) => {
    conv.ask("We're about to lose all responses");
    conv.cheat.triggerEvent("my event", { a: 1, b: 2 });
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
