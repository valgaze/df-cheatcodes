import { struct, JsonObject } from "pb-util";
import get = require("lodash.get");
const _ = { get };
export class Common {
  constructor() {}

  /**
   * Generates new session ID
   *
   * ```ts
   * import {Common} from 'df-cheatcodes'
   *
   *
   * ```
   */
  static buildSessionId(): string {
    return `${new Date().getTime()}-${String(Math.random()).slice(2)}`;
  }

  /**
   *
   * ```ts
   * RequestCheat.buildSession(123456, 'bingo-project') // projects/bingo-project/agent/sessions/123456
   *```
   *
   * @param session: string, ex. 1234567890
   * @param project_id: string ex. bingo-project
   */
  static buildSession(session: string | number, project_id: string): string {
    if (!project_id) {
      throw new Error(`Missing paramter 'project_id'`);
    }
    return `projects/${project_id}/agent/sessions/${session}`;
  }

  static _proto2json(payload: any) {
    return struct.decode(payload);
  }

  static _json2proto(payload: JsonObject | any) {
    return struct.encode(payload);
  }

  /**
   * [static] buildTxt(text:string)
   * ```ts
   * import {requestCheat} from 'df-cheatcodes'
   * const req = requestCheat.buildTxt('hello')
   * // queryInput: { text: { text: "hello world", languageCode: "en_US" } }
   * ```
   *
   */
  static buildTxt(text: string, session?: string) {
    if (!session) {
      session = Common.buildSessionId();
    }

    return {
      queryInput: { text: { text: "hello world", languageCode: "en_US" } },
      session,
    };
  }
}

/**
 * WIP: Middle POC
 * WARNING: NOT TESTED
 *
 * Idea: (somewhat) intelligently figure out if data needs Struct <> JSON transformation, get if off the plate
 * Maybe also: worry about sessions, follow up liason work w/ webhoook (contexts/events)
 *
 * ```
 * import express from "express";
 * import {middlewareCheat, apiCheat} from 'df-cheatcodes'
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
 * app.post('/chat', middlewareCheat, apiCheat(credentials, config))
 * ```
 */
export const middlewareCheat = (req: any, res: any, next: any) => {
  const root_req = req.body ? req.body : req;
  const isProbablyProtoStruct = (obj: any) =>
    Boolean(_.get(obj, "fields", false));

  const eventData = _.get(root_req, "queryInput.event.parameters", false);
  const requestData = _.get(root_req, "queryParams.payload", false);
  if (eventData && isProbablyProtoStruct(eventData)) {
    root_req.queryInput.event.parameters = Common._json2proto(eventData);
  }

  if (requestData && isProbablyProtoStruct(requestData)) {
    root_req.queryInput.queryParams.payload = Common._json2proto(requestData);
  }
  next();
};
