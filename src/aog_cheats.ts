// Types
// https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/actionssdk/api/v2.ts
// https://github.com/actions-on-google/actions-on-google-nodejs/tree/5d82ad01c9fa195076c531bdee1b1a52c85e883a/src/service/actionssdk/conversation/response
import {
  TableOptions,
  // MediaObjectOptions,
  BrowseCarouselItemOptions,
  // ListOptions,
  Parameters,
  GoogleActionsV2UiElementsImage,
  GoogleActionsV2UiElementsButton,
  BrowseCarouselItem,
} from "actions-on-google";
import get = require("lodash.get");

// Rich Components
// Important: we don't bother aliasing LinkOutSuggestion
import {
  // BasicCard,
  // Button,
  Image,
  // Suggestions,
  Table,
  BrowseCarousel,
  // MediaObject,
  Carousel,
  List,
} from "actions-on-google";

// TODO: Make this configurable or use fetch
import axios, { AxiosRequestConfig } from "axios";
// Helpers for Plugin expert inspired by Nick Felker's (@Fleker) "session-entities" plugin [Feb 2020]: https://github.com/actions-on-google/dialogflow-session-entities-plugin-nodejs/tree/21ddb780316b3c11b030d8c6154bdc40533719c7
import {
  Plugin,
  DialogflowApp,
  Contexts,
  DialogflowConversation,
} from "actions-on-google";

// Helper types
export type RandomOptions = string[];
export interface APIConfig extends AxiosRequestConfig {
  axios?: Partial<AxiosRequestConfig>;
  [key: string]: any;
}

export interface DFCheatTemplate {
  [key: string]: any;
}

export class AoGCheats {
  conv: DialogflowConversation;
  _dfconfig: object;
  convRef: DialogflowConversation;
  private axiosInst: any;

  bongo() {
    this.conv.ask(`Bongo 123`);
  }
  constructor(conv: DialogflowConversation) {
    this.conv = conv;
    this.convRef = this.conv;
    this._dfconfig = {};
    this.axiosInst = axios;
  }

  /**
   * Will attempt to match an intent associated with this event (if no match, fallback)
   * conv.cheat.triggerEvent({name: 'abc'})
   *
   * Note: This will flush any rich responses and attempt to find an intent
   * associated/listening for the dispatched event
   *
   * @param event Name of the event
   * @param parameters Parameters to send with the event
   * @param lang The language of this query.
   *     See {@link https://dialogflow.com/docs/languages|Language Support}
   *     for a list of the currently supported language codes.
   *     Note that queries in the same session do not necessarily need to specify the same language.
   *     By default, it is the languageCode sent with Dialogflow's queryResult.languageCode
   */
  triggerEvent(event: string, parameters?: Parameters, lang?: string) {
    this.convRef.followup(event, parameters, lang);
  }

  /**
   *  Select a randomly selected text item (useful for templating/multi-lingual)
   *
   * ```
   *  const timestamp = new Date()
   *  const greetings = ['Hi!', 'Hey there', `Server time is ${timestamp}`]
   *  conv.cheat.pickRandom()
   *```
   */
  pickRandom(params: RandomOptions, local: boolean = false): any {
    const pick = params[Math.floor(Math.random() * params.length)];
    if (local) {
      return pick;
    }
    if (typeof pick === "string" || typeof pick === "number") {
      return this.convRef.ask(String(pick));
    }
  }

