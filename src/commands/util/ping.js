import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns ping in ms."),
    async execute(interaction) {
        await interaction.reply(
            `Pong! ${Date.now() - interaction.createdTimestamp}ms`
        );
    },
};
