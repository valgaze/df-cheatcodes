/*
Tests inspired from:
* AoG: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/dialogflow/_test/conv.test.ts
* Nick Fleker's [@Fleker] Session Entities Plugin: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/blob/master/test/plugin.test.ts
*/

/*
TODO: the easy way w/ protos
ex. https://github.com/googleapis/nodejs-dialogflow/blob/de9e8f6bf4cf3c3a3d8b7ca27385e6c2f39afa3b/test/gapic_sessions_v2.ts#L150
   const client = new sessionsModule.v2.SessionsClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.cloud.dialogflow.v2.DetectIntentRequest()
      );
      request.session = '';
      const expectedHeaderRequestParams = 'session=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
*/

import * as test from "tape";
import { project_id, client_email, private_key } from "./service-account.json";
const credentials = {
  project_id,
  client_email,
  private_key,
};

import { apiCheat, RequestCheat } from "./../src";

const session_id = "123456789";
const session = `projects/${project_id}/agent/sessions/${session_id}`;

//@ts-ignore
let apiRef: any;
// const JSON_SAMPLE = { a: 1, b: 2, c: ["hi", "yay", "bonjour"] };
// const PROTO_SAMPLE = {
//   fields: {
//     a: { kind: "numberValue", numberValue: 1 },
//     b: { kind: "numberValue", numberValue: 2 },
//     c: {
//       kind: "listValue",
//       listValue: {
//         values: [
//           { kind: "stringValue", stringValue: "hi" },
//           { kind: "stringValue", stringValue: "yay" },
//           { kind: "stringValue", stringValue: "bonjour" },
//         ],
//       },
//     },
//   },
// };

if (credentials.project_id === "placeholder") {
  console.log(
    `<WARNING> Placeholder credential used, aborting API_CHEAT tests...`
  );
} else {
  // let requester: any;

  test("setup", function (t) {
    const config = {
      transformRequests: false, // convert JSON to protostruct for requestData, event parameters
      transformResponse: false, // Protostrut to JSON
      optimizeResponse: false, // combine webhookPayload + fulfillmentMessages
    };
    apiRef = apiCheat(credentials, config);
    // const backend = "http://localhost:8000/chat";
    // const languageCode = "en_US"; // (optonal), defauls to 'en_US'
    // const transformGRPC = true; // (optional)
    // const config = {
    //   session,
    //   languageCode,
    //   transformGRPC,
    //   backend,
    // };
    // // requester = new RequestCheat(config);
    t.end();
  });

  test("<apiCheat.detectIntent>", async (t: any) => {
    const expected = true;
    const req = RequestCheat.buildTxt("hi", session);

    const actual = await apiRef.detectIntent(req);
    const valid = actual.queryResult.queryText == "hi";
    t.deepEqual(expected, valid);
  });

  test("<apiCheat.detectIntent>", async (t: any) => {
    const expected = true;
    const req = RequestCheat.buildRequest({
      kind: "text",
      payload: { text: "hi" },
      requestData: { a: 1, b: 2, c: 3 },
      config: {
        session,
      },
    });

    const actual = await apiRef.detectIntent(req);
    const valid = actual.queryResult.queryText == "hi";
    t.deepEqual(expected, valid);
  });

  // Other test for transform

  test("teardown", function (t) {
    // ...
    t.end();
  });
}
