// import { dialogflow } from "actions-on-google";
// import { send } from "./helper";
// // import { Carousel, Image } from "actions-on-google";}
// // Cheatcodes
// import { convCheat } from "./../src";
// import { apiCheat, requestCheat } from "./../src";

// import { project_id, client_email, private_key } from "./service-account.json";

// // Types
// import { DFCheatConversation } from "./../src";
// // import { BrowseCarouselItem, Image } from "actions-on-google";
// // import { RequestCheat } from "./../src/index";
// // import { apiCheat, requestCheat } from "./../src";
// // import { project_id, client_email, private_key } from "./service-account.json";
// // const credentials = {
// //   project_id,
// //   client_email,
// //   private_key,
// // };
// // All optional

// //   const config = {
// //     transformRequests: false, // convret JSON to protostruct for requestData, event parameters
// //     transformResponse: false, // Protostrut to JSON
// //     optimizeResponse: false // combine webhookPayload + fulfillmentMessages
// //  }
// //  const cheat = new apiCheat(credentials, config)

// // const req = requestCheat.buildTxt('hello!') //  // queryInput: { text: { text: "hello world", languageCode: "en_US" } }
// // const res = await cheat.detectIntent(req)

// const app = dialogflow();
// app.use(convCheat());
// app.intent("gg", async (conv: DFCheatConversation) => {
//   conv.ask("hi");

//   conv.cheat.suggestions

