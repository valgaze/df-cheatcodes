import {
  Plugin,
  DialogflowApp,
  Contexts,
  DialogflowConversation,
  Parameters,
} from "actions-on-google";

import { DFCheatConversation } from "./aog_cheats";

export interface DFShortcutConfig {
  hidden?: boolean;
  description?: string;
  examples?: string[];
  handler(
    conv: DFCheatConversation | DialogflowConversation,
    parameters?: Parameters,
    args?: string
  ): void;
}

export interface DFShortcutMap {
  [key: string]: DFShortcutConfig; // Defaults available for fallback, & help
}

export interface DFShortcutRootConfig {
  keyword?: string; // Defaults to $cheat
  map: DFShortcutMap;
  commandOverride(candidate: string): string;
  intentName?: string | undefined; // Intent name has default fallback
}

export interface Cheatcut {
  command: string;
  args: string[];
}
// Won't export this, just constructor
class ShortcutCheat {
  public config: DFShortcutRootConfig;
  public $: any;

  constructor(config: DFShortcutRootConfig) {
    this.config = config;
    this._lowerCaseMapKeys();
    this._setDefaults();
    // pre-compute tedious stuff
  }

  _lowerCaseMapKeys() {
    // @some's (https://stackoverflow.com/users/36866/some) techniquye
    // https://stackoverflow.com/a/12540603
    if (this.config.map) {
      let key;
      const keys = Object.keys(this.config.map);
      let n = keys.length;
      const newMap = {};
      while (n--) {
        key = keys[n];
        //@ts-ignore
        newMap[key.toLowerCase()] = this.config.map[key];
      }
      this.config.map = newMap;
    }
  }

  // TODO: tidyup
  parseCheat(cheat: string = "", query?: string): Cheatcut {
    const { keyword } = this.config;
    //@ts-ignore
    if (cheat.includes(keyword)) {
      //@ts-ignore[]
      const cheatRoot = cheat.split(keyword)[1].split(" ").slice(1);
      let [command, ...args] = cheatRoot;

      const { commandOverride } = this.config;
      if (
        typeof command == "string" &&
        commandOverride &&
        typeof commandOverride === "function"
      ) {
        const res = commandOverride(command.toLowerCase());
        if (typeof res === "string" && this.config.map[res] !== undefined) {
          command = res;
        }
      }

      return {
        command,
        args,
      };
    } else {
      return {
        command: "fallback",
        args: [cheat],
      };
    }
  }

  public parseArgs(args: string[] = []) {
    const result = {};
    args.forEach((arg) => {
      if (arg.includes("=")) {
        // handle nightmare case, ex url=https://www.youtube.com/watch?v=Hz3lG2D6o2A
        const separator = arg.match(/=/gi) || [];
        let [prop, val] = arg.split("=");
        if (separator.length > 1) {
          const tmpVal = arg.match(/^[^=]+=\s*(.*)$/);
          if (tmpVal) {
            val = tmpVal[1];
          }
        }
        if (prop && (Number(val) === 0 || Boolean(val))) {
          //@ts-ignore
          result[prop] = val;
        }
      }
    });
    return result;
  }

  public run(
    conv: DFCheatConversation | DialogflowConversation,
    parameters: any,
    command: string,
    args: string[] = [],
    query?: string
  ) {
    // ex. detect if they want to fire an evenet
    const rooty = this.config.map[command];
    if (rooty) {
      const { handler } = rooty;
      if (handler && typeof handler === "function") {
        //@ts-ignore
        handler(conv, parameters, this.parseArgs(args));
      }
    } else {
      let key = "fallback";
      if (command === "help") {
        key = "help";
      }
      let fallback = this.config.map[key];
      if (!fallback) {
        fallback = this.config.map[`_${key}`];
      }
      const { handler } = fallback;
      if (handler && typeof handler === "function") {
        handler(conv, parameters, query);
      }
    }
  }

  public check(item: string, matches: string[]) {
    // todo: better way to do this
    const normalized = item.toLowerCase() || "";
    let result: boolean | string = false;
    matches.forEach((candidate) => {
      if (typeof candidate === "string") {
        result = normalized === candidate;
      }
      if (typeof candidate === "function") {
        //@ts-ignore
        result = candidate(normalized);
      }
    });
    return result;
  }

  /**
   * (Utility) Trim leading/ending quotes from string
   * @param cheat: string "$cheat biscotti"
   * ```ts
   * const cheat = `
   * conv.ask("Here's some tabular data...")
   * const cheatString = `"$cheat biscotti"
   * const trimmed = conv.cheat.trim(cheatString)
   * // $cheat biscotti
   *
   * ```
   */
  public trimCheat(cheat: string) {
    let res = cheat;
    if (cheat.charAt(0) === `"` && cheat.charAt(cheat.length - 1) === `"`) {
      res = res.slice(1);
      res = res.substring(0, res.length - 1);
    }
    return res;
  }

