/*
Tests inspired from:

* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts

* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts

*/

import * as test from "tape";
import { dialogflow, Parameters } from "actions-on-google";
import { shortcutCheat, convCheat, DFCheatConversation } from "./../src";
let app: any;
let transmit: any;
const _send = async (
  app: any,
  intentName: string,
  queryText: string,
  {
    project = "projectid1234",
    session = "123456789",
    aogData = {}, // conv.data
    requestData = {}, // data that goes with the REQUEST
  } = {}
) => {
  const AOG_DATA = JSON.stringify(aogData);
  const aog = {
    name: `projects/${project}/agent/sessions/${session}/contexts/_actions_on_google`,
    lifespanCount: 99,
    parameters: { data: AOG_DATA },
  };
  const req = {
    queryResult: {
      queryText,
      intent: { displayName: intentName },
      outputContexts: [aog],
    },
    session: `projects/${project}/agent/sessions/${session}`,
    originalDetectIntentRequest: {
      payload: requestData,
    },
  };
  const res = await app(req, {}).catch((e: any) => console.log("#", e));
  return res;
};

/**
 * testcheat
 * testcheat param=abc
 * testcheatalias
 */

const shortcutMap = {
  testcheat: {
    description: `Test cheat here`,
    examples: [`$cheat testcheat`, `$cheat testcheat param=abc`],
    handler: (
      conv: DFCheatConversation,
      parameters: Parameters,
      args: any
    ) => {},
  },
};
const intentName = `__df_cheathandler`;
const rootConfig = {
  intentName,
  keyword: `$cheat`, //
  map: shortcutMap,
  commandOverride(candidate: string) {
    if (candidate === "testcheatalias") {
      return "testcheat";
    }
    return candidate;
  },
};

test("setup", function (t) {
  // @ts-ignore
  app = dialogflow().use(convCheat()).use(shortcutCheat(rootConfig));
  transmit = _send.bind(this, app);
  t.end();
});
/**
 const cheatString = `"$cheat biscotti"`;
  const cheatString2 = `$cheat biscotti`;
  "$cheat biscotti" 

 */

test("<ShortcutCheat setup>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: "Below is a listing of Shortcut Cheats",
              },
            },
            {
              simpleResponse: {
                textToSpeech:
                  "'Shortcut Cheats' are a simple way to QUICKLY hop around your conversational interface or expose rich functionality with copy-paste'able commands",
              },
            },
            { simpleResponse: { textToSpeech: "Handy cheat commands" } },
            {
              basicCard: {
                title: "testcheat",
                subtitle: "testcheat",
                formattedText:
                  "\n    ## testcheat\n    \n    *Test cheat here*\n\n\n    \n**Examples** \n\n    \n    \n* **$cheat testcheat**\n\n* **$cheat testcheat param=abc**",
                image: {},
                buttons: [],
              },
            },
            {
              basicCard: {
                title: null,
                subtitle: null,
                formattedText:
                  '### Try one of these out (just copy/paste or tap link)\n         \n  \n  * **<a href="/?triggermessage=%22$cheat biscotti%22" _target="blank">$cheat biscotti</a>**\n  \n  * **<a href="/?triggermessage=%22$cheat video url=https://www.youtube.com/watch?v=YKIjXoiubzc autoplay=yes%22" _target="blank">$cheat video url=https://www.youtube.com/watch?v=YKIjXoiubzc autoplay=yes</a>**\n  \n  * **<a href="/?triggermessage=%22$cheat graph" _target="blank">$cheat graph**\n                ',
                image: {},
                buttons: [],
              },
            },
          ],
        },
      },
    },
    outputContexts: [
      {
        name:
          "projects/projectid1234/agent/sessions/123456789/contexts/_actions_on_google",
        lifespanCount: 99,
        parameters: { data: '{"__map":{"various":[]}}' },
      },
    ],
  };
  const res = await transmit("__df_cheathandler", "$cheat help");
  const actual = JSON.parse(JSON.stringify(res.body)); // res.body.payload.google etc etc
  const expected = sample;
  t.deepEqual(actual, expected);
});

test("teardown", function (t) {
  t.end();
});
