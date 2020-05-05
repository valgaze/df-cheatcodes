/*
TS
import {convCheat, iFramer} from 'df-cheatcodes'

import {dialogfrom} from 'actions-on-google'

const app = dialogflow()

const config = {}
app.use(convCheat(config))

app.intent('intentName', async (conv, parameters) => {

    conv.send(new iFramer({url: `http://www.google.com`}))

})


*/

import { CustomComponentBase } from "./index";
export interface MindReaderConfig extends CustomComponentBase {
  type: "dfbrainwaves";
  // Optional/extendable config for various frontend
  config?: {
    autoplay?: boolean;
    platform?: string;
    [key: string]: any;
  };
}

export class MindReader {
  public type: string;
  public config: MindReaderConfig;

  constructor(config: MindReaderConfig) {
    this.type = config.type;
    this.config = config;
  }
}
