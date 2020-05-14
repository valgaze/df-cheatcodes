export * from "./aog_cheats";
export * from "./request_cheat";
export * from "./api_cheat";
export * from "./common";
export * from "./shorcut_cheat";

// Service account: client_email, private_key, project_id
export interface SACredential {
  type?: string;
  project_id: string; // todo: Make this optional & don't initialize right away
  private_key_id?: string;
  private_key: string; // important
  client_email: string; // important
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
}

// Source: https://cloud.google.com/dialogflow/docs/reference/language
export type dflanguages =
  | "zh-HK"
  | "zh-CN"
  | "zh-TW"
  | "da"
  | "nl"
  | "en"
  | "en-AU"
  | "en-CA"
  | "en-GB"
  | "en-IN"
  | "en-US"
  | "fr"
  | "fr-CA"
  | "fr-FR"
  | "de"
  | "hi"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "no"
  | "pl"
  | "pt-BR"
  | "pt"
  | "ru"
  | "es"
  | "es-419"
  | "es-ES"
  | "sv"
  | "th"
  | "tr"
  | "uk"
  | string
  | "en_US"
  | "en_us";