//   conv.cheat.card({
//     text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
//     subtitle: "Here's your subtitle",
//     title: `Here's your large mint`,
//     button: {
//       title: `Learn more about mint ice cream`,
//       url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
//     },
//     image: {
//       url: "https://i.imgur.com/W9Eeuu1.jpg",
//       alt: "Mint!",
//     },
//  });
//    // conv.cheat.saveData("x", { a: 4 });
//   // conv.cheat.saveData("yy", { b: 5577 });
//   // const config = {
//   //   method: "get",
//   //   headers: {
//   //     Accept: "application/json",
//   //   },
//   //   url: "https://icanhazdadjoke.com",
//   // };
//   // const jokeRes = await conv.cheat.api(config);
//   // const { joke, id } = jokeRes.data;
//   // console.log(`${id}: '${joke}'`);
//   // conv.ask(`Here's the joke: ${joke} har har`);
//   // {"name":"Luke Skywalker","height":"172","mass":"77","hair_color":"blond","skin_color":"fair","eye_color":"blue","birth_year":"19BBY","gender":"male","homeworld":"https://swapi.py4e.com/api/planets/1/","films":["https://swapi.py4e.com/api/films/1/","https://swapi.py4e.com/api/films/2/","https://swapi.py4e.com/api/films/3/","https://swapi.py4e.com/api/films/6/","https://swapi.py4e.com/api/films/7/"],"species":["https://swapi.py4e.com/api/species/1/"],"vehicles":["https://swapi.py4e.com/api/vehicles/14/","https://swapi.py4e.com/api/vehicles/30/"],"starships":["https://swapi.py4e.com/api/starships/12/","https://swapi.py4e.com/api/starships/22/"],"created":"2014-12-09T13:50:51.644000Z","edited":"2014-12-20T21:17:56.891000Z","url":"https://swapi.py4e.com/api/people/1/"}
//   // const res = await conv.cheat.get("https://swapi.py4e.com/api/people/1");
//   // console.log(`\n\n##The name is ${res.data.name}\n\n##\n\n`);
//   // const res = await conv.cheat.get("https://swapi.py4e.com/api/people/1");
//   // conv.ask(res.data.name);
//   // const config = {
//   //   method: "get",
//   //   headers: {
//   //     Accept: "application/json",
//   //     "User-Agent": "testing_sample",
//   //   },
//   //   url: "https://icanhazdadjoke.com/j/R7UfaahVfFd",
//   // };
//   // const theJoke = await conv.cheat.api(config);
//   // const { joke } = theJoke.data;
//   // conv.ask(joke);
//   // const newUser = await conv.cheat.post("https://reqres.in/api/users", {
//   //   name: "Joe",
//   //   job: "leader",
//   // });
//   // conv.ask(JSON.stringify(newUser.data));
//   // conv.ask("Hey look a list");
//   // conv.cheat.list({
//   //   items: {
//   //     key1: {
//   //       title: "Number one",
//   //       synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
//   //     },
//   //     key2: {
//   //       title: "Number two",
//   //       synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
//   //     },
//   //   },
//   // });
//   // conv.ask("Look a custom component...");
//   // conv.cheat.addCustom("bongo", { a: 1, b: 2, c: ["yay", "hi", "bonjour"] });
//   // conv.cheat.addCustom("bingo", { e: 3, f: 4 });
//   // conv.cheat.addVideo(
//   //   "https://www.youtube.com/watch?v=bvf5DlhvJJE",
//   //   "Conan & Jordan Schlansky’s Italian Road Trip",
//   //   {
//   //     autoplay: true,
//   //   }
//   // );
//   // conv.ask("setting data...");
//   // const fakeTimestamp = () => "1588535509116";
//   // conv.cheat.saveData("a", { timestamp: fakeTimestamp(), codeword: "bongo" });
//   // conv.cheat.saveData("b", { a: 1, b: 2, c: 3 });
//   // conv.ask(`Data ta-da: ${JSON.stringify(conv.cheat.getData("a"))}`);
//   // conv.ask(`2] Data ta-da: ${JSON.stringify(conv.cheat.getData("b"))}`);
//   // conv.ask("We're about to lose all responses");
//   // conv.cheat.triggerEvent("my event", { a: 1, b: 2 });
//   // conv.ask("Setting contexts");
//   // conv.cheat.addContext("myContext1", 3, { a: 1, b: 2, c: 3 });
//   // const data = conv.cheat.getContextData("myContext1");
//   // conv.ask(`Here's the context data: ${JSON.stringify(data)}`);
//   // conv.cheat.addContext("myContext2", 2, { a: 1, b: 2, c: 3 });
//   // conv.cheat.removeContext("myContext2");
//   // conv.ask(`Here's a browse carousel`);
//   // conv.cheat.browseCarousel({
//   //   items: [
//   //     new BrowseCarouselItem({
//   //       title: "Title of item 1",
//   //       url: "https://example.com",
//   //       description: "Description of item 1",
//   //       image: new Image({
//   //         url:
//   //           "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
//   //         alt: "Image alternate text",
//   //       }),
//   //       footer: "Item 1 footer",
//   //     }),
//   //     new BrowseCarouselItem({
//   //       title: "Title of item 2",
//   //       url: "https://example.com",
//   //       description: "Description of item 2",
//   //       image: new Image({
//   //         url:
//   //           "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
//   //         alt: "Image alternate text",
//   //       }),
//   //       footer: "Item 2 footer",
//   //     }),
//   //   ],
//   // });
//   // conv.ask("Here's a random choice...");
//   // conv.cheat.suggestions(["option1", "option2", "option3"]);
//   // conv.cheat.pickRandom(["Response1", "Response2"]);
//   // conv.cheat.suggestions(["option1", "option2", "option3"]);
//   // conv.ask(`Here's a rich media object`);
//   // conv.cheat.media({
//   //   name: "Jazz in Paris",
//   //   url: "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
//   //   description: "A funky Jazz tune",
//   //   icon: {
//   //     url: "http://storage.googleapis.com/automotive-media/album_art.jpg",
//   //     alt: "Media icon",
//   //   },
//   // });

