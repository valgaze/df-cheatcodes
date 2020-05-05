import { CustomComponentBase } from "./index";
export interface dfcheatvideo {
  dfcheatvideo: VideoConfig;
}

export interface VideoSubConfig {
  autoplay?: boolean;
  platform?: string;
  [key: string]: any;
}
export interface VideoConfig extends CustomComponentBase {
  type?: "dfcheatvideo";
  url: string;
  title?: string;
  // Optional/extendable config for various frontend
  config?: VideoSubConfig;
}

export class VideoCheat {
  public url: string;
  public type: string | undefined;
  public config: VideoConfig;

  constructor(config: VideoConfig) {
    this.url = config.url;
    this.type = config.type;
    this.config = config;
  }
}
