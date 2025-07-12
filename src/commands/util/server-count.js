import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("server-count")
        .setDescription("Returns the number of servers the bot is in."),
    async execute(interaction) {
        const count = interaction.client.guilds.cache.size;
        const serverWord = count === 1 ? "server" : "servers";
        await interaction.reply(`The bot is in ${count} ${serverWord}.`);
    },
};
