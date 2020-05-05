import get = require("lodash.get");
const _ = { get };
import { dflanguages } from "./index";
import { dfCheatRequestBody } from "./api_cheat";
import { struct, JsonObject } from "pb-util";

// export type reqKinds = "event" | "text";

export interface DFCheatRequestConfig {
  transformGRPC?: boolean; // Defaults TRUE
  languageCode?: dflanguages;
  session?: string;
  backend?: string;
}
export interface DFCheatRequestInput {
  // kind: reqKinds;
  kind: string; // text | event
  payload: any; // ex. text, event payload w/ JSON parameters, etc
  requestData?: any; // Data that goes up with the REQUEST. Available as const myData = conv.getRequestData()
  config?: DFCheatRequestConfig;
}

// TODO: Make this configurable or use fetch
import axios from "axios";

/**
 * TODO: dreamstate
 * // Easy requests
 * const evnt = RequestCheat.event('name').requestData({a:1, b:2}).session('abcdefgh')
 * const text = RequestCheat.text('password recovery').requestData({a:1, b:2})
 *
 */

/**
 *  RequestCheat: utility for
 *```ts
 *  import { RequestCheat } from 'df-cheatcodes'
 *
 *  async function main() {
 *    const session = RequestCheat.buildSession
 *    const backend = 'http://localhost:8000/chat'
 *    const languageCode = 'en_US' // (optonal), defauls to 'en_US'
 *    const transformGRPC = true // (optional)
 *    const config = {
 *      session,
 *      languageCode,
 *      transformGRPC,
 *      backend
 *    }
 *    const requester = new RequestCheat(config)
 *
 *
 *
 *    const res = await requester.send('hello!!')
 *    console.log("Result", JSON.stringify(res))
 *
 *    const welcomeEvent = await requester.sendEvent('Welcome', {}, {data: ['This is ', 'Request Data available on conv.getRequestData()']}
 *    console.log('welcomeEvent res', JSON.stringify(welcomeEvent))
 *  }
 *
 *    main()
 * ```
 */
export class RequestCheat {
  private axiosInst: any;
  public languageCode: string;
  public session: string;
  public transformGRPC: boolean;
  constructor(private config: DFCheatRequestConfig) {
    const defaults = {
      transformGRPC: true,
      languageCode: "en_US",
    };
    this.axiosInst = axios.create({
      baseURL: this.config.backend,
    });
    this.languageCode = this.config.languageCode
      ? this.config.languageCode
      : defaults.languageCode;
    this.session = this.config.session
      ? this.config.session
      : RequestCheat.buildSessionId();
    this.transformGRPC = this.config.transformGRPC
      ? this.config.transformGRPC
      : defaults.transformGRPC;
  }
  /**
   * dreamstate
   * // Easy requests
   * const evnt = RequestCheat.event('name').requestData({a:1, b:2}).session('abcdefgh')
   * const text = RequestCheat.text('password recovery').requestData({a:1, b:2})
   *
   */

  /**
   *
   * @param name: event name
   * @param parameters: optional data to attach to the EVENT as parameters. (Target intent MUST have these parameters preconfigured)
   * @param requestData: optional data to attach to the REQUEST, available on conv.cheat.getRequestData()
   */
  async sendEvent(
    name: string,
    parameters?: { [key: string]: any },
    requestData?: any
  ) {
    // Feed static build request w/ instance data
    const languageCode = this.languageCode;
    const session = this.session;
    const transformGRPC = this.transformGRPC;
    const payload = {
      kind: "event",
      payload: {
        name,
        parameters,
        languageCode,
      },
      requestData: {
        ...requestData,
      },
      config: {
        languageCode,
        session,
        transformGRPC,
      },
    };

    // @ts-ignore
    return await this.send(RequestCheat.buildRequest(payload));
  }

  /**
   * [Static] Return event paramete
   * ```ts
   * import {RequestCheat} from 'df-cheatcodes'
   *
   * RequestCheat.event('myevent', {a:1,a:b})
   * ```
   *
   * @param name Name of the event
   * @param parameters Parameters to send with the event
   * @param lang The language of this query.
   *
   */
  static event(
    name: string,
    parameters?: any,
    languageCode?: dflanguages,
    requestData?: object,
    transformGRPC?: boolean,
    session?: string
  ) {
    return RequestCheat.buildRequest({
      kind: "event",
      payload: {
        name,
        parameters,
        languageCode,
      },
      requestData,
      config: {
        transformGRPC,
        session,
      },
    });
  }

  /**
   * Generates new session ID
   */
  static buildSessionId(): string {
    return `${new Date().getTime()}-${String(Math.random()).slice(2)}`;
  }

