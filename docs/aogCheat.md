# Actions On Google

[[Work in progress]]

basicCard, carouselBrowse, mediaResponse, tableCard

| **Various Util** |
| :--------------: |


- **[pickRandom](#no-op)**

- **[get/saveData](#no-op)**

- **[API](#no-op)**

| **Rich Response Items** |
| :---------------------: |


- **[simpleResponse](#simpleResponse)**

- **[basicCard](#BasicCard)**

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

## Skeleton response

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

**[⬆️_TOP](#actions-on-google)**

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

**[⬆️_TOP](#actions-on-google)**

### Suggestions/"Chips"

https://developers.google.com/assistant/conversational/rich-responses#suggestion_chips

Note: Images on their own get wrapped in a card

**Usage**

```js
app.intent("my intent name", (conv, parameters) => {
  // Suggestions
  conv.ask.suggestions(["Suggestion 1", "Suggestion 2"]));
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

**[⬆️_TOP](#actions-on-google)**

### Suggestion B: "Linkout Suggestion"

Note: only one linkout suggestion per response. URL must be valid

**Usage**

```js
app.intent("my intent name", (conv, parameters) => {
  // LinkOut Suggestion
  conv.ask(
    new LinkOutSuggestion({
      name: "Suggestion bongo",
      url: "https://assistant.google.com/",
    })
  );
});
```

**Response (webhookPayload.google.richResponse.suggestions)**

```json
{
  "suggestions": [],
  "linkOutSuggestion": {
    "destinationName": "Jams",
    "url": "https://www.youtube.com/watch?v=UzYibo3igGU"
  }
}
```

**[⬆️_TOP](#actions-on-google)**

### tableCard

https://developers.google.com/assistant/conversational/rich-responses#TableCardSamples

**Usage**

```js
app.intent("my intent name", (conv, parameters) => {
  // Table
  conv.ask(
    new Table({
      dividers: true,
      columns: ["header 1", "header 2", "header 3"],
      rows: [
        ["row 1 item 1", "row 1 item 2", "row 1 item 3"],
        ["row 2 item 1", "row 2 item 2", "row 2 item 3"],
      ],
    })
  );
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

**[⬆️_TOP](#actions-on-google)**

### mediaResponse

https://developers.google.com/assistant/conversational/rich-responses#MediaResponseSamples

Note: Resource URL must be publicly accessible

**Usage**

```js
app.intent("my intent name", (conv, parameters) => {
  // Media Object
  conv.ask(
    new MediaObject({
      name: "Jazz in Paris",
      url: "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
      description: "A funky Jazz tune",
      icon: new Image({
        url: "http://storage.googleapis.com/automotive-media/album_art.jpg",
        alt: "Media icon",
      }),
    })
  );
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

**[⬆️_TOP](#actions-on-google)**

### carouselBrowse

https://developers.google.com/assistant/conversational/rich-responses#BrowsingCarouselSamples

Note: Resource URL must be publicly accessible

**Usage**

```js
app.intent("my intent name", (conv, parameters) => {
  // Browse Carousel

  conv.ask(
    new BrowseCarousel({
      items: [
        new BrowseCarouselItem({
          title: "Title of item 1",
          url: "https://example.com",
          description: "Description of item 1",
          image: new Image({
            url:
              "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
            alt: "Image alternate text",
          }),
          footer: "Item 1 footer",
        }),
        new BrowseCarouselItem({
          title: "Title of item 2",
          url: "https://example.com",
          description: "Description of item 2",
          image: new Image({
            url:
              "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
            alt: "Image alternate text",
          }),
          footer: "Item 2 footer",
        }),
      ],
    })
  );
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

**[⬆️_TOP](#actions-on-google)**

### carouselSelect

Note: Taps should emit event `actions_intent_OPTION` (hopefully an intent "listening" for that to handle)

- https://developers.google.com/assistant/conversational/reference/rest/intents?_ga=2.14286135.1429105410.1586194368-136336632.1579631389

- http://kristianbrimble.com/dynamic-carousels-from-your-dialogflow-webhook/

- https://developers.google.com/assistant/conversational/selection-responses

**Usage**

```js
app.intent("my intent name", (conv, parameters) => {
  // Constants for list and carousel selection
  const SELECTION_KEY_GOOGLE_ASSISTANT = "googleAssistant";
  const SELECTION_KEY_GOOGLE_PAY = "googlePay";
  const SELECTION_KEY_GOOGLE_PIXEL = "googlePixel";
  const SELECTION_KEY_GOOGLE_HOME = "googleHome";

  // Constant for image URLs
  const IMG_URL_AOG =
    "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png";
  const IMG_URL_GOOGLE_PAY =
    "https://storage.googleapis.com/actionsresources/logo_pay_64dp.png";
  const IMG_URL_GOOGLE_PIXEL =
    "https://storage.googleapis.com/madebygoog/v1/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png";
  const IMG_URL_GOOGLE_HOME =
    "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw";

  // Carousel select
  conv.ask(
    new Carousel({
      items: {
        // Add the first item to the carousel
        [SELECTION_KEY_GOOGLE_ASSISTANT]: {
          synonyms: ["Assistant", "Google Assistant"],
          title: "Item #1",
          description: "Description of Item #1",
          image: new Image({
            url: IMG_URL_AOG,
            alt: "Google Assistant logo",
          }),
        },
        // Add the second item to the carousel
        [SELECTION_KEY_GOOGLE_PAY]: {
          synonyms: ["Transactions", "Google Payments"],
          title: "Item #2",
          description: "Description of Item #2",
          image: new Image({
            url: IMG_URL_GOOGLE_PAY,
            alt: "Google Pay logo",
          }),
        },
        // Add third item to the carousel
        [SELECTION_KEY_GOOGLE_PIXEL]: {
          synonyms: ["Pixel", "Google Pixel phone"],
          title: "Item #3",
          description: "Description of Item #3",
          image: new Image({
            url: IMG_URL_GOOGLE_PIXEL,
            alt: "Google Pixel phone",
          }),
        },
        // Add last item of the carousel
        [SELECTION_KEY_GOOGLE_HOME]: {
          title: "Item #4",
          synonyms: ["Google Home"],
          description: "Description of Item #4",
          image: new Image({
            url: IMG_URL_GOOGLE_HOME,
            alt: "Google Home",
          }),
        },
      },
    })
  );
});
```

**Response (webhookPayload.google.systemIntent.data.carouselSelect)**

```json
{
  "webhookPayload": {
    "google": {
      "richResponse": {
        "items": [],
        "suggestions": []
      },
      "systemIntent": {
        "intent": "actions.intent.OPTION",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
          "carouselSelect": {
            "items": [
              {
                "optionInfo": {
                  "key": "googleAssistant",
                  "synonyms": ["Assistant", "Google Assistant"]
                },
                "description": "Description of Item #1",
                "image": {
                  "url": "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                  "accessibilityText": "Google Assistant logo"
                },
                "title": "Item #1"
              },
              {
                "optionInfo": {
                  "key": "googlePay",
                  "synonyms": ["Transactions", "Google Payments"]
                },
                "description": "Description of Item #2",
                "image": {
                  "url": "https://storage.googleapis.com/actionsresources/logo_pay_64dp.png",
                  "accessibilityText": "Google Pay logo"
                },
                "title": "Item #2"
              },
              {
                "optionInfo": {
                  "key": "googlePixel",
                  "synonyms": ["Pixel", "Google Pixel phone"]
                },
                "description": "Description of Item #3",
                "image": {
                  "url": "https://storage.googleapis.com/madebygoog/v1/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png",
                  "accessibilityText": "Google Pixel phone"
                },
                "title": "Item #3"
              },
              {
                "optionInfo": {
                  "key": "googleHome",
                  "synonyms": ["Google Home"]
                },
                "description": "Description of Item #4",
                "image": {
                  "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                  "accessibilityText": "Google Home"
                },
                "title": "Item #4"
              }
            ]
          }
        }
      }
    }
  }
}
```

**[⬆️_TOP](#actions-on-google)**

### listSelect

Note: Taps should emit event `actions_intent_OPTION` (hopefully an intent "listening" for that to handle)

Note: title & option keys are required fields

- https://developers.google.com/assistant/conversational/reference/rest/intents?_ga=2.14286135.1429105410.1586194368-136336632.1579631389

- http://kristianbrimble.com/dynamic-carousels-from-your-dialogflow-webhook/

- https://developers.google.com/assistant/conversational/selection-responses

**Usage**

```js
app.intent("my intent name", (conv, parameters) => {
  // Constants for list and carousel selection
  const SELECTION_KEY_GOOGLE_ASSISTANT = "googleAssistant";
  const SELECTION_KEY_GOOGLE_PAY = "googlePay";
  const SELECTION_KEY_GOOGLE_PIXEL = "googlePixel";
  const SELECTION_KEY_GOOGLE_HOME = "googleHome";

  // Constant for image URLs
  const IMG_URL_AOG =
    "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png";
  const IMG_URL_GOOGLE_PAY =
    "https://storage.googleapis.com/actionsresources/logo_pay_64dp.png";
  const IMG_URL_GOOGLE_PIXEL =
    "https://storage.googleapis.com/madebygoog/v1/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png";
  const IMG_URL_GOOGLE_HOME =
    "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw";

  conv.ask(
    new List({
      title: "List Title",
      items: {
        // Add the first item to the list
        [SELECTION_KEY_GOOGLE_ASSISTANT]: {
          synonyms: ["Assistant", "Google Assistant"],
          title: "Item #1",
          description: "Description of Item #1",
          image: new Image({
            url:
              "https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png",
            alt: "Google Assistant logo",
          }),
        },
        // Add the second item to the list
        [SELECTION_KEY_GOOGLE_PAY]: {
          synonyms: ["Transactions", "Google Payments", "Google Pay"],
          title: "Item #2",
          description: "Description of Item #2",
          image: new Image({
            url:
              "https://www.gstatic.com/images/branding/product/2x/pay_48dp.png",
            alt: "Google Pay logo",
          }),
        },
        // Add the third item to the list
        [SELECTION_KEY_GOOGLE_PIXEL]: {
          synonyms: ["Pixel", "Google Pixel", "Pixel phone"],
          title: "Item #3",
          description: "Description of Item #3",
          image: new Image({
            url:
              "https://storage.googleapis.com/madebygoog/v1/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png",
            alt: "Google Pixel phone",
          }),
        },
        // Add the last item to the list
        [SELECTION_KEY_GOOGLE_HOME]: {
          title: "Item #4",
          synonyms: ["Home", "Google Home"],
          description: "Description of Item #4",
          image: new Image({
            url:
              "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
            alt: "Google Home",
          }),
        },
      },
    })
  );
});
```

**Response (webhookPayload.google.systemIntent.data.listSelect)**

```json
{
  "webhookPayload": {
    "google": {
      "richResponse": {
        "items": [],
        "suggestions": []
      },
      "systemIntent": {
        "intent": "actions.intent.OPTION",
        "data": {
          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
          "listSelect": {
            "title": "List Title",
            "items": [
              {
                "optionInfo": {
                  "key": "googleAssistant",
                  "synonyms": ["Assistant", "Google Assistant"]
                },
                "description": "Description of Item #1",
                "image": {
                  "url": "https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png",
                  "accessibilityText": "Google Assistant logo"
                },
                "title": "Item #1"
              },
              {
                "optionInfo": {
                  "key": "googlePay",
                  "synonyms": ["Transactions", "Google Payments", "Google Pay"]
                },
                "description": "Description of Item #2",
                "image": {
                  "url": "https://www.gstatic.com/images/branding/product/2x/pay_48dp.png",
                  "accessibilityText": "Google Pay logo"
                },
                "title": "Item #2"
              },
              {
                "optionInfo": {
                  "key": "googlePixel",
                  "synonyms": ["Pixel", "Google Pixel", "Pixel phone"]
                },
                "description": "Description of Item #3",
                "image": {
                  "url": "https://storage.googleapis.com/madebygoog/v1/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png",
                  "accessibilityText": "Google Pixel phone"
                },
                "title": "Item #3"
              },
              {
                "optionInfo": {
                  "key": "googleHome",
                  "synonyms": ["Home", "Google Home"]
                },
                "description": "Description of Item #4",
                "image": {
                  "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                  "accessibilityText": "Google Home"
                },
                "title": "Item #4"
              }
            ]
          }
        }
      }
    }
  }
}
```

**[⬆️_TOP](#actions-on-google)**