  /**
   *
   * Randomly selects a phrase & fill in template
   *
   * ```ts
   *
   * // ie from an external template file
   * const payload = {
   *  phrases: ['Hey there, how it going?', 'Hi $[name], here's your $[mint]']
   * template: {
   * name: 'Joe',
   * flavor: 'mint'
   *  }
   * }
   *
   * conv.cheat.template(payload.phrases, payload.template)
   *
   * ```
   *
   * @param phrases: array of phrases []string
   *
   * ```js
   *  ['Hello', 'Hey there!', "How is it going?"]
   *
   * ['Howdy, you are $[name] and you like $[flavor]', '$[name], here is $[flavor]']
   *
   * ```
   * @param template: mappings to phrases object
   *
   * ```js
   * {
   *   name: 'Joe',
   *  flavor: 'mint'
   * }
   *```
   *
   * @param {boolean} local: skip sending to chat, defaults false
   * ```
   * If true, will not send to chat, just return string
   * with template returned
   * ```
   *
   */
  public template(
    utterances: string | string[],
    template: DFCheatTemplate,
    local?: boolean
  ) {
    // TODO: cool way to do this
    let payload: string;
    if (typeof utterances != "string") {
      payload = this.pickRandom(utterances, true) || "";
    } else {
      payload = utterances;
    }
    const replacer = (
      string: string,
      target: string,
      replacement: string
    ): string => {
      if (!string.includes(target)) {
        return string;
      } else {
        return replacer(
          string.replace(`$[${target}]`, replacement),
          target,
          replacement
        );
      }
    };
    for (let key in template) {
      const val = template[key];
      payload = replacer(payload, key, val);
    }
    if (local) {
      return payload;
    } else {
      return this.conv.ask(payload!);
    }
  }

  /**
   * Directly interact with axios
   * ```
   *  const config = {
   *    method: 'GET',
   *    headers: {
   *        'Accept': 'application/json'
   *    },
   *    url: 'https://icanhazdadjoke.com'
   *  }
   *
   *  const jokeRes = await conv.cheat.api(config)
   *  const { joke, id } = jokeRes.data;
   *  console.log(`{id}: Here's a har-har: ${joke}`)
   * ```
   */
  api(config: object) {
    return axios(config);
  }

  /**
   *  Quick way to grab 3rd-party data
   *
   * ```
   *  const res = await conv.cheat.get('https://swapi.py4e.com/api/people/1')
   *  conv.ask(`The name is ${res.data.name}`)
   *```
   */
  get(route: string, config: APIConfig = {}): Promise<any> {
    return this.axiosInst.get(route, config);
  }

  /**
   *  Quick way to post to a 3rd-party service
   *
   * ```
   *  const res = await conv.cheat.post('https://yourservice.com/api/action')
   *  conv.ask(`The data was posted with: ${JSON.stringify(res.data)}`)
   *```
   */
  post(route: string, config: APIConfig = {}): Promise<any> {
    return this.axiosInst.post(route, config);
  }

  // https://actions-on-google.github.io/actions-on-google-nodejs/classes/dialogflow.contextvalues.html

  /**
   * Add a context to current session
   *
   * @param name Name of the context. Dialogflow converts to lowercase.
   * @param lifespan Context lifespan.
   * @param parameters Context parameters.
   *
   * ```
   *  conv.cheat.addContext('myContext', 2)
   *  conv.cheat.addContext('myContext2', 3, {a:1,b:2,c:3})
   *
   *  conv.ask(`The data was posted with: ${JSON.stringify(res.data)}`)
   *```
   */
  addContext(name: string, lifespan: number, data: object | any) {
    return this.convRef.contexts.set(name, lifespan, data);
  }

  /**
   *  (Safely) Extract data associated with a context
   *
   * ```ts
   *  // Attach data to 'myContext'
   *  conv.cheat.addContext('myContext', 2, {a:1,a:2})
   *
   *  // Retrive data from context
   *  const myData = conv.cheat.getContextData('myContext') // {a:1, a:2}
   *```
   */
  getContextData(name: string | number) {
    const context = this.convRef.contexts.get(name);
    if (context && context.parameters) {
      return context.parameters;
    } else {
      return undefined;
    }
  }

  /**
   * Remove a context current session
   *
   * @param name Name of the context. Dialogflow converts to lowercase.
   *
   * ```
   *  conv.cheat.removeContext('myContext') //
   *
   *```
   */
  removeContext(name: string) {
    return this.convRef.contexts.delete(name);
  }

  /**
   * Retrive any data attached to the *request* object
   *
   * ```ts
   * const req = conv.cheat.getRequestData()
   * ```
   *
   */
  getRequestData() {
    return this.convRef.request;
  }