  /**
   * ## BuildSession
   * Return fully qualified session string
   * ```ts
   * RequestCheat.buildSession(123456, 'bingo-project') // projects/bingo-project/agent/sessions/123456
   *```
   *
   * @param session: string, ex. 1234567890
   * @param project_id: string ex. bingo-project
   */
  static buildSession(session: string | number, project_id: string): string {
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
      session = RequestCheat.buildSessionId();
    }
    return RequestCheat.buildRequest({
      kind: "text",
      payload: { text },
      config: {
        session,
      },
    });
  }

  /**
   *
   * @param submission: DFCheatRequestInput
   *
   * Non-static version of buildRequest using global config for languageCode, Session, transformGRPC, etc
      *
   * ```ts
   * import {RequestCheat} from 'df-cheatcodes'
   * const session = RequestCheat.buildSessionId();
   * const backend = "http://localhost:8000/chat";
   * const languageCode = "en_US"; // (optonal), defauls to 'en_US'
   * const transformGRPC = true; // (optional)
   * const config = {
   *   session,
   *   languageCode,
   *   transformGRPC,
   *   backend,
   * }
   * const requester = new RequestCheat(config);
   * request.constructRequest({kind: 'text', payload: {text: 'Hello'}})
   * // { queryInput: { text: { text: 'Hello', languageCode: 'en_US' } } }
   *
   * 
   * RequestCheat.buildRequest({
   *  kind: "event",
   *  payload: {
   *    name: "my event",
   *    parameters: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] },
   *  },
   *  config: {
   *    transformGRPC: true,
   *  });
   * 
\  * // {"queryInput":{"event":{"name":"my event","parameters":{"fields":{"a":{"kind":"numberValue","numberValue":1},"b":{"kind":"numberValue","numberValue":2},"c":{"kind":"listValue","listValue":{"values":[{"kind":"stringValue","stringValue":"hi"},{"kind":"stringValue","stringValue":"yay"},{"kind":"stringValue","stringValue":"bonjour"}]}}}},"languageCode":"en_US"}}}
   *
   * ```

   *
   *
   */
  constructRequest(submission: DFCheatRequestInput) {
    const config = {
      transformGRPC: this.transformGRPC,
      session: this.session,
      languageCode: this.languageCode,
    };
    submission.config = submission.config
      ? Object.assign(config, submission.config)
      : config;
    return RequestCheat.buildRequest(submission);
  }
  /**
   * [static] buildRequest(submission: DFCheatRequestInput)
   * This will returned properly-formed HTTP requests
   * By default, will transform JSON to gRPC-compliant Protostrucgt
   *
   * ```ts
   * import {RequestCheat} from 'df-cheatcodes'
   *
   * RequestCheat.buildRequest({kind: 'text', payload: {text: 'Hello'}})
   * // { queryInput: { text: { text: 'Hello', languageCode: 'en_US' } } }
   *
   * 
   * RequestCheat.buildRequest({
   *  kind: "event",
   *  payload: {
   *    name: "my event",
   *    parameters: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] },
   *  },
   *  config: {
   *    transformGRPC: true,
   *  });
   * 
\  * // {"queryInput":{"event":{"name":"my event","parameters":{"fields":{"a":{"kind":"numberValue","numberValue":1},"b":{"kind":"numberValue","numberValue":2},"c":{"kind":"listValue","listValue":{"values":[{"kind":"stringValue","stringValue":"hi"},{"kind":"stringValue","stringValue":"yay"},{"kind":"stringValue","stringValue":"bonjour"}]}}}},"languageCode":"en_US"}}}
   *
   * ```
   *
   * Request: https://cloud.google.com/dialogflow/docs/reference/rest/v2/projects.agent.sessions/detectIntent#request-body
   * @param submission: DFCheatRequestInput
   */
  static buildRequest(submission: DFCheatRequestInput): dfCheatRequestBody {
    if (!submission) {
      return {};
    }

    const transformJSON = _.get(submission, "config.transformGRPC", false);

    if (!submission.kind) {
      throw new Error(
        `<RequestCheat:buildRequest ERROR>Missing essential item 'kind' on this submission: ${JSON.stringify(
          submission
        )} `
      );
    }

    // Start here
    const { kind } = submission;
    let request: dfCheatRequestBody = {};

    let languageCode = _.get(submission, "config.languageCode", false);
    if (!languageCode) {
      languageCode = "en_US";
    }

    if (kind === "text") {
      request = {
        queryInput: {
          text: {
            text: submission.payload.text,
            languageCode,
          },
        },
      };
    }

    if (kind === "event") {
      const { name, parameters, languageCode: lc } = submission.payload || {};
      request = {
        queryInput: {
          event: {
            name: name,
            parameters: parameters
              ? transformJSON
                ? RequestCheat._json2proto(parameters)
                : parameters
              : undefined,
            languageCode: lc ? lc : languageCode,
          },
        },
      };
    }
    // request data
    if (submission.requestData) {
      request.queryParams = {
        payload: submission.requestData
          ? transformJSON
            ? RequestCheat._json2proto(submission.requestData)
            : submission.requestData
          : undefined,
      };
    }

    // Presume session by now is fully qualified path
    // TODO: move to common
    if (submission.config && submission.config.session) {
      request.session = submission.config.session;
    } else {
      console.log(
        `<RequestCheat.buildRequest> Missing 'session' on submission, attaching placeholder. ${JSON.stringify(
          submission
        )}`
      );
    }
    return request;
  }

  async send(param: string | any) {
    let payload = param;
    if (typeof param === "string") {
      payload = RequestCheat.buildRequest({
        kind: "text",
        payload: {
          text: param,
        },
      });
    }

    // TODO: make this configurable

    const configuration = {
      method: "POST",
      data: payload,
    };
    const reply = await this.axiosInst(configuration).catch((e: any) =>
      console.log(`<RequestCheat.send>Catastrophic Error: ${e}`, e)
    );
    return reply.data || {};
  }
}

export const requestCheat = RequestCheat;
