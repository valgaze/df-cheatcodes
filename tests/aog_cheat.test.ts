/*
Tests inspired from:

* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts

* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts

*/

import { Button, Image, BasicCard, dialogflow } from "actions-on-google";
import * as test from "tape";
import { send } from "./helper";

import { convCheat } from "./../src";

// type
import { DFCheatConversation } from "./../src";
let app: any;
let transmit: any;

test("setup", function (t) {
  app = dialogflow().use(convCheat());
  transmit = send.bind(this, app);
  t.end();
});

test("<conv.addVideo: renders video spec>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = [
    {
      simpleResponse: {
        textToSpeech: "Here is a video...",
      },
    },
    {
      dfcheatvideo: {
        url: "https://www.youtube.com/watch?v=6A8W77m-ZTw",
        title:
          "2013: Conan Busts Jordan Schlansky & His Elitist Espresso Machine - CONAN on TBS",
      },
    },
  ];
  app.intent("video.test", (conv: DFCheatConversation) => {
    conv.ask("Here is a video...");
    conv.cheat.addVideo(
      "https://www.youtube.com/watch?v=6A8W77m-ZTw",
      "2013: Conan Busts Jordan Schlansky & His Elitist Espresso Machine - CONAN on TBS"
    );
  });

  const res = await transmit("video.test");
  const { items } = res.body.payload.google.richResponse;

  const clean = JSON.parse(JSON.stringify(items));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("<conv.addiFrame: renders spec>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = [
    {
      simpleResponse: {
        textToSpeech: "Here is a video...",
      },
    },
    {
      dfcheatiframe: {
        url: "https://benmarshall.me/responsive-iframes/",
      },
    },
  ];
  app.intent("iframe.test", (conv: DFCheatConversation) => {
    conv.ask("Here is a video...");
    conv.cheat.addiFrame("https://benmarshall.me/responsive-iframes/");
  });

  const res = await transmit("iframe.test");
  const { items } = res.body.payload.google.richResponse;

  const clean = JSON.parse(JSON.stringify(items));
  const expected = sample;

  // @ts-ignore
  t.deepEqual(clean, expected);
});

test("Usual syntax of BasicCard still works", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = [
    { simpleResponse: { textToSpeech: "Heres a card..." } },
    {
      basicCard: {
        title: "Here's your large mint",
        subtitle: "Here's your subtitle",
        formattedText:
          "Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.",
        image: {
          url: "https://i.imgur.com/W9Eeuu1.jpg",
          accessibilityText: "Mint!",
        },
        buttons: [
          {
            title: "Learn more about mint ice cream",
            openUrlAction: {
              url:
                "http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream",
            },
          },
        ],
      },
    },
  ];

  app.intent("card_simple", (conv: DFCheatConversation) => {
    conv.add("Heres a card..."); // Need a simple response
    conv.ask(
      new BasicCard({
        text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
        subtitle: "Here's your subtitle",
        title: `Here's your large mint`,
        buttons: [
          new Button({
            title: `Learn more about mint ice cream`,
            url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
          }),
        ],
        image: new Image({
          url: "https://i.imgur.com/W9Eeuu1.jpg",
          alt: "Mint!",
        }),
      })
    );
  });

  const res = await transmit("card_simple");
  const { items } = res.body.payload.google.richResponse;
  const clean = JSON.parse(JSON.stringify(items));
  const expected = sample;

  // @ts-ignore
  t.deepEqual(clean, expected);
});

// Test: card using image & button as singles and arrays
// Test; card using constructor

// test('setup', function (t) {
//     // ...
//     t.end();
//   });

//   // tests go here

//   test('teardown', function (t) {
//     // ...
//     t.end();
//   });

/*

test.serial('Sanity test', async t => {
    const app = dialogflow()
    // Could also send request to AoG, fallback is fastest way
    app.fallback((conv) => {
      conv.ask('Alllo World!')     
      const a = 1
      const b = 1
      t.deepEqual(a, b)
    })
    t.pass(await app({}, {}))
  })

*/