  /**
   * Retrieve data attched to the current session, organized by key
   * See more: https://developers.google.com/assistant/conversational/save-data
   * ```ts
   *  // In previous intent handler
   *  // conv.cheat.saveData('a', {a:1, b:2})
   *
   *
   * const myData = conv.cheat.getData('a') // {a:1, b:2}
   *
   * ```
   *
   */
  getData(key: string): any {
    if (key) {
      this._safetyStorage();
      return this.convRef.data.__map[key];
    }
  }

  /**
   * Attach data to the current session organized by key
   * See more: https://developers.google.com/assistant/conversational/save-data
   * ```ts
   * const data = {a:1, b:2}
   * conv.cheat.saveData('a', data)
   * ```
   *
   */
  saveData(key: string, data: string | number | object): object {
    if (!this.convRef.data.__map) {
      this.convRef.data.__map = {};
    }
    if (data && key) {
      this.convRef.data.__map[key] = data;
      return this.convRef.data.__map[key];
    }
    return {};
  }

  _safetyStorage() {
    if (!this.convRef.data.__map) {
      this.convRef.data._map = {};
    }
  }

  /*
      Add a custom response to webhookPayload responses
      conv.cheat.custom({type: 'video', url: 'https://www.youtube.com/watch?v=bZ81PeNRNxw'})
  */

  /**
   *
   * # Usage
   *
   * ```ts
   *
   * conv.ask('Custom component!')
   * const data = {a:1,b:2}
   * conv.cheat.addCustom('bongo', data)
   *
   *
   * ```
   *
   * ## Response
   * Adds component to response.queryResult.webhookpayload.richResponse.items
   *
   *
   *
   *    [{
   *        "simpleResponse": {
   *            "textToSpeech": "Custom component!"
   *        }
   *    }, {
   *        "bongo": {
   *            "a": 1,
   *            "b": 2
   *        }
   *    }]
   *
   *
   */
  addCustom(key: string, data: any) {
    if (typeof key === "string") {
      const payload = {
        [key]: data,
      };
      this.convRef.responses.push(payload);
    }
  }

  /**
   *  Link: https://developers.google.com/assistant/conversational/rich-responses#BasicCardSamples
   *  conv.cheat.card(config:DFBasicCard)
   *
   * ## Usage
   *
   * (No image/button imports)
   * ```ts
   *  conv.cheat.card({
   *    text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
   *    subtitle: "Here's your subtitle",
   *    title: `Here's your large mint`,
   *    button: {
   *      title: `Learn more about mint ice cream`,
   *      url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
   *    },
   *    image: {
   *      url: "https://i.imgur.com/W9Eeuu1.jpg",
   *      alt: "Mint!",
   *    },
   *  });
   * ```
   *
   *
   * ```ts
   * // w/o alias
   *
   *
   * import { Button, Image, BasicCard } from 'actions-on-google'
   *
   * conv.ask(
   *   new BasicCard({
   *     text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
   *     subtitle: "Here's your subtitle",
   *     title: `Here's your large mint`,
   *     buttons: new Button({
   *       title: `Learn more about mint ice cream`,
   *       url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
   *     }),
   *     image: new Image({
   *       url: "https://i.imgur.com/W9Eeuu1.jpg",
   *       alt: "Mint!",
   *     }),
   *   })
   * );
   * ```
   *
   * ## Response:
   * ```js
   * {
   *	"basicCard": {
   *		"title": "Here's your large mint",
   *		"subtitle": "Here's your subitle",
   *		"formattedText": "Here is your 🍦!!! This type of mint ice cream is great",
   *		"image": {
   *			"url": "https://i.imgur.com/W9Eeuu1.jpg",
   *			"accessibilityText": "mint mmm..."
   *		},
   *		"buttons": [{
   *			"title": "Learn more about mint",
   *			"openUrlAction": {
   *				"url": "http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream"
   *			}
   *		}]
   *	}
   *
   *
   */
  card(config: DFCheatCardOptions) {
    // TODO: more elegant, less tedious approach to image/button de-sugar'ing
    // TODO: support usual payload of new Image too
    const cardTemplate = {
      title: this._insert(config.title),
      subtitle: this._insert(config.title),
      formattedText: this._insert(config.text),
    };

    interface cardImage {
      url: string;
      alt: string;
    }
    const buildImage = (payload: cardImage) => {
      return {
        url: payload.url,
        accessibilityText: payload.alt,
      };
    };

    interface cardButton {
      title: string;
      url: string;
    }
    const buildButton = (payload: cardButton) => {
      return {
        title: payload.title,
        openUrlAction: {
          url: payload.url,
        },
      };
    };
    // Images
    if (Array.isArray(config.images)) {
      config.images.forEach((image: any, idx: number) => {
        const { url, alt = "" } = image;
        // TODO: index w/ int
        // @ts-ignore
        cardTemplate.images[idx] = buildImage({ url, alt });
      });
    } else if (config.image) {
      const { url, alt } = config.image;
      if (url && alt) {
        // @ts-ignore
        cardTemplate.image = buildImage({ url, alt });
      }
    }

    if (Array.isArray(config.buttons)) {
      config.buttons.forEach((button, idx) => {
        const { url, title } = button;
        if (url && title) {
          // @ts-ignore
          cardTemplate.buttons[idx] = buildButton({ url, title });
        }
      });
    } else if (config.buttons) {
      const { url, title } = config.buttons;
      if (url && title) {
        // @ts-ignore
        cardTemplate.buttons = [buildButton({ url, title })];
      }
    } else if (config.button) {
      const { url, title } = config.button;
      if (url && title) {
        // @ts-ignore
        cardTemplate.buttons = [buildButton({ url, title })];
      }
    }

    this._add("basicCard", cardTemplate);
  }

