/*
Tests inspired from:

* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts

* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts

*/

import * as test from "tape";
import { dialogflow } from "actions-on-google";
import { convCheat, DFCheatConversation } from "./../src";

import { BrowseCarousel, BrowseCarouselItem, Image } from "actions-on-google";

import { send } from "./helper";
let app: any;
let transmit: any;

test("setup", function (t) {
  // @ts-ignore
  app = dialogflow().use(convCheat());
  transmit = send.bind(this, app);
  t.end();
});

test("<conv.cheat.browsecarousel: Renders spec>", async (t: any) => {
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
            { simpleResponse: { textToSpeech: "Here's a browse carousel" } },
            {
              carouselBrowse: {
                items: [
                  {
                    title: "Title of item 1",
                    openUrlAction: { url: "https://example.com" },
                    description: "Description of item 1",
                    footer: "Item 1 footer",
                    image: {
                      url:
                        "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                      accessibilityText: "Image alternate text",
                    },
                  },
                  {
                    title: "Title of item 2",
                    openUrlAction: { url: "https://example.com" },
                    description: "Description of item 2",
                    footer: "Item 2 footer",
                    image: {
                      url:
                        "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                      accessibilityText: "Image alternate text",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  };

  app.intent("browse_carousel", (conv: DFCheatConversation) => {
    conv.ask(`Here's a browse carousel`);
    conv.cheat.browseCarousel({
      items: [
        {
          title: "Title of item 1",
          url: "https://example.com",
          description: "Description of item 1",
          image: {
            url:
              "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
            alt: "Image alternate text",
          },
          footer: "Item 1 footer",
        },
        {
          title: "Title of item 2",
          url: "https://example.com",
          description: "Description of item 2",
          image: {
            url:
              "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
            alt: "Image alternate text",
          },
          footer: "Item 2 footer",
        },
      ],
    });
  });

  const res = await transmit("browse_carousel");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("<conv.cheat.browsecarousel: Renders spec w/ constructors>", async (t: any) => {
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
            { simpleResponse: { textToSpeech: "Here's a browse carousel" } },
            {
              carouselBrowse: {
                items: [
                  {
                    title: "Title of item 1",
                    openUrlAction: { url: "https://example.com" },
                    description: "Description of item 1",
                    footer: "Item 1 footer",
                    image: {
                      url:
                        "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                      accessibilityText: "Image alternate text",
                    },
                  },
                  {
                    title: "Title of item 2",
                    openUrlAction: { url: "https://example.com" },
                    description: "Description of item 2",
                    footer: "Item 2 footer",
                    image: {
                      url:
                        "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                      accessibilityText: "Image alternate text",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  };

  app.intent("browse_carousel", (conv: DFCheatConversation) => {
    conv.ask(`Here's a browse carousel`);

    conv.ask(
      new BrowseCarousel({
        items: [
          new BrowseCarouselItem({
            title: "Title of item 1",
            url: "https://example.com",
            description: "Description of item 1",
            image: new Image({
              url:
                "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
              alt: "Image alternate text",
            }),
            footer: "Item 1 footer",
          }),
          new BrowseCarouselItem({
            title: "Title of item 2",
            url: "https://example.com",
            description: "Description of item 2",
            image: new Image({
              url:
                "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
              alt: "Image alternate text",
            }),
            footer: "Item 2 footer",
          }),
        ],
      })
    );
  });

  const res = await transmit("browse_carousel");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
