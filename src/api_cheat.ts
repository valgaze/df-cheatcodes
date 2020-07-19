/*
Dream state:
    import {apiCheat} from 'df-cheatcodes'
    import credentials from './secrets/file.json'
    const config = {
    transformgrpc: true,
    optimizeResponse: true, // response.dfcheatfrontend
    }

    const inst = new apiCheat(credentials, config)
    app.post('/query', inst)
*/
const { SessionsClient } = require("dialogflow");
import get = require("lodash.get");
const _ = { get };

// transform gRPC, see here:
import { struct, JsonObject } from "pb-util";

import { SACredential } from "./index";
import { RequestCheat } from "df-cheatcodes-base";

export interface APICheatConfig {
  transformgrpc?: boolean; // JSON <> Protostruct (event parameters & request data), Protostruct <> JSON
  optimizeResponse?: boolean; // webhookPayload + fulfillmentMessages
  cors?: boolean; // defaults to true
}

// events, text, requestData
export interface dfCheatRequestBody {
  session?: string;
  queryParams?: object;
  queryInput?: object;
  outputAudioConfig?: object;
  outputAudioConfigMask?: string;
  inputAudio?: string;
  [key: string]: any;
}

/**
 *
 * ## API Cheat
 * ```ts
 * import { apiCheat, requestCheat } from 'df-cheatcodes'
 *
 *
 * import credentials from './service-account.json'
 * // All optional
 * const config = {
 *    transformgrpc: false, // convert JSON to protostruct for requestData, event parameters
 *    optimizeResponse: false // combine webhookPayload + fulfillmentMessages, other tidy up
 * }
 *
 * const cheat = new apiCheat(credentials, config)
 * async function main() {
 * const req = requestCheat.buildTxt('hello!') //  queryInput: { text: { text: "hello world", languageCode: "en_US" } }
 * const res = await cheat.detectIntent(req)
 *
 * }
 *
 * ```
 *
 * ## Endpoint/route middleware cheat (same config)
 *
 * ```ts
 *
 * import express from "express";
 * import {endPointCheat} from 'df-cheatcodes'
 * const app = express()
 *
 * import { project_id, client_email, private_key } from './service-account.json'
 * const credentials = { project_id, client_email, private_key }
 *
 * const config = {
 *    transformgrpc: false, // convert JSON to protostruct for requestData, event parameters
 *    optimizeResponse: false // combine webhookPayload + fulfillmentMessages, other tidy up
 * }
 *
 * app.post('/chat', endpointCheat(credentials, config))
 *
 * ```
 *
 */
export class APICheats {
  public credential: SACredential;
  public sessionClient: any; // TODO
  public project_id: string;
  public transformgrpc: boolean = false;
  public optimizeResponse: boolean;

  constructor(credentials: SACredential, config: APICheatConfig) {
    this.sessionClient = new SessionsClient({ credentials });
    const { transformgrpc, optimizeResponse } = config;
    this.transformgrpc = transformgrpc || false;
    this.optimizeResponse = optimizeResponse || false;
    this.project_id = credentials.project_id;
    /* 
    TODOs
      Session
        - Paths: sessionId <> sessionPath
      Contexts
        - CRUD, Get all
      Paths: contextId <> contextPath
    */
  }

  public buildSessionId() {
    return RequestCheat.buildSessionId();
  }

  _proto2json(payload: any) {
    return struct.decode(payload);
  }

  _json2proto(payload: JsonObject | any) {
    return struct.decode(payload);
  }