  _add(type: string, payload: any) {
    if (payload) {
      this.convRef.responses.push({ [type]: payload });
    }
  }

  _insert(val: any) {
    return val ? val : null;
  }

  /**
   *  Link: https://developers.google.com/assistant/conversational/rich-responses#MediaResponseSamples
   *
   *  conv.cheat.media(mediaConfig: MediaObjectOptions)
   *  Note: This must be combined with a plaintext response
   *
   * ## Usage
   * ```ts
   *
   *  conv.ask(`Here's a rich media object`)
   *  conv.cheat.media({
   *   name: "Jazz in Paris",
   *   url: "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
   *   description: "A funky Jazz tune",
   *   icon:{
   *       url: "http://storage.googleapis.com/automotive-media/album_art.jpg",
   *       alt: "Media icon"
   *      }
   *  })
   *```
   *
   * ## Response
   *
   * ```js
   * {
   *     "mediaResponse": {
   *         "mediaType": "AUDIO",
   *         "mediaObjects": [{
   *             "contentUrl": "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
   *             "description": "A funky Jazz tune",
   *             "icon": {
   *                 "url": "http://storage.googleapis.com/automotive-media/album_art.jpg",
   *                 "accessibilityText": "Media icon"
   *             },
   *             "name": "Jazz in Paris"
   *         }]
   *     }
   * }
   * ```
   */
  media(mediaConfig: DFCheatMediaOption) {
    const baseTemplate = {
      mediaType: "AUDIO",
      mediaObjects: [
        {
          name: this._insert(mediaConfig.name),
          contentUrl: this._insert(mediaConfig.url),
          description: this._insert(mediaConfig.description),
          icon: { url: "", accessibilityText: "" },
        },
      ],
    };

    const buildIcon = (url: string, alt: string) => {
      return {
        url,
        accessibilityText: alt,
      };
    };

    if (mediaConfig.icon) {
      const { url, alt } = mediaConfig.icon;
      if (url && alt) {
        baseTemplate.mediaObjects[0].icon = buildIcon(url, alt);
      }
    }
    this._add("mediaResponse", baseTemplate);
  }

