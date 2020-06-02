## API Cheat

Helpers for contexts, sessions, detect intent, gRPC/Protostruct transformation, etc

Note: You'll need a `service account` key file to transact with DialogFlow APIs, see **[here](./service_account.md)** for details

## Simple example

```ts
import { apiCheat, requestCheat } from "df-cheatcodes";

import credentials from "./service-account.json";
// All optional
const config = {
  transformgrpc: false, // convert JSON to protostruct for requestData, event parameters
};

const cheat = apiCheat(credentials, config);
async function main() {
  const req = requestCheat.buildTxt("hello!"); //  queryInput: { text: { text: "hello", languageCode: "en_US" } }
  const res = await cheat.detectIntent(req);
  console.log(`<response detectIntent>`, res);
}

main();
```

## Use as endpoint

```ts
import express from "express";
import bodyParser from "body-parser";
import { endPointCheat } from "df-cheatcodes";
const port = process.env.port || 8000;

// Initialize simple server
const app = express();
app.use(bodyParser.json());

// Prep credentials + config
import { project_id, client_email, private_key } from "./service-account.json";
const credentials = { project_id, client_email, private_key };

// all optional
const config = {
  transformgrpc: false, // convert JSON to protostruct for requestData, event parameters, protostruct to JSON for responses
};

app.post("/chat", endpointCheat(credentials, config));

app.listen(port, () => {
  console.log(`Readying on port ${port}`);
});
```

POST to /chat:

```json
{
  "session": "12343453",
  "queryInput": {
    "text": {
      "text": "password recovery",
      "languageCode": "en-us"
    }
  }
}
```
