![df-cheats](https://github.com/valgaze/df-cheat-docs/blob/master/assets/df_cheatcodes.gif?raw=true)

```
tl:dr; So easy it'll make you feel like you're cheating at dialogflow
```

---

**Note:** For the very impatient, go here: **[quickstart.md](https://github.com/valgaze/df-cheatcodes/blob/master/quickstart.md)**

If you need more pieces (ie a web-based frontend interface, **[fulfillment webhook](https://cloud.google.com/dialogflow/docs/fulfillment-overview)**, etc), see **["Where to start?"](#where-to-start)**

## Overview

df-cheatcodes is a library exposing useful aliases, shortcuts, functionality/[sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) that can help teams **quickly** produce a conversational experience that they can put in front of real users for feedback & improvement.

Ex. Rich components the fast & easy way (notice no imports)

![richcomponens](https://raw.githubusercontent.com/valgaze/df-cheat-docs/master/assets/df-cheatcodes-action.gif)

Ex. "\$hortcut Cheats" to quickly jump around your conversational interface & expose rich functionality. (Think of these as similiar to **[deep links](https://www.raywenderlich.com/6080-universal-links-make-the-connection)** but here it's deep linking to functionality of your intelligent agent)

![shortcut](https://github.com/valgaze/df-cheat-docs/blob/master/ex/ex3_shortcuts.gif?raw=true)

Ex. Easy server (can put into a **[Cloud Function](https://cloud.google.com/functions)**)

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

Plus a bunch of other stuff (helpers for working with API, frontend, templates, random responses, retrieve/set data, etc)

## Where to start?

- If you've never really used DialogFlow before, start here & do the exercises to learn the basics: https://github.com/valgaze/dialogflow-speedrun

- Then if your agent needs to call external APIs to retrieve data, see here for a batteries-included starter conversation w/ a simple frontend that renders rich components: **[df-starter-tkit](https://github.com/valgaze/df-starter-kit)**

- If you want a frontend w/ useful conversation debugging features that you can extend/modify/style as needed, see a reference implementation for **["CheatChat"](https://github.com/valgaze/df-frontend-vue)**

- If you've already used DialogFlow & have an agent in place but want to opportunistically use df-cheatcodes features see the **[quickstart.md](https://github.com/valgaze/df-cheatcodes/blob/master/quickstart.md)**

## Functionality

### aogCheat

- **Details:** **[aogCheat.md](https://github.com/valgaze/df-cheatcodes/blob/master/docs/aogCheat.md)**

_Collection of helpers to augment the actions-on-google library and make working with rich components, contexts, data, 3rd-party APIs, and other tasks faster & easier_

### apiCheat

- **Details:** **[api.md](https://github.com/valgaze/df-cheatcodes/blob/master/docs/api.md)**

_Helpful items for transacting with the API, can optionally transform gRPC <> JSON for event, request data as required_

## endpointCheat

_Add this so your server routes can handle DialogFlow requests (events, text, requestdata, etc) from a frontend or other service_

### shortcutCheat

- **Details:** **[shortcutCheat.md](https://github.com/valgaze/df-cheatcodes/blob/master/docs/shortcutCheat.md)**

_A trick to expose 'shareable' (copy/paste, links) points of your conversation-- useful for debugging and for users who aren't interested in a 'chat'_

### requestCheat

- **Details:** **[requstCheat.md](https://github.com/valgaze/df-cheatcodes/blob/master/docs/requestCheat.md)**

_Various helpers to help simplify building requests_

**Libraries**

df-cheatcodes provides cheats using **[actions-on-google](https://www.npmjs.com/package/actions-on-google)** `^2.12.0` & **[dialogflow](https://www.npmjs.com/package/@google-cloud/dialogflow)** `^1.2.0` as peerDependencies.

## License

This repo uses types & concepts from **[actions-on-google](https://github.com/actions-on-google/actions-on-google-nodejs)** which itself is under apache license. At time of writing, it seemed that clearest/simplest thing to do is match that license in a notice-- accordingly, this repo conforms to the **[Apache 2.0 license](LICENSE)**
