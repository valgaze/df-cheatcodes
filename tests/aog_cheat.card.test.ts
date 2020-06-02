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

/*
import { Button, Image, BasicCard } from "actions-on-google";

  conv.ask(
    new BasicCard({
      text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
      subtitle: "Here's your subtitle",
      title: `Here's your large mint`,
      buttons: new Button({
        title: `Learn more about mint ice cream`,
        url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
      }),
      image: new Image({
        url: "https://i.imgur.com/W9Eeuu1.jpg",
        alt: "Mint!",
      }),
    })
  );

*/

test("setup", function (t) {
  // @ts-ignore
  app = dialogflow().use(convCheat());
  transmit = send.bind(this, app);
  t.end();
});

test("<conv.cheat.card: Card w/ image & buttons w/o constructors render correctly>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = [
    { simpleResponse: { textToSpeech: "Heres a card..." } },
    {
      basicCard: {
        title: "Here's your large mint",
        subtitle: "Here's your large mint",
        formattedText:
          "Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.",

        buttons: [
          {
            title: "Learn more about mint ice cream",
            openUrlAction: {
              url:
                "http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream",
            },
          },
        ],
        image: {
          url: "https://i.imgur.com/W9Eeuu1.jpg",
          accessibilityText: "Mint!",
        },
      },
    },
  ];

  app.intent("card_simple", (conv: DFCheatConversation) => {
    conv.add("Heres a card..."); // Need a simple response
    conv.cheat.card({
      text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
      subtitle: "Here's your subtitle",
      title: `Here's your large mint`,
      buttons: [
        {
          title: `Learn more about mint ice cream`,
          url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
        },
      ],
      image: {
        url: "https://i.imgur.com/W9Eeuu1.jpg",
        alt: "Mint!",
      },
    });
  });

  const res = await transmit("card_simple");
  const { items } = res.body.payload.google.richResponse;
  const clean = JSON.parse(JSON.stringify(items));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