  _setDefaults() {
    const defaults = {
      keyword: `$cheat`,
      map: {
        _echo: {
          hidden: true,
          description: `[Utility]: echo back any parameters`,
          examples: [`$cheat _echo song=abc prop1=val1 prop2=val2 prop3=val3`],
          handler: (
            conv: DFCheatConversation,
            parameters: Parameters,
            args: any
          ) => {
            conv.add(`${JSON.stringify(args)}`);
          },
        },
        _help: {
          // if no help specified
          // use internal fallback
          hidden: true,
          handler: (conv: DFCheatConversation, parameters: Parameters) => {
            conv.add(`Below is a listing of Shortcut Cheats`);
            conv.add(
              `'Shortcut Cheats' are a simple way to QUICKLY hop around your conversational interface or expose rich functionality with copy-paste'able commands`
            );
            if (this.config.map) {
              conv.add(`Handy cheat commands`);
              // const result: string[] = [];
              for (let handlerLabel in this.config.map) {
                const item = this.config.map[handlerLabel];
                if (!item.hidden) {
                  const core = this.config.map[handlerLabel];
                  const { description, examples } = core;

                  const text = `
    ## ${handlerLabel}
    
    *${description}*


    ${examples && examples.length ? "\n**Examples** " : ""}

    
    ${
      examples && examples.length
        ? examples
            .map((example) => {
              return `\n* **${example}**`;
            })
            .join("\n")
        : ""
    }`;
                  if (conv.cheat) {
                    conv.cheat.card({
                      text: text,
                      title: handlerLabel,
                    });
                  } else {
                    conv.add(handlerLabel);
                    if (description) {
                      conv.add(`'${description}'`);
                    }
                    if (examples && examples.length) {
                      examples.forEach((example, idx) => {
                        conv.add(`Ex. ${idx + 1}: ${example}`);
                      });
                    }
                  }
                }
              }
              conv.cheat.card({
                text: `### Try one of these out (just copy/paste or tap link)
         
  
  * **<a href="/?triggermessage=%22$cheat biscotti%22" _target="blank">$cheat biscotti</a>**
  
  * **<a href="/?triggermessage=%22$cheat video url=https://www.youtube.com/watch?v=YKIjXoiubzc autoplay=yes%22" _target="blank">$cheat video url=https://www.youtube.com/watch?v=YKIjXoiubzc autoplay=yes</a>**
  
  * **<a href="/?triggermessage=%22$cheat graph" _target="blank">$cheat graph**
                `,
              });
            }
          },
        },
        _fallback: {
          // if no fallback specified by user
          // use internal fallback
          hidden: true,
          handler(
            conv: DFCheatConversation,
            parameters: Parameters,
            query: string
          ) {
            conv.add(
              `Whoops, seems like there was an problem with that cheat ${query}`
            );
            conv.add(`${query}`);

            if (query && query.length) {
              conv.add(`${query}`);
            }
          },
        },
      },
    };
    // TODO: clean up
    for (let item in defaults) {
      //@ts-ignore
      if (this.config[item] === undefined) {
        //@ts-ignore
        const val = defaults[item];
        //@ts-ignore
        this.config[item] = val;
      }
      this.config.map = Object.assign(this.config.map, defaults.map);
    }
  }
}

/**
 * ## shortCutCheat
 * Will configure a 'shortcut' commands
 * You will need a single intent (defaults to __df_cheathandler) that
 * is trained on your activaton defulat (defaults to $cheat)
 *
 *  * ex.
 * - $cheat video url=https://www.youtube.com/watch?v=YKIjXoiubzc autoplay=yes
 * - $cheat graph
 * - $cheat biscotti
 *
 * ------
 *
 * ```ts
 *
 * import { dialogflow } from "actions-on-google";
 * import { shortcutCheat, convCheat } from "df-cheatcodes";
 *
 * // types
 * import {DFShortcutMap, DFCheatConversation} from 'df-cheatcodes'
 * import { Parameters } from "actions-on-google";
 *
 * // map of shortcuts
 * const shortcutMap:DFShortcutMap = {
 *    testcheat: {
 *      description: `Test cheat here`,
 *      examples: [`$cheat testcheat`, `$cheat testcheat param=abc`],
 *      handler: (
 *        conv: DFCheatConversation,
 *        parameters: Parameters,
 *        args: any
 *      ) => {},
 *    },
 *  };
 *  const intentName = `__df_cheathandler`;
 *  const rootConfig:DFShortcutConfig = {
 *    intentName,
 *    keyword: `$cheat`, //optional
 *    map: shortcutMap,
 *    commandOverride(candidate: string) {
 *      if (candidate === "testcheatalias") {
 *        return "testcheat";
 *      }
 *      return candidate;
 *    },
 *  };
 *
 *
 * const app = dialogflow();
 * app.use(shortcutCheat(rootConfig));
 * app.use(convCheat());
 *
 * ```
 *
 */
export const shortcutCheat = (
  config: DFShortcutRootConfig
): Plugin<
  DialogflowApp<{}, {}, Contexts, DialogflowConversation<{}, {}>>,
  {}
> => {
  return (app) => {
    const { intentName = `__df_cheathandler` } = config;
    const inst = new ShortcutCheat(config);
    const intentConfig = {
      intent: intentName,
      handler: (
        conv: DFCheatConversation | DialogflowConversation,
        parameters: Parameters
      ) => {
        const tidyQuery = inst.trimCheat(conv.query);
        const { command, args } = inst.parseCheat(tidyQuery);
        inst.run(conv, parameters, command, args, tidyQuery);
      },
    };
    app.intent(intentConfig.intent, intentConfig.handler);
  };
};
