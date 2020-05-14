# Actions On Google Cheats

- **[Full](#full-example)**

- **[Individual File](#individual-file)**

- **[Rich Components](#rich-components)**

## Full Example

```ts
import { dialogflow } from "actions-on-google";
import { convCheat } from "df-cheatcodes";

// types
import { DFCheatConversation } from "df-cheatcodes";

const app = dialogflow();

app.use(convCheat());

app.intent("intent 123", async (conv: DFCheatConversation) => {
  // Pick & say random response
  conv.cheat.pickRandom([
    "Hi there",
    "Hey how are you doing?",
    "Hallo",
    "Bonjour!",
  ]);

  // Pick random from a template (external file, multiple languages, etc)
  // NOTE: $[variable] for anything to be swapped out by template
  // ${variable} for anything replaced in local scope

  const elapsedTime = new Date().getTime();
  const phrases = [
    `Hey $[name]! Here's your $[flavor] ice cream`,
    `Yo $[name], one $[flavor] for 'ya!`,
    `A $[flavor] for $[name]!`,
    `Did you know it's been ${elapsedTime} since 1970, $[name]? Crazy right? Anyway here's your $[flavor] ice cream`,
  ];

  conv.cheat.template(phrases, {
    name: "Joe",
    flavor: "mint",
  });

  // Interact with APIs (retrieve data)
  const res = await conv.cheat.get("https://swapi.py4e.com/api/people/1");
  conv.ask(`The name is ${res.data.name}`);

  // Interact with APIs (send data, do work)
  const res = await conv.cheat.post("https://postman-echo.com/post", { a: 1 });
  conv.ask(`Posted response ${JSON.stringify(res)}`);

  // Save data between intents (attached to full conversation session)
  conv.cheat.saveData("characterName", res.data.name);
  conv.cheat.getData("characterName"); // value of res.data.name

  const requestData = conv.cheat.getRequestData(); // Get conv.request data (anything sent with queryParams.payload, https://cloud.google.com/dialogflow/docs/reference/rest/v2/QueryParameters

  // contexts
  conv.cheat.addContext("myContext", 3, { a: 1, b: 2 });
  const contextData = conv.cheat.getContextData("myContext"); // { a: 1, b: 2 }
  conv.cheat.removeContext("myContext");

  // Suggestion "chips"
  conv.ask("Here are the options...");
  conv.cheat.suggestions(["option A", "Option B", "Option C"]);

  // Card (other rich components: )
  conv.cheat.card({
    text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
    subtitle: "Here's your subtitle",
    title: `Here's your large mint`,
    button: {
      title: `Learn more about mint ice cream`,
      url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
    },
    image: {
      url: "https://i.imgur.com/W9Eeuu1.jpg",
      alt: "Mint!",
    },
  });
});
```

## Individual File

Like in **[df-cheatkit](https://github.com/valgaze/df-cheatkit)**

```ts
import { dialogflow } from "actions-on-google";
import { convCheat } from "df-cheatcodes";

const app = dialogflow();
app.use(convCheat());
```

Intent handler

```ts
// types
import { DFCheatConversation } from "df-cheatcodes";

export default function (conv: DFCheatConversation, parameters) {
  const { "icecream-flavor": flavor, "icecream-size": size } = parameters; // "flavor", "size" now available

  const icecreamHash = {
    chocolate: "https://i.imgur.com/uMtF8ah.jpg",
    vanilla: "https://i.imgur.com/zqKeYU5.jpg",
    strawberry: "https://i.imgur.com/GSZEI39.jpg",
    mint: "https://i.imgur.com/W9Eeuu1.jpg",
  };

  const imageURL = icecreamHash[flavor];
  conv.cheat.pickRandom([
    `All right, one ${flavor} coming up!`,
    `We've got a ${size} mint for ya`,
    `There's a ${flavor} with your name on it`,
  ]);

  conv.cheat.card({
    text: `Here is your 🍦!!! This type of ${flavor} ice cream is great  \nEverybody after this line break loves it.`,
    subtitle: "Here's your subtitle",
    title: `Here's your ${size} ${flavor}`,
    buttons: [
      {
        title: `Learn more about mint ice cream`,
        url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
      },
    ],
    image: {
      url: "https://i.imgur.com/W9Eeuu1.jpg",
      alt: "Mint!",
    },
  });

  conv.cheat.suggestions(["I want another ice cream!", "Tell me a joke"]);
}
```

## Rich Components

basicCard, carouselBrowse, mediaResponse, tableCard

| **Various Util** |
| :--------------: |


- **[basicCard](#card)**

- **[tableCard](#tableCard)**

- **[mediaResponse](#mediaResponse)**

- **[carouselBrowse](#carouselBrowse)**

- **[Suggestion/"Chips"](#SuggestionsChips)**

_Rich visual elements that deliver resources & visually-interesting content to user_

- https://developers.google.com/assistant/conversational/rich-responses

| **Visual selection responses** |
| :----------------------------: |


- **[carouselSelect](#carouselSelect)**

- **[listSelect](#listSelect)**

_AKA Carousel or List, don't use both in a single response_

https://developers.google.com/assistant/conversational/selection-responses

## Skeleton API response

Note: Response may be in Protostruct, see **[here](./grpc.md)** for details

```json
{
  "webhookPayload": {
    "google": {
      "systemIntent": {
        "intent": "actions.intent.OPTION",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
          "listSelect": {
            "title": "List Title",
            "items": []
          },
          "carouselSelect": {
            "items": []
          }
        },
        "richResponse": {
          "items": [],
          "suggestions": [],
          "linkOutSuggestion": {}
        }
      }
    }
  }
}
```

**[⬆️_TOP](#rich-components)**

### card

https://developers.google.com/assistant/conversational/rich-responses#BasicCardSamples

**Usage**

```js
import { DFCheatConversation } from "df-cheatcodes";

