```
tl:dr; So easy it'll make you feel like you're cheating at dialogflow
```

![df-cheats](https://github.com/valgaze/df-cheat-docs/blob/master/assets/df_cheatcodes.gif?raw=true)

---

**Note:** For the very impatient, go here: **[quickstart.md](https://github.com/valgaze/df-cheatcodes/blob/master/quickstart.md)**

---

## Overview

df-cheatcodes is a library exposing useful aliases, shortcuts, functionality/[sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) that can help teams **quickly** produce a rich browser-based conversational experience that they can put in front of real users for feedback & improvement. See **[below](#Functionality)** features.

Ex. Rich components **[the fast & easy way](https://github.com/valgaze/df-cheatcodes/blob/master/docs/aogCheat.md)** (notice no imports)

![richcomponents](https://raw.githubusercontent.com/valgaze/df-cheat-docs/master/assets/df-cheatcodes-action.gif)

Ex. **["\$hortcut Cheats"](https://github.com/valgaze/df-cheatcodes/blob/master/docs/shortcutCheat.md)** to quickly jump around your conversational interface & expose rich functionality. (Think of these as similiar to **[deep links](https://www.raywenderlich.com/6080-universal-links-make-the-connection)** but here it's deep linking to functionality of your intelligent agent)

![shortcut](https://github.com/valgaze/df-cheat-docs/blob/master/ex/ex3_shortcuts.gif?raw=true)

Plus a bunch of other stuff (helpers for working with API, frontend, external templates, random responses, retrieve/set data, etc)

## Where to start?

- If you've never really used DialogFlow before, start here & do the exercises to learn the basics: **[https://github.com/valgaze/dialogflow-speedrun](https://github.com/valgaze/dialogflow-speedrun)**

- Also see for a curated list of tutorials, docs & other useful resources: **[https://github.com/valgaze/df-starter-kit/blob/master/docs/resources.md](https://github.com/valgaze/df-starter-kit/blob/master/docs/resources.md)**

## Other Components

### df-starter-kit

- **Details:** **[https://github.com/valgaze/df-starter-kit](https://github.com/valgaze/df-starter-kit)**

_Fully-loaded DialogFlow "starter" project with an agent, fulfillment template, and a frontend that renders rich components. Also has various ergonomic features to speed development like live-reload, types, tunneling, easy deploy/bundling to a web server or optimized for cloud functions_

### df-frontend-vue

- **Details:** **[https://github.com/valgaze/df-frontend-vue](https://github.com/valgaze/df-frontend-vue)**

_A fun "retro" DialogFlow frontend interface that can render rich components with many conversational design & debugging tools. A "bundled" version is included with starter kit, this one you can edit or skin however you need_

### df-cheatcodes-base

- **Details:** **[https://github.com/valgaze/df-cheatcodes-base](https://github.com/valgaze/df-cheatcodes-base)**

_Most helpful for "frontend" tasks and transacating with DialogFlow APIs. Makes it easy to send plaintext, [events](https://cloud.google.com/dialogflow/docs/events-custom), and [requestdata](https://cloud.google.com/dialogflow/docs/reference/rest/v2/QueryParameters)_

## Functionality

### aogCheat

- **Details:** **[aogCheat.md](https://github.com/valgaze/df-cheatcodes/blob/master/docs/aogCheat.md)**

_Collection of helpers to augment the actions-on-google library and make working with rich components, contexts, data, 3rd-party APIs, and other tasks faster & easier_

### apiCheat

- **Details:** **[api.md](https://github.com/valgaze/df-cheatcodes/blob/master/docs/api.md)**

_Helpful items for transacting with the API, can optionally transform gRPC <> JSON for event, request data as required_

### shortcutCheat

- **Details:** **[shortcutCheat.md](https://github.com/valgaze/df-cheatcodes/blob/master/docs/shortcutCheat.md)**

_A trick to expose 'shareable' (copy/paste, links) points of your conversation-- useful for debugging and for users who aren't interested in a 'chat'_

### requestCheat

- **Details:** **[requstCheat.md](https://github.com/valgaze/df-cheatcodes/blob/master/docs/requestCheat.md)**

_Various helpers to help simplify building requests_

## endpointCheat

_Add this so your server routes can handle DialogFlow requests (events, text, requestdata, etc) from a frontend or other services_

Ex. Easy server (could certainly be repurposed into a **[Cloud Function](https://cloud.google.com/functions)**)

```ts
import express from "express";
import bodyParser from "body-parser";
import { endPointCheat } from "df-cheatcodes";

// Initialize simple server
const app = express();
app.use(bodyParser.json());

// Prep credentials + config
import { project_id, client_email, private_key } from "./service-account.json";
const credentials = { project_id, client_email, private_key };

// all optional
const config = {
  transformgrpc: false, // convert JSON to protostruct for requestData, event parameters, protostruct to JSON for responses
  optimizeResponse: false, // combine webhookPayload + fulfillmentMessages
};

app.post("/chat", endpointCheat(credentials, config));
```

**Libraries**

df-cheatcodes provides cheats using **[actions-on-google](https://www.npmjs.com/package/actions-on-google)** `^2.12.0` & **[dialogflow](https://www.npmjs.com/package/@google-cloud/dialogflow)** `^1.2.0` as peerDependencies.

## License

This repo uses types & concepts from **[actions-on-google](https://github.com/actions-on-google/actions-on-google-nodejs)** which itself is under apache license. At time of writing, it seemed that clearest/simplest thing to do is match that license in a notice-- accordingly, this repo conforms to the **[Apache 2.0 license](LICENSE)**