//   // const data = { a: 1, b: 2 };
//   // conv.ask("This is just text");
//   // conv.cheat.addCustom("bongo", data);
//   // https://stackoverflow.com/a/31977540
//   //   conv.ask("Here's a table!");
//   //   conv.cheat.table({
//   //     dividers: true,
//   //     columns: ["header 1", "header 2", "header 3"],
//   //     rows: [
//   //       ["row 1 item 1", "row 1 item 2", "row 1 item 3"],
//   //       ["row 2 item 1", "row 2 item 2", "row 2 item 3"],
//   //     ],
//   //   });
//   // });
//   // conv.cheat.carousel({
//   //   items: {
//   //     key1: {
//   //       title: "Chocolate ice cream",
//   //       description: "Description of number one",
//   //       synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
//   //       image: {
//   //         url: "https://i.imgur.com/uMtF8ah.jpg",
//   //         alt: "chocolate ice cream",
//   //       },
//   //     },
//   //     key2: {
//   //       title: "Number two",
//   //       description: "Description of number one",
//   //       synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
//   //       image: {
//   //         url: "https://i.imgur.com/W9Eeuu1.jpg",
//   //         alt: "mint ice cream",
//   //       },
//   //     },
//   //   },
//   // });
//   // conv.cheat.addVideo(
//   //   "https://www.youtube.com/watch?v=6A8W77m-ZTw",
//   //   "2013: Conan Busts Jordan Schlansky & His Elitist Espresso Machine - CONAN on TBS"
//   // );
//   // conv.cheat.card({
//   //   text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
//   //   subtitle: "Here's your subtitle",
//   //   title: `Here's your large mint`,
//   //   button: {
//   //     title: `Learn more about mint ice cream`,
//   //     url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
//   //   },
//   //   image: {
//   //     url: "https://i.imgur.com/W9Eeuu1.jpg",
//   //     alt: "Mint!",
//   //   },
//   // });
//   // conv.ask(
//   //   new BasicCard({
//   //     text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
//   //     subtitle: "Here's your subtitle",
//   //     title: `Here's your large mint`,
//   //     buttons: [
//   //       new Button({
//   //         title: `Learn more about mint ice cream`,
//   //         url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
//   //       }),
//   //     ],
//   //     image: new Image({
//   //       url: "https://i.imgur.com/W9Eeuu1.jpg",
//   //       alt: "Mint!",
//   //     }),
//   //   })
//   // );
// });

// app.fallback((conv: DFCheatConversation) => {
//   conv.ask("fallback");
// });

// app.intent("intent 123", async (conv: DFCheatConversation) => {
//   // Pick random
//   conv.cheat.pickRandom([
//     "Hi there",
//     "Hey how are you doing?",
//     "Hallo",
//     "Bonjour!",
//   ]);

//   // Interact with APIs
//   const res = await conv.cheat.get("https://swapi.py4e.com/api/people/1");
//   conv.ask(`The name is ${res.data.name}`);

//   // Save data
//   conv.cheat.saveData("characterName", res.data.name);

//   // contexts
//   conv.cheat.addContext("myContext", 3, { a: 1, b: 2 });
//   const data = conv.cheat.getContextData("myContext");

//   // card
//   conv.cheat.card({
//     text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
//     subtitle: "Here's your subtitle",
//     title: `Here's your large mint`,
//     button: {
//       title: `Learn more about mint ice cream`,
//       url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
//     },
//     image: {
//       url: "https://i.imgur.com/W9Eeuu1.jpg",
//       alt: "Mint!",
//     },
//   });

//   // carousel
//   conv.ask("Which of these looks good?");
//   conv.cheat.carousel({
//     items: {
//       key1: {
//         title: "Chocolate ice cream",
//         description: "Description of number one",
//         synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
//         image: {
//           url: "https://i.imgur.com/uMtF8ah.jpg",
//           alt: "chocolate ice cream",
//         },
//       },
//       key2: {
//         title: "Number two",
//         description: "Description of number one",
//         synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
//         image: {
//           url: "https://i.imgur.com/W9Eeuu1.jpg",
//           alt: "mint ice cream",
//         },
//       },
//     },
//   });
// });

// /*

// x

// */

// app.intent("my intent", (conv: DFCheatConversation) => {
//   conv.ask("You matched 'my intent'");

//   conv.cheat.addContext("myContext", 3, { a: 1, b: 2 });

//   const data = conv.cheat.getContextData("myContext");

//   conv.cheat.card({
//     text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
//     subtitle: "Here's your subtitle",
//     title: `Here's your large mint`,
//     button: {
//       title: `Learn more about mint ice cream`,
//       url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
//     },
//     image: {
//       url: "https://i.imgur.com/W9Eeuu1.jpg",
//       alt: "Mint!",
//     },
//   });

//   conv.cheat.suggestions(["more ice cream", "tell me a joke"]);

//   const icecreamCount = 1;
//   conv.cheat.saveData("icecreamCount", icecreamCount);
// });