  /**
   * Detect Intent
   * Send a valid request, ideally with "body" property with a session attached
   *
   * Depending on how you configure API Cheat, this can automatically transform JSON <> ProtoStruct as needed
   * If you don't set transformgrpc your frontend needs to do this, which it can do using df-cheatcodes-base:
   * http://github.com/valgaze/df-cheatcodes-base
   *
   * Request structure: https://cloud.google.com/dialogflow/docs/reference/rest/v2/projects.agent.sessions/detectIntent
   * Response structure: https://cloud.google.com/dialogflow/docs/reference/rest/v2/DetectIntentResponse
   *
   *
   *
   */
  async detectIntent(requestBody: dfCheatRequestBody) {
    if (
      (!requestBody.body && !requestBody.session) ||
      (requestBody.body && !requestBody.body.session)
    ) {
      console.log(
        "Warning: Missing session. Context will be lost if session is not consistent"
      );
    }
    let sessionValue = _.get(requestBody, "session", this.buildSessionId());
    // Q: Should this be way more configurable from requests?
    // ie should a request be able to specify project, agent, etc?
    // For now, no see if it becomes important
    if (!sessionValue.includes("/projects")) {
      sessionValue = this.sessionClient.sessionPath(
        this.project_id,
        sessionValue
      );
      requestBody.session = sessionValue;
    }
    if (this.transformgrpc) {
      // requestData
      const reqData = _.get(requestBody, "queryParams.payload", false);
      if (reqData) {
        //@ts-ignore
        requestBody.queryParams.payload = this._json2proto(reqData);
      }

      // events
      const eventData = _.get(
        requestBody,
        "queryInput.event.parameters",
        false
      );
      if (eventData) {
        //@ts-ignore
        requestBody.queryInput.event.parameters = this._json2proto(reqData);
      }
    }
    let response = [];

    try {
      response = await this.sessionClient.detectIntent(requestBody);
    } catch (e) {
      console.log("<apiCheat.detectIntent>", e);
      if (e.details.includes("PEM routines:get_name:no")) {
        return {
          ERROR: {
            msg: `Your service account credentials on backend are likely invalid, see here for details: https://github.com/valgaze/df-starter-kit/blob/master/docs/service_account.md`,
            error: e,
          },
        };
      } else {
        return { "ERROR:": e };
      }
    }

    if (this.transformgrpc) {
      const webhookPayload = _.get(
        response[0],
        "queryResult.webhookPayload",
        false
      );
      if (webhookPayload && response[0] && response[0].queryResult) {
        response[0].queryResult = this._proto2json(webhookPayload);
      }
    }

    // if (this.optimizeResponse) {
    //   // TODO
    // }

    return response[0];
  }

  _optimizeResponse(res: any) {
    // no-op
    // TODO: transform gRPC/Protostruct <> JSON
    // TODO: filter empty string messages from fulfillmentMessages
    // TODO: filter any messages that dupe with fulfillmentText
    // TODO: combine fulfillmentMessages w/ webhookPayload
    // TODO: Attach to response under dfcheatresponse: allComponents[]
    return res;
  }
}

/**
 * @param credentials: project_id, client_email, private_key
 * @param config: APICheatConfig
 *
 * ```ts
 *
 * import express from "express";
 * import bodyParser from "body-parser";
 * import {endPointCheat} from 'df-cheatcodes'
 *
 * // Initialize simple server
 * const app = express()
 * app.use(bodyParser.json());
 *
 *
 * // Prep credentials + config
 * import { project_id, client_email, private_key } from './service-account.json'
 * const credentials = { project_id, client_email, private_key }
 *
 * const config = {
 *    transformgrpc: false, // convert JSON to protostruct for requestData, event parameters, protostruct to JSON for responses
 *    optimizeResponse: false // combine webhookPayload + fulfillmentMessages
 * }
 *
 * app.post('/chat', endpointCheat(credentials, config))
 *
 * ```
 *
 */
// Explore: maybe make transformation middleware?
// ex. app.post('/chat', middleware.transformgRPC(), endpointCheat(config, cred))
export const endpointCheat = (
  credentials: SACredential,
  config: APICheatConfig
) => {
  const inst = new APICheats(credentials, config);
  // TODO: req/res types, body-parser/no body-parser
  return async (req: any, res: any, next: any) => {
    let payload = req;
    if (req.body) {
      payload = req.body;
    }
    return res.status(200).send(await inst.detectIntent(payload));
  };
};

/**
 * @param credentials: project_id, client_email, private_key
 * @param config: APICheatConfig
 *
 * ```ts
 *
 * import {apiCheat} from 'df-cheatcodes'
 *
 * import { project_id, client_email, private_key } from './service-account.json'
 * const credentials = { project_id, client_email, private_key }
 *
 * // All optional, default to false
 * const config = {
 *    transformgrpc: false, // convert JSON to protostruct for requestData, event parameters
 * }
 *
 * const inst = apiCheat(credentials, config)
 *
 *
 *
 * ```
 *
 */
export const apiCheat = (
  credentials: SACredential,
  config: APICheatConfig
): APICheats => {
  // TODO: req/res types, body-parser/no body-parser
  return new APICheats(credentials, config);
};
