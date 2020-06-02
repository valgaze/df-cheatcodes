/*
Tests inspired from:

* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts

* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts

*/
import * as test from "tape";
import { dialogflow } from "actions-on-google";
import { convCheat, DFCheatConversation } from "./../src";
console.log("#");
import { send, _ } from "./helper";
let app: any;
let transmit: any;

test("setup", function (t) {
  // @ts-ignore
  app = dialogflow().use(convCheat());
  transmit = send.bind(this, app);
  t.end();
});

// test cases, eempty string

test("<conv.template: Renders one>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    outputContexts: [
      {
        name:
          "projects/projectid1234/agent/sessions/123456789/contexts/_actions_on_google",
        lifespanCount: 99,
        parameters: { data: '{"__map":{"various":[]}}' },
      },
    ],
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech:
                  "Did you know it's been 123456789 since 1970, Joe? Crazy right? Anyway here's your mint ice cream",
              },
            },
          ],
        },
      },
    },
  };

  app.intent("pick_random1", (conv: DFCheatConversation) => {
    const elapsedTime = 123456789;
    const phrases = [
      `Did you know it's been ${elapsedTime} since 1970, $[name]? Crazy right? Anyway here's your $[flavor] ice cream`,
    ];

    conv.cheat.template(phrases, {
      name: "Joe",
      flavor: "mint",
    });
  });

  const res = await transmit("pick_random1");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("<conv.template: Picks random response>", async (t: any) => {
  const choices = ["Response1 $[name]", "Response2 $[flavor]"];
  const template = { name: "Joe", flavor: "mint" };
  const renderedChoices = [`Response1 Joe`, `Response2 mint`];
  app.intent("pick_random1", (conv: DFCheatConversation) => {
    conv.ask("Here is a random choice...");
    conv.cheat.template(choices, template);
  });

  const res = await transmit("pick_random1");
  const clean = JSON.parse(JSON.stringify(res.body));
  const items = _.get(clean, "payload.google.richResponse.items");

  let pass = false;
  items.forEach((item: any) => {
    const check = _.get(item, "simpleResponse.textToSpeech");
    if (renderedChoices.includes(check)) {
      pass = true;
    }
  });

  t.deepEqual(true, pass);
});

test("teardown", function (t: any) {
  // ...
  t.end();
});
