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

test("<conv.cheat.table: Renders spec>", async (t: any) => {
  // RES.webhookPayload.google.richResponse.items
  const sample = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: "Here's a table!",
              },
            },
            {
              tableCard: {
                rows: [
                  {
                    cells: [
                      {
                        text: "row 1 item 1",
                      },
                      {
                        text: "row 1 item 2",
                      },
                      {
                        text: "row 1 item 3",
                      },
                    ],
                    dividerAfter: true,
                  },
                  {
                    cells: [
                      {
                        text: "row 2 item 1",
                      },
                      {
                        text: "row 2 item 2",
                      },
                      {
                        text: "row 2 item 3",
                      },
                    ],
                    dividerAfter: true,
                  },
                ],
                columnProperties: [
                  {
                    header: "header 1",
                  },
                  {
                    header: "header 2",
                  },
                  {
                    header: "header 3",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  };

  app.intent("table_sample", (conv: DFCheatConversation) => {
    conv.ask("Here's a table!");
    conv.cheat.table({
      dividers: true,
      columns: ["header 1", "header 2", "header 3"],
      rows: [
        ["row 1 item 1", "row 1 item 2", "row 1 item 3"],
        ["row 2 item 1", "row 2 item 2", "row 2 item 3"],
      ],
    });
  });

  const res = await transmit("table_sample");
  const clean = JSON.parse(JSON.stringify(res.body));
  const expected = sample;

  t.deepEqual(clean, expected);
});

test("teardown", function (t) {
  // ...
  t.end();
});
