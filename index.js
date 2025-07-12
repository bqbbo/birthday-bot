import getToken from "./src/getToken.js";
import loadCommands from "./src/loadCommand.js";
import * as handler from "./src/handler/index.js";

const TOKEN = getToken();

import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

loadCommands(client);

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    handler.handleCommandInteraction(interaction);
});

client.login(TOKEN);
