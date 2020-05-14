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

test("<conv.cheat.carousel: Renders spec>", async (t: any) => {
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
                textToSpeech: "Which of these looks good?",
              },
            },
            {
              carouselSelect: {
                items: [
                  {
                    optionInfo: {
                      key: "key1",
                      synonyms: [
                        "synonym of KEY_ONE 1",
                        "synonym of KEY_ONE 2",
                      ],
                    },
                    description: "Description of number one",
                    image: {
                      url: "https://i.imgur.com/uMtF8ah.jpg",
                      accessibilityText: "chocolate ice cream",
                    },
                    title: "Chocolate ice cream",
                  },
                  {
                    optionInfo: {
                      key: "key2",
                      synonyms: [
                        "synonym of KEY_TWO 1",
                        "synonym of KEY_TWO 2",
                      ],
                    },
                    description: "Description of number one",
                    image: {
                      url: "https://i.imgur.com/W9Eeuu1.jpg",
                      accessibilityText: "mint ice cream",
                    },
                    title: "Number two",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  };
  app.intent("carousel", (conv: DFCheatConversation) => {
    conv.ask("Which of these looks good?");
    conv.cheat.carousel({
      items: {
        key1: {
          title: "Chocolate ice cream",
          description: "Description of number one",
          synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
          image: {
            url: "https://i.imgur.com/uMtF8ah.jpg",
            alt: "chocolate ice cream",
          },
        },
        key2: {
          title: "Number two",
          description: "Description of number one",
          synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
          image: {
            url: "https://i.imgur.com/W9Eeuu1.jpg",
            alt: "mint ice cream",
          },
        },
      },
    });
  });

  const res = await transmit("carousel");
  const actual = JSON.parse(JSON.stringify(res.body)); // res.body.payload.google etc etc
  const expected = sample;
  // @ts-ignore
  t.deepEqual(actual, expected);
});

test("teardown", function (t) {
  t.end();
});
