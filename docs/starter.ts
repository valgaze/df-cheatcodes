import { dialogflow } from "actions-on-google";
import { convCheat } from "df-cheatcodes";

// types
import { DFCheatConversation } from "df-cheatcodes";

const app = dialogflow();
app.use(convCheat());

app.intent("intent 123", async (conv: DFCheatConversation) => {
  // Pick random
  conv.cheat.pickRandom([
    "Hi there",
    "Hey how are you doing?",
    "Hallo",
    "Bonjour!",
  ]);

  // Interact with APIs
  const res = await conv.cheat.get("https://swapi.py4e.com/api/people/1");
  conv.ask(`The name is ${res.data.name}`);

  // Save data
  conv.cheat.saveData("characterName", res.data.name);

  // contexts
  conv.cheat.addContext("myContext", 3, { a: 1, b: 2 });
  const data = conv.cheat.getContextData("myContext");
});
