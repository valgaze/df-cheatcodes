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

test("<conv.cheat.media: Renders spec>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            { simpleResponse: { textToSpeech: "Here's a rich media object" } },
            {
              mediaResponse: {
                mediaType: "AUDIO",
                mediaObjects: [
                  {
                    contentUrl:
                      "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
                    description: "A funky Jazz tune",
                    icon: {
                      url:
                        "http://storage.googleapis.com/automotive-media/album_art.jpg",
                      accessibilityText: "Media icon",
                    },
                    name: "Jazz in Paris",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  };

  app.intent("media_sample", (conv: DFCheatConversation) => {
    conv.ask(`Here's a rich media object`);
    conv.cheat.media({
      name: "Jazz in Paris",
      url: "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
      description: "A funky Jazz tune",
      icon: {
        url: "http://storage.googleapis.com/automotive-media/album_art.jpg",
        alt: "Media icon",
      },
    });
  });

  const res = await transmit("media_sample");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
