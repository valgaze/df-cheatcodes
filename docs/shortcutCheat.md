# Shortcut Cheats

Quick aliases (that you define) that can quickly allow a user to hop around a conversational interface & expose specific functionality-- you can copy/paste em, send as a link, etc.

Think of these as similiar to deep links but here it's deep linking to functionality of your intelligent agent. These are useful for conversational engineering debugging and also for users who know exactly what they want and can quickly retrieve.

## Full Example

```ts
import { dialogflow } from "actions-on-google";
import { convCheat } from "df-cheatcodes";

import { dialogflow } from "actions-on-google";
import { shortcutCheat, convCheat, ,  } from "df-cheatcodes";

// types
import {DFShortcutMap, DFCheatConversation} from 'df-cheatcodes'
import { Parameters } from "actions-on-google";

// map of shortcuts
const shortcutMap:DFShortcutMap = {
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

  // Shortcut Config
  /**
   * Note: You will need to train an intent
   * That is activated on your keyword
   *
   * By default the intentName is '__df_cheathandler'
   * By default the activation keyword is '$cheat'
   *
   * Ex. $cheat command prop=value1 prop2=value2 prop3=value3
   * Both of these defaults can be overriden in config w/ `intentName`
   * & `keyword` properties
   *
   */
  const rootConfig:DFShortcutConfig = {
    intentName,
    keyword: `$cheat`, //optional
    map: shortcutMap,
    commandOverride(candidate: string) {
      if (candidate === "testcheatalias") {
        return "testcheat";
      }
      return candidate;
    },
  };

// 1) Initialize
const app = dialogflow();

// 2) Activate AoG cheats (this can make iterating on advanced functionality faster/easier, but not strictly necessary)
app.use(convCheat());

// 3) Activate shortcutCheat (an intent handler is registered under the hood)
// All you need to worry about is the shortcutMap
app.use(shortcutCheat(rootConfig));
```

**[⬆️_TOP](#full-example)**
