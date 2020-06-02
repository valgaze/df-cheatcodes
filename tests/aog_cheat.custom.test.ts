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
video
specific custom thing
iframer
mind-reader lol



*/

test("<conv.cheat.addCustom: Stows custom components on webhook payload>", async (t: any) => {
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
            { simpleResponse: { textToSpeech: "Look a custom component..." } },
            { bongo: { a: 1, b: 2, c: ["yay", "hi", "bonjour"] } },
            { bingo: { e: 3, f: 4 } },
          ],
        },
      },
    },
  };

  app.intent("custom_sample", (conv: DFCheatConversation) => {
    conv.ask("Look a custom component...");
    conv.cheat.addCustom("bongo", { a: 1, b: 2, c: ["yay", "hi", "bonjour"] });
    conv.cheat.addCustom("bingo", { e: 3, f: 4 });
  });

  const res = await transmit("custom_sample");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("<conv.cheat.addVideo: stashes video config on webhook payload>", async (t: any) => {
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
            { simpleResponse: { textToSpeech: "Look a custom component..." } },
            { bongo: { a: 1, b: 2, c: ["yay", "hi", "bonjour"] } },
            { bingo: { e: 3, f: 4 } },
            {
              dfcheatvideo: {
                url: "https://www.youtube.com/watch?v=bvf5DlhvJJE",
                title: "Conan & Jordan Schlansky’s Italian Road Trip",
                config: { autoplay: true },
              },
            },
            {
              dfcheatiframe: {
                url: "https://www.youtube.com/watch?v=6A8W77m-ZTw",
                config: { postMessaage: "message", width: "50%" },
              },
            },
          ],
        },
      },
    },
  };

  app.intent("custom_sample2", (conv: DFCheatConversation) => {
    conv.ask("Look a custom component...");
    conv.cheat.addCustom("bongo", { a: 1, b: 2, c: ["yay", "hi", "bonjour"] });
    conv.cheat.addCustom("bingo", { e: 3, f: 4 });
    conv.cheat.addVideo(
      "https://www.youtube.com/watch?v=bvf5DlhvJJE",
      "Conan & Jordan Schlansky’s Italian Road Trip",
      {
        autoplay: true,
      }
    );

    conv.cheat.addiFrame("https://www.youtube.com/watch?v=6A8W77m-ZTw", {
      postMessaage: "message",
      width: "50%",
    });
  });
  const res = await transmit("custom_sample2");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