app.intent("my intent name", (conv: DFCheatConversation, parameters) => {
  conv.cheat.card({
    text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
    subtitle: "Here's your subtitle",
    title: `Here's your large mint`,
    button: {
      title: `Learn more about mint ice cream`,
      url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
    },
    image: {
      url: "https://i.imgur.com/W9Eeuu1.jpg",
      alt: "Mint!",
    },
  });
});
```

**Response (webhookPayload.google.richResponse.items)**

```json
{
  "basicCard": {
    "title": "Here's your large mint",
    "subtitle": "Here's your subitle",
    "formattedText": "Here is your 🍦!!! This type of mint ice cream is great",
    "image": {
      "url": "https://i.imgur.com/W9Eeuu1.jpg",
      "accessibilityText": "mint mmm..."
    },
    "buttons": [
      {
        "title": "Learn more about mint",
        "openUrlAction": {
          "url": "https://duckduckgo.com/?q=mint+ice+cream"
        }
      }
    ]
  }
}
```

**[⬆️_TOP](#rich-components)**

### Suggestions/"Chips"

https://developers.google.com/assistant/conversational/rich-responses#suggestion_chips

Note: Images on their own get wrapped in a card

**Usage**

```js
app.intent("my intent name", (conv: DFCheatConversation, parameters) => {
  // Suggestions
  conv.cheat.suggestions(["Suggestion 1", "Suggestion 2"]));
});
```

**Response (webhookPayload.google.richResponse.suggestions)**

```json
{
  "suggestions": [
    {
      "title": "Suggestion 1"
    },
    {
      "title": "Suggestion 2"
    }
  ]
}
```

**[⬆️_TOP](#rich-components)**

**[⬆️_TOP](#rich-components)**

### tableCard

https://developers.google.com/assistant/conversational/rich-responses#TableCardSamples

**Usage**

```js
app.intent("my intent name", (conv: DFCheatConversation, parameters) => {
  // Table
  conv.cheat.table(({
     dividers: true,
     columns: ['header 1', 'header 2', 'header 3'],
     rows: [
       ['row 1 item 1', 'row 1 item 2', 'row 1 item 3'],
       ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
     ],
  })
});
```

**Response (webhookPayload.google.richResponse.suggestions)**

```json
{
  "tableCard": {
    "rows": [
      {
        "cells": [
          {
            "text": "row 1 item 1"
          },
          {
            "text": "row 1 item 2"
          },
          {
            "text": "row 1 item 3"
          }
        ],
        "dividerAfter": true
      },
      {
        "cells": [
          {
            "text": "row 2 item 1"
          },
          {
            "text": "row 2 item 2"
          },
          {
            "text": "row 2 item 3"
          }
        ],
        "dividerAfter": true
      }
    ],
    "columnProperties": [
      {
        "header": "header 1"
      },
      {
        "header": "header 2"
      },
      {
        "header": "header 3"
      }
    ]
  }
}
```

**[⬆️_TOP](#rich-components)**

### mediaResponse

https://developers.google.com/assistant/conversational/rich-responses#MediaResponseSamples

Note: Resource URL must be publicly accessible

**Usage**

```js
app.intent("my intent name", (conv: DFCheatConversation, parameters) => {
  conv.cheat.media({
    name: "Jazz in Paris",
    url: "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
    description: "A funky Jazz tune",
    icon: {
      url: "http://storage.googleapis.com/automotive-media/album_art.jpg",
      alt: "Media icon",
    },
  });
});
```

**Response (webhookPayload.google.richResponse.items)**

```json
{
  "mediaResponse": {
    "mediaType": "AUDIO",
    "mediaObjects": [
      {
        "contentUrl": "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
        "description": "A funky Jazz tune",
        "icon": {
          "url": "http://storage.googleapis.com/automotive-media/album_art.jpg",
          "accessibilityText": "Media icon"
        },
        "name": "Jazz in Paris"
      }
    ]
  }
}
```

**[⬆️_TOP](#rich-components)**

### carouselBrowse

https://developers.google.com/assistant/conversational/rich-responses#BrowsingCarouselSamples

Note: Resource URL must be publicly accessible

**Usage**

```js
app.intent("my intent name", (conv: DFCheatConversation, parameters) => {
  // Browse Carousel
  conv.cheat.browseCarousel({
    items: [
      {
        title: "Title of item 1",
        url: "https://example.com",
        description: "Description of item 1",
        image: {
          url:
            "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
          alt: "Image alternate text",
        },
        footer: "Item 1 footer",
      },
      {
        title: "Title of item 2",
        url: "https://example.com",
        description: "Description of item 2",
        image: {
          url:
            "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
          alt: "Image alternate text",
        },
        footer: "Item 2 footer",
      },
    ],
  });
});
```

**Response (webhookPayload.google.richResponse.items)**

```json
{
  "carouselBrowse": {
    "items": [
      {
        "title": "Title of item 1",
        "openUrlAction": {
          "url": "https://example.com"
        },
        "description": "Description of item 1",
        "footer": "Item 1 footer",
        "image": {
          "url": "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
          "accessibilityText": "Image alternate text"
        }
      },
      {
        "title": "Title of item 2",
        "openUrlAction": {
          "url": "https://example.com"
        },
        "description": "Description of item 2",
        "footer": "Item 2 footer",
        "image": {
          "url": "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
          "accessibilityText": "Image alternate text"
        }
      }
    ]
  }
}
```

**[⬆️_TOP](#rich-components)**

### carouselSelect

Note: Taps should emit event `actions_intent_OPTION` (hopefully an intent "listening" for that to handle)

- https://developers.google.com/assistant/conversational/reference/rest/intents?_ga=2.14286135.1429105410.1586194368-136336632.1579631389

- http://kristianbrimble.com/dynamic-carousels-from-your-dialogflow-webhook/

- https://developers.google.com/assistant/conversational/selection-responses

**Usage**

```js
app.intent("my intent name", (conv: DFCheatConversation, parameters) => {
  conv.ask(`Which of these look good?`);
  // Carousel select
  conv.cheat.carousel({
    items: {
      key1: {
        title: "Chocolate ice cream",
        description: "Description of number one",
        synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
        image: {
          url: "https://i.imgur.com/uMtF8ah.jpg",
          alt: "chocolate ice cream",
        },
      },
      key2: {
        title: "Number two",
        description: "Description of number one",
        synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
        image: {
          url: "https://i.imgur.com/W9Eeuu1.jpg",
          alt: "mint ice cream",
        },
      },
    },
  });
});
```

**Response (webhookPayload.google.systemIntent.data.carouselSelect)**

```json
{
  "webhookPayload": {
    "google": {
      "expectUserResponse": true,
      "systemIntent": {
        "intent": "actions.intent.OPTION",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
          "carouselSelect": {
            "items": [
              {
                "optionInfo": {
                  "key": "key1",
                  "synonyms": ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"]
                },
                "description": "Description of number one",
                "image": {
                  "url": "https://i.imgur.com/uMtF8ah.jpg",
                  "accessibilityText": "chocolate ice cream"
                },
                "title": "Chocolate ice cream"
              },
              {
                "optionInfo": {
                  "key": "key2",
                  "synonyms": ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"]
                },
                "description": "Description of number one",
                "image": {
                  "url": "https://i.imgur.com/W9Eeuu1.jpg",
                  "accessibilityText": "mint ice cream"
                },
                "title": "Number two"
              }
            ]
          }
        }
      },
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Which of these looks good?"
            }
          }
        ]
      }
    }
  }
}
```

**[⬆️_TOP](#rich-components)**

### listSelect

Note: Taps should emit event `actions_intent_OPTION` (hopefully an intent "listening" for that to handle)

Note: title & option keys are required fields

- https://developers.google.com/assistant/conversational/reference/rest/intents?_ga=2.14286135.1429105410.1586194368-136336632.1579631389

- http://kristianbrimble.com/dynamic-carousels-from-your-dialogflow-webhook/

- https://developers.google.com/assistant/conversational/selection-responses

**Usage**

```js
app.intent("my intent name", (conv, parameters) => {
  conv.ask("Hey look a list");
  conv.cheat.list({
    items: {
      key1: {
        title: "Number one",
        synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
      },
      key2: {
        title: "Number two",
        synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
      },
    },
  });
});
```

**Response (webhookPayload.google.systemIntent.data.listSelect)**

```json
{
  "webhookPayload": {
    "google": {
      "expectUserResponse": true,
      "systemIntent": {
        "intent": "actions.intent.OPTION",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
          "listSelect": {
            "items": [
              {
                "optionInfo": {
                  "key": "key1",
                  "synonyms": ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"]
                },
                "title": "Number one"
              },
              {
                "optionInfo": {
                  "key": "key2",
                  "synonyms": ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"]
                },
                "title": "Number two"
              }
            ]
          }
        }
      },
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Hey look a list"
            }
          }
        ]
      }
    }
  }
}
```

**[⬆️_TOP](#rich-components)**
