/*
Tests inspired from:

* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts

* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts

*/

import * as test from "tape";
import { dialogflow } from "actions-on-google";
import { convCheat, DFCheatConversation } from "./../src";

import { send, _ } from "./helper";
let app: any;
let transmit: any;

test("setup", function (t) {
  // @ts-ignore
  app = dialogflow().use(convCheat());
  transmit = send.bind(this, app);
  t.end();
});

test("<conv.pickRandom: Renders one>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            { simpleResponse: { textToSpeech: "Here's a random choice..." } },
            { simpleResponse: { textToSpeech: "Response1" } },
          ],
        },
      },
    },
  };

  app.intent("pick_random1", (conv: DFCheatConversation) => {
    conv.ask("Here's a random choice...");
    conv.cheat.pickRandom(["Response1"]);
  });

  const res = await transmit("pick_random1");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("<conv.pickRandom: Picks random response>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  // const sample = {
  //   payload: {
  //     google: {
  //       expectUserResponse: true,
  //       richResponse: {
  //         items: [
  //           { simpleResponse: { textToSpeech: "Here is a random choice..." } },
  //           { simpleResponse: { textToSpeech: "Response1" } },
  //         ],
  //       },
  //     },
  //   },
  // };

  const choices = ["Response1", "Response2"];

  app.intent("pick_random1", (conv: DFCheatConversation) => {
    conv.ask("Here is a random choice...");
    conv.cheat.pickRandom(["Response1"]);
  });

  const res = await transmit("pick_random1");
  const clean = JSON.parse(JSON.stringify(res.body));

  const items = _.get(clean, "payload.google.richResponse.items");

  let pass = false;
  items.forEach((item: any) => {
    const check = _.get(item, "simpleResponse.textToSpeech");
    if (choices.includes(check)) {
      pass = true;
    }
  });

  t.deepEqual(true, pass);
});

test("teardown", function (t: any) {
  // ...
  t.end();
});