// async function main() {
//   // const session = RequestCheat.buildSession();
//   // const backend = "http://localhost:8000/chat";
//   // const languageCode = "en_US"; // (optonal), defauls to 'en_US'
//   // const transformGRPC = true; // (optional)
//   // const config = {
//   //   session,
//   //   languageCode,
//   //   transformGRPC,
//   //   backend,
//   // };
//   // const requester = new RequestCheat(config);

//   // const group1 = { kind: "text", payload: { text: "Hello" } };
//   // console.log("1", requester.constructRequest(group1));

//   // const group2 = {
//   //   kind: "event",
//   //   payload: {
//   //     name: "my event",
//   //     parameters: { xxx: 12345 }, // event parametres
//   //   },
//   //   requestData: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] },
//   // };
//   // console.log("2", JSON.stringify(requester.constructRequest(group2)));

//   // const res = await requester.send("hello!!");
//   // console.log("Result", JSON.stringify(res));

//   // const txt = RequestCheat.buildRequest({
//   //   kind: "text",
//   //   payload: { text: "Hello world" },
//   // });

//   // const rootdata = { a: 1, b: 2, c: ["hi", "yay", "bonjour"] };
//   // const fixy = RequestCheat._json2proto(rootdata);

//   // const evty = RequestCheat.buildRequest({
//   //   kind: "event",
//   //   payload: {
//   //     name: "my event",
//   //     parameters: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] },
//   //   },
//   //   config: {
//   //     transformGRPC: true,
//   //   },
//   // });

//   // const evty = RequestCheat.buildRequest({
//   //   kind: "event",
//   //   payload: {
//   //     name: "my event",
//   //     parameters: { a: 1, b: 2, c: ["hi", "yay", "bonjour"] },
//   //   },
//   //   config: {
//   //     transformGRPC: true,
//   //   },
//   // });

//   // const evty = RequestCheat.buildTxt("hello world");
//   // const evty = RequestCheat.event(
//   //   "myevent",
//   //   { xxx: 12345 },
//   //   undefined,
//   //   {
//   //     a: 1,
//   //     b: 2,
//   //     c: ["hi", "yay", "bonjour"],
//   //   },
//   //   true
//   // );
//   // console.log("\n**********\n");
//   // // console.log(rootdata, "\n");
//   // console.log(JSON.stringify(evty));

//   // const txt = RequestCheat.buildTxt("hello");
//   // { queryInput: { text: { text: 'hello', languageCode: 'en_US' } } }

//   // const textRequestdata = RequestCheat.buildRequest();

//   // const send = async (
//   //   intentName: string,
//   //   project = "projectid1234",
//   //   session = "123456789"
//   // ) => {
//   //   const AOG_DATA = {};
//   //   const aog = {
//   //     name: `projects/${project}/agent/sessions/${session}/contexts/_actions_on_google`,
//   //     lifespanCount: 99,
//   //     parameters: { data: AOG_DATA },
//   //   };
//   //   const req = {
//   //     queryResult: {
//   //       intent: { displayName: intentName },
//   //       outputContexts: [aog],
//   //     },
//   //   };
//   //   const res = await app(req, {}).catch((e: any) => console.log("#", e));
//   //   console.log(`<# Output for ${intentName}: >`, JSON.stringify(res.body));
//   //   return res;
//   // };

//   // const set = new apiCheat();
//   // console.log("\n**********\n");
//   // // console.log(rootdata, "\n");
//   // console.log(JSON.stringify(evty));

//   const credentials = {
//     project_id,
//     client_email,
//     private_key,
//   };

//   const config = {
//     transformRequests: false, // convert JSON to protostruct for requestData, event parameters
//     transformResponse: false, // Protostrut to JSON
//     optimizeResponse: false, // combine webhookPayload + fulfillmentMessages
//   };

//   const inst = apiCheat(credentials, config);
//   const req = requestCheat.buildTxt("Hello");
//   console.log("\n\n", req);
//   const res = await inst.detectIntent(req);
//   console.log(">", res);

//   const gg = await send(app, "gg");
//   console.log(`<# Output for gg: >`, JSON.stringify(gg.body));

//   const fb = await send(app, "fallback");
//   console.log(`<# Output for fb: >`, JSON.stringify(fb.body));
// }

// main();
