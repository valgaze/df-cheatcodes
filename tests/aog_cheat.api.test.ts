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

test("<conv.cheat.api/get/post: Retrieves data>", async (t: any) => {
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
            { simpleResponse: { textToSpeech: "Luke Skywalker" } },
            {
              simpleResponse: {
                textToSpeech:
                  "My dog used to chase people on a bike a lot. It got so bad I had to take his bike away.",
              },
            },
            {
              simpleResponse: {
                textToSpeech: '{"name":"Joe","job":"leader"}',
              },
            },
          ],
        },
      },
    },
  };

  app.intent("api_sample", async (conv: DFCheatConversation) => {
    const res = await conv.cheat.get("https://swapi.py4e.com/api/people/1");
    conv.ask(res.data.name);

    const config = {
      method: "get",
      headers: {
        Accept: "application/json",
        "User-Agent": "testing_sample",
      },
      url: "https://icanhazdadjoke.com/j/R7UfaahVfFd",
    };

    const theJoke = await conv.cheat.api(config);
    const { joke } = theJoke.data;
    conv.ask(joke);

    const newUser = await conv.cheat.post("https://reqres.in/api/users", {
      name: "Joe",
      job: "leader",
    });
    // TODO: make own endpoint & tear out volatile 3rd-party dep
    delete newUser.data.createdAt;
    delete newUser.data.id;

    conv.ask(JSON.stringify(newUser.data));
  });

  const res = await transmit("api_sample");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});

test("<conv.cheat.post: transmits data>", async (t: any) => {
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
                textToSpeech: '{"a":1}',
              },
            },
          ],
        },
      },
    },
  };

  app.intent("api_sample", async (conv: DFCheatConversation) => {
    const post = await conv.cheat.post("https://postman-echo.com/post", {
      a: 1,
    });
    conv.ask(JSON.stringify(post.data.data));
  });

  const res = await transmit("api_sample");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
