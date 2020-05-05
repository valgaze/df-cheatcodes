import { CustomComponentBase } from "./index";
export interface dfcheatiframe {
  dfcheatiframe: DFCheatFrameConfig;
}

export interface DFCheatFrameConfig extends CustomComponentBase {
  type: "dfcheatiframe";
  url: string;
  config?: object;
}
