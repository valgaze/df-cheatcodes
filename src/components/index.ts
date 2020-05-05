export type SampleComponentTypes = "dfcheatiframe" | "dfcheatvideo";

export interface CustomComponentBase {
  type?: SampleComponentTypes | string;
}

export interface DFCheatCustom {
  [key: string]: object;
}

export { dfcheatiframe } from "./iframer";
export { dfcheatvideo } from "./video";
