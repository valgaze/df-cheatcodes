/*
Tests inspired from:

* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts

* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts

*/

import * as test from "tape";
import { dialogflow, List } from "actions-on-google";
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

test("<conv.cheat.list: Renders spec>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        systemIntent: {
          intent: "actions.intent.OPTION",
          data: {
            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
            listSelect: {
              items: [
                {
                  optionInfo: {
                    key: "key1",
                    synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
                  },
                  title: "Number one",
                },
                {
                  optionInfo: {
                    key: "key2",
                    synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
                  },
                  title: "Number two",
                },
              ],
            },
          },
        },
        richResponse: {
          items: [{ simpleResponse: { textToSpeech: "Hey look a list" } }],
        },
      },
    },
  };

  app.intent("list_sample", (conv: DFCheatConversation) => {
    conv.ask("Hey look a list");
    conv.cheat.list({
      items: {
        key1: {
          title: "Number one",
          synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
        },
        key2: {
          title: "Number two",
          synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
        },
      },
    });
  });

  const res = await transmit("list_sample");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("<conv.cheat.list: Renders spec with constructor>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        systemIntent: {
          intent: "actions.intent.OPTION",
          data: {
            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
            listSelect: {
              items: [
                {
                  optionInfo: {
                    key: "key1",
                    synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
                  },
                  title: "Number one",
                },
                {
                  optionInfo: {
                    key: "key2",
                    synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
                  },
                  title: "Number two",
                },
              ],
            },
          },
        },
        richResponse: {
          items: [{ simpleResponse: { textToSpeech: "Hey look a list" } }],
        },
      },
    },
  };

  app.intent("list_sample2", (conv: DFCheatConversation) => {
    conv.ask("Hey look a list");
    conv.ask(
      new List({
        items: {
          key1: {
            title: "Number one",
            synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
          },
          key2: {
            title: "Number two",
            synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
          },
        },
      })
    );
  });

  const res = await transmit("list_sample2");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