  /**
   *  Link: https://developers.google.com/assistant/conversational/rich-responses#BrowsingCarouselSamples
   *
   *  conv.cheat.browseCarousel(browseCarouselConfig: BrowseCarouselOptions)
   *  // Note: See below that you'll need to import BrowseCarouselItem & Image
   *
   *
   * ## Usage
   * ```ts
   *  conv.ask(`Here's a browse carousel`)
   *  conv.cheat.browseCarousel({
   *    items: [
   *      {
   *        title: "Title of item 1",
   *        url: "https://example.com",
   *        description: "Description of item 1",
   *        image: {
   *          url:
   *            "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
   *          alt: "Image alternate text",
   *        },
   *        footer: "Item 1 footer",
   *      },
   *      {
   *        title: "Title of item 2",
   *        url: "https://example.com",
   *        description: "Description of item 2",
   *        image: {
   *          url:
   *            "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
   *          alt: "Image alternate text",
   *        },
   *        footer: "Item 2 footer",
   *      },
   *    ],
   *  });
   *```
   *
   * ## Response
   *
   * ```js
   * {
   *     "carouselBrowse": {
   *         "items": [{
   *                 "title": "Title of item 1",
   *                 "openUrlAction": {
   *                     "url": "https://example.com"
   *                 },
   *                 "description": "Description of item 1",
   *                 "footer": "Item 1 footer",
   *                 "image": {
   *                     "url": "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
   *                     "accessibilityText": "Image alternate text"
   *                 }
   *             },
   *             {
   *                 "title": "Title of item 2",
   *                 "openUrlAction": {
   *                     "url": "https://example.com"
   *                 },
   *                 "description": "Description of item 2",
   *                 "footer": "Item 2 footer",
   *                 "image": {
   *                     "url": "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
   *                     "accessibilityText": "Image alternate text"
   *                 }
   *             }
   *         ]
   *     }
   * }
   *
   *   * Note: This must be combined with a plaintext response
   *   * Note: This is DIFFERENT than carouselSelect
   * ```
   */

  browseCarousel(browseCarouselConfig: DFCheatCarouselBrowseOptions) {
    // TODO: tidy up
    const { items } = browseCarouselConfig;

    const tidyItems: BrowseCarouselItemOptions[] = [];
    items.forEach((item) => {
      if (item.image) {
        const { url, alt } = <DFCheatImageOption>item.image;
        item.image = new Image({ url, alt });
      }
      //@ts-ignore
      tidyItems.push(new BrowseCarouselItem(item));
    });
    browseCarouselConfig.items = tidyItems;

    //@ts-ignore
    // this.convRef.ask(new BrowseCarousel(browseCarouselConfig));

    const browseCarouselPayload = new BrowseCarousel(browseCarouselConfig);
    this._add("carouselBrowse", browseCarouselPayload);
  }

  /**
   *  Link: https://developers.google.com/assistant/conversational/selection-responses#carousel
   *
   *  conv.cheat.carousel(carouselConfig: CarouselOptions)

   * ## Usage
   * ```ts
   *   conv.ask('Which of these looks good?')
   *   conv.cheat.carousel({
   *     items: {
   *       key1: {
   *         title: 'Chocolate ice cream',
   *         description: 'Description of number one',
   *         synonyms: ['synonym of KEY_ONE 1', 'synonym of KEY_ONE 2'],
   *         image: {
   *            url: 'https://i.imgur.com/uMtF8ah.jpg',
   *            alt: 'chocolate ice cream'
   *          }
   *       },
   *       key2: {
   *         title: 'Number two',
   *         description: 'Description of number one',
   *         synonyms: ['synonym of KEY_TWO 1', 'synonym of KEY_TWO 2'],
   *         image: {
   *            url: 'https://i.imgur.com/W9Eeuu1.jpg',
   *            alt: 'mint ice cream'
   *         }
   *       }
   *     }
   *   })
   *```
   *
   *
   *  Note: This must be combined with a plaintext response
   *  Note: This is DIFFERENT than browseCarousel and is located under response.google.systemIntent.data
   *
   *
   * ## Response
   *
   * ```js
   *   {
   *     "payload": {
   *         "google": {
   *             "expectUserResponse": true,
   *             "systemIntent": {
   *                 "intent": "actions.intent.OPTION",
   *                 "data": {
   *                     "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
   *                     "carouselSelect": {
   *                         "items": [{
   *                                 "optionInfo": {
   *                                     "key": "key1",
   *                                     "synonyms": [
   *                                         "synonym of KEY_ONE 1",
   *                                         "synonym of KEY_ONE 2"
   *                                     ]
   *                                 },
   *                                 "description": "Description of number one",
   *                                 "title": "Number one"
   *                             },
   *                             {
   *                                 "optionInfo": {
   *                                     "key": "key2",
   *                                     "synonyms": [
   *                                         "synonym of KEY_TWO 1",
   *                                         "synonym of KEY_TWO 2"
   *                                     ]
   *                                 },
   *                                 "description": "Description of number one",
   *                                 "title": "Number two"
   *                             }
   *                         ]
   *                     }
   *                 }
   *             },
   *             "richResponse": {
   *                 "items": [{
   *                     "simpleResponse": {
   *                         "textToSpeech": "Which of these looks good?"
   *                     }
   *                 }]
   *             }
   *         }
   *     }
   * }
   *
   * ```
   */

