import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("server-count")
        .setDescription("Returns the number of servers the bot is in."),
    async execute(interaction) {
        await interaction.reply(
            `The bot is in ${interaction.client.guilds.cache.size} servers.`
        );
    },
};
