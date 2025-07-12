import { Events } from "discord.js";
import * as handler from "./handler/index.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        await handler.handleCommandInteraction(interaction);
    },
};