  // TODO: clear out ignores
  carousel(carouselConfig: DFCheatCarouselOptions) {
    for (let key in carouselConfig.items) {
      const item = carouselConfig.items[key];
      if (item.image) {
        const { url, alt } = item.image;
        if (url && alt) {
          // @ts-ignore
          item.image = new Image({ url, alt });
        }
      }
    }
    //@ts-ignore
    const carouselSelectPayload = new Carousel(carouselConfig);
    this._add(
      "carouselSelect",
      carouselSelectPayload.inputValueData.carouselSelect
    );
  }

  /**
   *  Link: https://developers.google.com/assistant/conversational/selection-responses#list
   *
   *  conv.cheat.list(listConfig: ListOptions)
   *
   *  Note: This must be combined with a plaintext response.
   *  Note: We also break the rules and this goes to webhookPayload
   *
   * ## Usage
   * ```ts
   *
   * conv.ask("Hey look a list");
   * conv.cheat.list({
   *   items: {
   *     key1: {
   *       title: "Number one",
   *       description: "Description of Item #1",
   *       synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
   *       image: {
   *         url: `http://storage.googleapis.com/automotive-media/album_art.jpg`,
   *         alt: "access text",
   *       },
   *     },
   *     key2: {
   *       title: "Number two",
   *       description: "Description of item 2",
   *       image: {
   *         url: `http://storage.googleapis.com/automotive-media/album_art.jpg`,
   *         alt: "access text",
   *       },
   *       synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
   *     },
   *   },
   * });
   *
   *```
   *
   * ## Response
   *
   * ```js
   * {
   *     "payload": {
   *         "google": {
   *             "expectUserResponse": true,
   *             "systemIntent": {},
   *             "richResponse": {
   *                 "items": [{
   *                    { "listSelect": { "items": [{ "image": { "accessibilityText": "access text", "url": "http://storage.googleapis.com/automotive-media/album_art.jpg" }, "description": "Description of Item #1", "title": "Number one", "optionInfo": { "key": "key1", "synonyms": ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"] } }, { "image": { "accessibilityText": "access text", "url": "http://storage.googleapis.com/automotive-media/album_art.jpg" }, "description": "Description of item 2", "optionInfo": { "synonyms": ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"], "key": "key2" }, "title": "Number two" }] } },
   *                     "simpleResponse": {
   *                         "textToSpeech": "Hey look a list"
   *                     }
   *                 }]
   *             }
   *         }
   *     }
   * }
   *
   * ```
   */

  list(listConfig: any) {
    const buildImage = (payload: { url: string; alt: string }) => {
      return {
        url: payload.url,
        accessibilityText: payload.alt,
      };
    };
    for (let key in listConfig.items) {
      const item = listConfig.items[key];
      if (item.image) {
        const { url, alt } = item.image;
        if (url && alt) {
          item.image = buildImage({ url, alt });
        }
      }
    }
    const listSelectPayload = new List(listConfig);
    this._add("listSelect", listSelectPayload.inputValueData.listSelect);
  }

