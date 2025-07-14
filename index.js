import { Client, GatewayIntentBits } from "discord.js";

import getToken from "./src/getToken.js";
import loadCommands from "./src/loadCommand.js";
import loadEvents from "./src/loadEvent.js";
import connectToDatabase from "./src/db/db.js";
import { checkBirthdays } from "./src/birthdayScheduler.js";

const token = getToken();

connectToDatabase();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

loadCommands(client);
loadEvents(client);

setInterval(() => {
    checkBirthdays(client);
}, 60 * 1000);

client.login(token);
