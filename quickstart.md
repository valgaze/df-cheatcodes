## install it!

```
npm i df-cheatcodes --save
```

## use it!

ex. intent_handler.ts:

```ts
import { dialogflow } from "actions-on-google";

import { convCheat } from "df-cheatcodes";

// types
import { DFCheatConversation } from "df-cheatcodes";

const app = dialogflow();
app.use(convCheat());

app.intent("intent 123", async (conv: DFCheatConversation) => {
  // Pick random (this could/should be an external file)
  conv.cheat.pickRandom([
    "Hi there",
    "Hey how are you doing?",
    "Hallo",
    "Bonjour!",
  ]);

  const flavor = `mint`;

  // Pick a random templatized response
  conv.cheat.template(
    [
      `Don't know if your name is actually '$[name]', but here's a $[flavor] icecream anyway`,
      `Here is a $[flavor] icecream, $[name]`,
      `$[name], here's your $[flavor]`,
      `Hey there $[name], here's your $[flavor]`,
    ],
    { name: "Joe", flavor }
  );

  // Interact with APIs
  const res = await conv.cheat.get("https://swapi.py4e.com/api/people/1");
  conv.ask(`The name is ${res.data.name}`);

  // Save data
  conv.cheat.saveData("characterName", res.data.name);

  // contexts
  conv.cheat.addContext("myContext", 3, { a: 1, b: 2 });
  const data = conv.cheat.getContextData("myContext");
});
```

## Web server

```ts
// middleware, endpoint, transform/no transform opt
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import service_account from "./service-account.json";

const port = process.env.port || 8000;
const server = express();

server.use(cors({ origin: true }));
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

server.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

const app = dialogflow();

import handler from "./../webhook/express_handler";
app.post("/webhook", handler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```