  /**
   *  conv.cheat.suggestions(suggestions: string[])
   *  Note: This must be combined with a plaintext response
   *
   * ## Usage
   * ```ts
   *  conv.ask('Here are the options...')
   *  conv.cheat.suggestions(['option A', 'Option B', 'Option C'])
   *```
   *
   * ## Response
   *
   * ```js
   * {
   *    "payload": {
   *        "google": {
   *            "expectUserResponse": true,
   *            "richResponse": {
   *                "items": [{
   *                    "simpleResponse": {
   *                        "textToSpeech": "Here are the options..."
   *                    }
   *                }],
   *                "suggestions": [{
   *                    "title": "a"
   *                }, {
   *                    "title": "b"
   *                }, {
   *                    "title": "c"
   *                }]
   *            }
   *        }
   *    }
   * }
   * ```
   */

  suggestions(suggestions: string[]) {
    const template = { suggestions: [] };
    suggestions.forEach((suggestion) => {
      //@ts-ignore
      template.suggestions.push({ title: suggestion });
    });
    this._add("suggestions", template.suggestions);
  }

  /**
   *  conv.cheat.suggestions(suggestions: string[])
   *  Note: This must be combined with a plaintext response
   *
   * ## Usage
   * ```ts
   *  conv.ask("Here's some tabular data...")
   *  conv.cheat.table(({
   *     dividers: true,
   *     columns: ['header 1', 'header 2', 'header 3'],
   *     rows: [
   *       ['row 1 item 1', 'row 1 item 2', 'row 1 item 3'],
   *       ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
   *     ],
   *  })
   *```
   *
   * ## Response
   *
   * ```js
   *  {
   * 	"tableCard": {
   * 		"rows": [{
   * 			"cells": [{
   * 				"text": "row 1 item 1"
   * 			}, {
   * 				"text": "row 1 item 2"
   * 			}, {
   * 				"text": "row 1 item 3"
   * 			}],
   * 			"dividerAfter": true
   * 		}, {
   * 			"cells": [{
   * 				"text": "row 2 item 1"
   * 			}, {
   * 				"text": "row 2 item 2"
   * 			}, {
   * 				"text": "row 2 item 3"
   * 			}],
   * 			"dividerAfter": true
   * 		}],
   * 		"columnProperties": [{
   * 			"header": "header 1"
   * 		}, {
   * 			"header": "header 2"
   * 		}, {
   * 			"header": "header 3"
   * 		}]
   * 	}
   * }
   * ```
   */

  table(tableConfig: TableOptions) {
    this._add("tableCard", new Table(tableConfig));
  }

  /**
   * Add video component (custom component, will NOT render outside web environment)
   * ```ts
   * conv.ask('Here is a video...')
   * conv.cheat.addVideo('https://www.youtube.com/watch?v=6A8W77m-ZTw', '2013: Conan Busts Jordan Schlansky & His Elitist Espresso Machine - CONAN on TBS')
   * ```
   *
   * ## Response
   *
   * response.queryResult.webhookPayload.google.richResponse.items
   * ```ts
   *  [
   *   {
   *     simpleResponse: {
   *       textToSpeech: "Here is a video...",
   *     },
   *   },
   *   {
   *     dfcheatvideo: {
   *       url: "https://www.youtube.com/watch?v=6A8W77m-ZTw",
   *       title:
   *         "2013: Conan Busts Jordan Schlansky & His Elitist Espresso Machine - CONAN on TBS",
   *     },
   *   },
   * ]
   *
   * ```
   */
  addVideo(url: string, title?: string, config?: VideoSubConfig) {
    this.addCustom("dfcheatvideo", { url, title, config });
  }

  /**
   * Add video component (custom component, will NOT render outside web environment)
   * ```ts
   * conv.ask('Here is a video...')
   * conv.cheat.addiFrame('https://www.youtube.com/watch?v=6A8W77m-ZTw', {postMessaage: 'message', width: '50%'})
   * ```
   *
   * ## Response
   * ```ts
   *
   * ```
   */
  addiFrame(url: string, config?: object) {
    this.addCustom("dfcheatiframe", { url, config });
  }

