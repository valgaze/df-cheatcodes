/*
Dream state:
    import {apiCheat} from 'df-cheatcodes'
    import credentials from './secrets/file.json'
    const config = {
    transformRequests: true,
    transformResponse: true,
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

export interface APICheatConfig {
  transformRequests?: boolean; // JSON to protostruct
  transformResponse?: boolean; // Protostrut to JSON
  optimizeResponse?: boolean; // webhookPayload + fulfillmentMessages
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
 *    transformRequests: false, // convert JSON to protostruct for requestData, event parameters
 *    transformResponse: false, // Protostrut to JSON
 *    optimizeResponse: false // combine webhookPayload + fulfillmentMessages
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
 * ## Endpoint/route
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
 *    transformRequests: false, // convret JSON to protostruct for requestData, event parameters
 *    transformResponse: false, // Protostrut to JSON
 *    optimizeResponse: false // combine webhookPayload + fulfillmentMessages
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

  public transformRequests: boolean;
  public transformResponse: boolean;
  public optimizeResponse: boolean;

  constructor(credentials: SACredential, config: APICheatConfig) {
    this.sessionClient = new SessionsClient({ credentials });
    const { transformRequests, transformResponse, optimizeResponse } = config;
    this.transformRequests = transformRequests || false;
    this.transformResponse = transformResponse || false;
    this.optimizeResponse = optimizeResponse || false;

    /* 
    TODOs
      Session
        - Paths: sessionId <> sessionPath
      Contexts
        - CRUD, Get all
      Paths: contextId <> contextPath
    */
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
   * Depending on how you configure API Cheat, this will automatically transform JSON <> ProtoStruct as needed
   *
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
      console.log("Warning: Missing session");
    }

    if (this.transformRequests) {
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
    const response = await this.sessionClient.detectIntent(requestBody);

    if (this.transformResponse) {
      const webhookPayload = _.get(response, "webhookPayload", false);
      if (webhookPayload) {
        response.webhookPayload = this._proto2json(webhookPayload);
      }
    }

    if (this.optimizeResponse) {
      // TODO
      // this._optimizeResponse(response[0]);
    }

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
 *    transformRequests: false, // convret JSON to protostruct for requestData, event parameters
 *    transformResponse: false, // Protostrut to JSON
 *    optimizeResponse: false // combine webhookPayload + fulfillmentMessages
 * }
 *
 * app.post('/chat', endpointCheat(credentials, config))
 *
 * ```
 *
 */
// Make this middleware?
// app.use(middleware.transformgRPC())
export const endpointCheat = (
  credentials: SACredential,
  config: APICheatConfig
) => {
  const inst = new APICheats(credentials, config);
  // TODO: req/res types, body-parser/no body-parser
  return async (req: any, res: any, next: any) => {
    if (req.body) {
      return inst.detectIntent(req.body);
    } else {
      return inst.detectIntent(req);
    }
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
 *    transformRequests: false, // convert JSON to protostruct for requestData, event parameters
 *    transformResponse: false, // Protostrut to JSON
 *    optimizeResponse: false // combine webhookPayload + fulfillmentMessages
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
