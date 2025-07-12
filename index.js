import { Client, GatewayIntentBits } from "discord.js";

import getToken from "./src/getToken.js";
import loadCommands from "./src/loadCommand.js";
import loadEvents from "./src/loadEvent.js";

const token = getToken();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

loadCommands(client);
loadEvents(client);

client.login(token);