  /**
   * ???
   *
   **/
  addMindReader(config: object = {}) {
    this.addCustom("dfbrainwaves", config);
  }

  _log(...data: any) {
    console.log.apply(console, data);
  }

  loud(...data: any) {
    console.log(`\n\n####`, new Date().toString(), `\n\n`);
    this._log(...data);
    console.log(`\n\n####\n\n`);
  }

  _get(config: any) {
    //@ts-ignore
    return get(config);
  }
}

export interface DFCheatConversation extends DialogflowConversation {
  cheat: AoGCheats;

  // TODO: custom or no namespace
  // ex. conv.carousel() or conv.custom.carousel()
  // [key: string]: AoGCheats;
}

export const convCheat = (): Plugin<
  DialogflowApp<{}, {}, Contexts, DialogflowConversation<{}, {}>>,
  {}
> => {
  return (app) => {
    app.middleware((conv) => {
      const sessionEntities = new AoGCheats(conv);
      return Object.assign(conv, {
        cheat: sessionEntities,
      } as DFCheatConversation);
    });
  };
};
import { VideoSubConfig } from "./components/video";

// Image
export interface DFCheatImageOption {
  // TODO: inline-base 64 too
  // base64: string | big_buffer << convert to path, ex new Buffer(big_buffer).toString('base64')

  // GoogleActionsV2UiElementsImage: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/actionssdk/api/v2.ts#L3097
  /**
   * Image
   *
   *   {
   *     url: 'https://i.imgur.com/W9Eeuu1.jpg',
   *     accessibilityText: 'Mint!',
   *     height: undefined
   *     width: undefined
   *   }
   *
   */
  url: string;
  alt: string;
  height?: string | number;
  width?: string | number;
}

export type DFCheatImage = DFCheatImageOption;
export type DFCheatImages =
  | DFCheatImageOption[]
  | GoogleActionsV2UiElementsImage[];

// Button
export interface DFCheatButtonOption {
  // GoogleActionsV2UiElementsButton: https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/actionssdk/api/v2.ts#L2939
  /**
   * Button
   *
   *  {
   *      title: 'Learn more about mint ice cream',
   *      openUrlAction: {
   *          url: 'http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream'
   *      }
   *  }
   *
   */
  url: string;
  title?: string;
}

// export type DFCheatButtons = DFCheatButtonOption | DFCheatButtonOption[];

export type DFCheatButton =
  | GoogleActionsV2UiElementsButton
  | DFCheatButtonOption;

// https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/actionssdk/conversation/response/card/basic.ts
export interface DFCheatCardOptions {
  buttons?: DFCheatButtonOption[] | DFCheatButtonOption;
  button?: DFCheatButtonOption;
  images?: DFCheatImages;
  image?: DFCheatImage;
  title?: string;
  subtitle?: string;
  text?: string; // Markdown
}

export interface DFCheatCarouselItem {
  title?: string;
  description?: string;
  synonyms?: string[];
  image?: DFCheatImageOption;

  // image?: GoogleActionsV2UiElementsImage | DFCheatImageOption;
}

export interface DFCheatMediaOption {
  name?: string;
  description?: string;
  url?: string;
  icon?: DFCheatImageOption;
}

export interface DFCheatBrowseCarouselItem {
  title: string;
  url: string;
  description?: string;
  image?: DFCheatImageOption | GoogleActionsV2UiElementsImage;
  footer?: string;
}
export interface DFCheatCarouselBrowseOptions {
  items: DFCheatBrowseCarouselItem[];
}
// export interface OptionItems<TOptionItem = OptionItem | string> {
/*
export interface OptionItems<TOptionItem = OptionItem | string> {
  [key: string]: TOptionItem
}
*/
// export interface namespacer<ABC = DFCheatCarouselItem | string> {
//   [key: string]: ABC;
// }

export interface DFCheatCarouselNamespacer {
  [key: string]: DFCheatCarouselItem;
}
// export interface namespacer {
//   [key: string]: DFCheatCarouselItem;
// }
export interface DFCheatCarouselOptions {
  items: DFCheatCarouselNamespacer;
}
